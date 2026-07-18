import { sql } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

type RateLimitEntry = {
  count: number;
  resetAt: number;
};

type RateLimitResult = { ok: true } | { ok: false; retryAfterSec: number };

/** Per-isolate fallback when DB is unavailable. */
const memoryStore = new Map<string, RateLimitEntry>();
const MAX_MEMORY_KEYS = 5_000;

/**
 * Short negative cache: once limited, skip DB until reset (or a few seconds).
 * Cuts Postgres load during 429 floods without weakening the shared counter.
 */
const blockedUntil = new Map<string, number>();
const MAX_BLOCKED_KEYS = 5_000;

let lastCleanupAt = 0;
const CLEANUP_MIN_INTERVAL_MS = 60_000;

function pruneMap(map: Map<string, number | RateLimitEntry>, max: number, now: number) {
  if (map.size < max) return;
  for (const [key, value] of map) {
    const expiry =
      typeof value === "number" ? value : (value as RateLimitEntry).resetAt;
    if (expiry <= now) map.delete(key);
  }
  while (map.size >= max) {
    const oldest = map.keys().next().value;
    if (!oldest) break;
    map.delete(oldest);
  }
}

function rateLimitMemory(input: {
  key: string;
  limit: number;
  windowMs: number;
}): RateLimitResult {
  const now = Date.now();
  pruneMap(memoryStore, MAX_MEMORY_KEYS, now);

  const existing = memoryStore.get(input.key);
  if (!existing || existing.resetAt <= now) {
    memoryStore.set(input.key, { count: 1, resetAt: now + input.windowMs });
    return { ok: true };
  }

  if (existing.count >= input.limit) {
    return {
      ok: false,
      retryAfterSec: Math.max(1, Math.ceil((existing.resetAt - now) / 1000)),
    };
  }

  existing.count += 1;
  return { ok: true };
}

function rememberBlocked(key: string, resetAtMs: number) {
  const now = Date.now();
  pruneMap(blockedUntil, MAX_BLOCKED_KEYS, now);
  // Cap local block to window end, but at least 2s to absorb bursts.
  blockedUntil.set(key, Math.max(now + 2_000, resetAtMs));
}

function maybeCleanupExpiredRows() {
  const now = Date.now();
  if (now - lastCleanupAt < CLEANUP_MIN_INTERVAL_MS) return;
  // ~2% of requests after the quiet interval — avoid DELETE on every hit.
  if (Math.random() > 0.02) return;
  lastCleanupAt = now;

  void db
    .execute(sql`
      DELETE FROM api_rate_limit
      WHERE "key" IN (
        SELECT "key" FROM api_rate_limit
        WHERE reset_at < NOW() - INTERVAL '10 minutes'
        LIMIT 200
      )
    `)
    .catch((error) => {
      console.warn("[rate-limit] cleanup skipped:", error);
    });
}

async function rateLimitPostgres(input: {
  key: string;
  limit: number;
  windowMs: number;
}): Promise<RateLimitResult> {
  const resetAt = new Date(Date.now() + input.windowMs);

  const rows = await db.execute<{ count: number; reset_at: Date | string }>(sql`
    INSERT INTO api_rate_limit ("key", "count", "reset_at")
    VALUES (${input.key}, 1, ${resetAt})
    ON CONFLICT ("key") DO UPDATE SET
      "count" = CASE
        WHEN api_rate_limit.reset_at <= NOW() THEN 1
        ELSE api_rate_limit.count + 1
      END,
      "reset_at" = CASE
        WHEN api_rate_limit.reset_at <= NOW() THEN EXCLUDED.reset_at
        ELSE api_rate_limit.reset_at
      END
    RETURNING "count", "reset_at"
  `);

  const row = Array.isArray(rows) ? rows[0] : undefined;
  if (!row) return { ok: true };

  const count = Number(row.count);
  const resetMs =
    row.reset_at instanceof Date
      ? row.reset_at.getTime()
      : new Date(row.reset_at).getTime();

  if (count > input.limit) {
    rememberBlocked(input.key, resetMs);
    return {
      ok: false,
      retryAfterSec: Math.max(1, Math.ceil((resetMs - Date.now()) / 1000)),
    };
  }

  return { ok: true };
}

export function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  return request.headers.get("x-real-ip")?.trim() || "unknown";
}

export function rateLimitResponse(retryAfterSec: number) {
  return NextResponse.json(
    { error: "rate_limited" },
    {
      status: 429,
      headers: { "Retry-After": String(retryAfterSec) },
    },
  );
}

/**
 * Shared rate limit via Supabase Postgres (one atomic UPSERT per check).
 * Optimizations to avoid burning the DB:
 * - negative cache for already-limited keys (no extra writes during floods)
 * - rare batched cleanup of expired rows (not on every request)
 * - memory fallback only if Postgres errors
 */
export async function enforceRateLimit(
  request: Request,
  bucket: string,
  limit: number,
  windowMs: number,
): Promise<Response | null> {
  const key = `${bucket}:${clientIp(request)}`;
  const now = Date.now();

  const blockedMs = blockedUntil.get(key);
  if (blockedMs && blockedMs > now) {
    return rateLimitResponse(Math.max(1, Math.ceil((blockedMs - now) / 1000)));
  }

  maybeCleanupExpiredRows();

  try {
    const result = await rateLimitPostgres({ key, limit, windowMs });
    if (!result.ok) return rateLimitResponse(result.retryAfterSec);
    return null;
  } catch (error) {
    console.warn(
      "[rate-limit] Postgres unavailable; using in-memory fallback for this request:",
      error,
    );
    const result = rateLimitMemory({ key, limit, windowMs });
    if (!result.ok) {
      rememberBlocked(key, now + result.retryAfterSec * 1000);
      return rateLimitResponse(result.retryAfterSec);
    }
    return null;
  }
}
