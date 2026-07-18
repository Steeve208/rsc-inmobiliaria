import { NextResponse } from "next/server";

type RateLimitEntry = {
  count: number;
  resetAt: number;
};

const store = new Map<string, RateLimitEntry>();

const MAX_KEYS = 10_000;

function pruneExpired(now: number) {
  if (store.size < MAX_KEYS) return;
  for (const [key, entry] of store) {
    if (entry.resetAt <= now) store.delete(key);
  }
  if (store.size >= MAX_KEYS) {
    const oldest = store.keys().next().value;
    if (oldest) store.delete(oldest);
  }
}

export function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  return request.headers.get("x-real-ip")?.trim() || "unknown";
}

export function rateLimit(input: {
  key: string;
  limit: number;
  windowMs: number;
}): { ok: true } | { ok: false; retryAfterSec: number } {
  const now = Date.now();
  pruneExpired(now);

  const existing = store.get(input.key);
  if (!existing || existing.resetAt <= now) {
    store.set(input.key, { count: 1, resetAt: now + input.windowMs });
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

export function rateLimitResponse(retryAfterSec: number) {
  return NextResponse.json(
    { error: "rate_limited" },
    {
      status: 429,
      headers: { "Retry-After": String(retryAfterSec) },
    },
  );
}

/** Returns a 429 response when limited, otherwise null. */
export function enforceRateLimit(
  request: Request,
  bucket: string,
  limit: number,
  windowMs: number,
): Response | null {
  const result = rateLimit({
    key: `${bucket}:${clientIp(request)}`,
    limit,
    windowMs,
  });
  if (!result.ok) return rateLimitResponse(result.retryAfterSec);
  return null;
}
