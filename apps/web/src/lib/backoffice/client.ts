import {
  getBackofficeBaseUrl,
  isBackofficeConfigured,
} from "@/lib/backoffice/config";
import type {
  BackofficeListingResponse,
  BackofficeListingsQuery,
  BackofficeListingsResponse,
  BackofficePublicListing,
} from "@/lib/backoffice/types";

const DEFAULT_LIMIT = 100;
const MAX_PAGES = 50; // up to 5000 listings per catalog fetch
/** Vercel cold starts on the backoffice can exceed 10s. */
const LISTINGS_TIMEOUT_MS = 25_000;
const HEALTH_TIMEOUT_MS = 8_000;
const EVENT_TIMEOUT_MS = 8_000;
/** Share catalog responses across home + listing pages for a short window. */
const LISTINGS_CACHE_TTL_MS = 60_000;

type CacheEntry<T> = { expires: number; value: T };

const listingsCache = new Map<string, CacheEntry<BackofficeListingsResponse | null>>();
const listingsInflight = new Map<string, Promise<BackofficeListingsResponse | null>>();
const loggedOnce = new Set<string>();

export type BackofficeListingsResult =
  | { status: "ok"; listings: BackofficePublicListing[] }
  | { status: "error" };

function logBackofficeOnce(key: string, message: string) {
  if (loggedOnce.has(key)) return;
  loggedOnce.add(key);
  // Prefer warn over error so Next.js does not open the red console overlay
  // for an expected upstream outage / cold-start timeout.
  console.warn(`[backoffice] ${message}`);
}

function isAbortOrTimeout(error: unknown) {
  if (!(error instanceof Error)) return false;
  return (
    error.name === "TimeoutError" ||
    error.name === "AbortError" ||
    /aborted due to timeout/i.test(error.message) ||
    /the operation was aborted/i.test(error.message)
  );
}

async function backofficeFetch<T>(
  path: string,
  init?: RequestInit & { timeoutMs?: number },
): Promise<T | null> {
  const base = getBackofficeBaseUrl();
  if (!base) return null;

  const { timeoutMs = LISTINGS_TIMEOUT_MS, signal: userSignal, ...rest } = init ?? {};

  try {
    const response = await fetch(`${base}${path}`, {
      ...rest,
      headers: {
        "Content-Type": "application/json",
        ...rest.headers,
      },
      cache: "no-store",
      signal: userSignal ?? AbortSignal.timeout(timeoutMs),
    });

    if (!response.ok) {
      logBackofficeOnce(`status:${path}:${response.status}`, `${path} failed: ${response.status}`);
      return null;
    }
    return (await response.json()) as T;
  } catch (error) {
    if (isAbortOrTimeout(error)) {
      logBackofficeOnce(
        `timeout:${path}`,
        `${path} timed out after ${timeoutMs}ms (backoffice cold/slow). Using fallback when available.`,
      );
      return null;
    }
    logBackofficeOnce(
      `unreachable:${path}`,
      `${path} unreachable: ${error instanceof Error ? error.message : String(error)}`,
    );
    return null;
  }
}

export async function fetchBackofficeHealth(): Promise<{
  ok: boolean;
  baseUrl: string | null;
  payload?: unknown;
}> {
  const base = getBackofficeBaseUrl();
  if (!base) return { ok: false, baseUrl: null };

  try {
    const response = await fetch(`${base}/api/marketplace/v1/health`, {
      cache: "no-store",
      signal: AbortSignal.timeout(HEALTH_TIMEOUT_MS),
    });
    const payload = (await response.json().catch(() => null)) as {
      status?: string;
    } | null;
    return {
      ok: response.ok && payload?.status === "ok",
      baseUrl: base,
      payload,
    };
  } catch {
    return { ok: false, baseUrl: base };
  }
}

function listingsCacheKey(query: BackofficeListingsQuery) {
  return [
    query.category ?? "",
    query.city ?? "",
    query.featured ? "1" : "0",
    query.organization ?? "",
    String(query.page ?? 1),
    String(query.limit ?? DEFAULT_LIMIT),
  ].join("|");
}

export async function fetchBackofficeListingsPage(
  query: BackofficeListingsQuery = {},
): Promise<BackofficeListingsResponse | null> {
  if (!isBackofficeConfigured()) return null;

  const key = listingsCacheKey(query);
  const cached = listingsCache.get(key);
  if (cached && cached.expires > Date.now()) {
    return cached.value;
  }

  const pending = listingsInflight.get(key);
  if (pending) return pending;

  const params = new URLSearchParams();
  if (query.category) params.set("category", query.category);
  if (query.city) params.set("city", query.city);
  if (query.featured) params.set("featured", "true");
  if (query.organization) params.set("organization", query.organization);
  params.set("page", String(query.page ?? 1));
  params.set("limit", String(query.limit ?? DEFAULT_LIMIT));

  const request = backofficeFetch<BackofficeListingsResponse>(
    `/api/marketplace/v1/listings?${params.toString()}`,
  ).then((payload) => {
    listingsCache.set(key, {
      expires: Date.now() + LISTINGS_CACHE_TTL_MS,
      value: payload,
    });
    listingsInflight.delete(key);
    return payload;
  });

  listingsInflight.set(key, request);
  return request;
}

export async function fetchBackofficeListings(
  query: BackofficeListingsQuery = {},
): Promise<BackofficePublicListing[]> {
  const payload = await fetchBackofficeListingsPage(query);
  return payload?.data ?? [];
}

export async function fetchAllBackofficeListingsResult(
  query: Omit<BackofficeListingsQuery, "page" | "limit"> = {},
): Promise<BackofficeListingsResult> {
  const all: BackofficePublicListing[] = [];
  let page = 1;
  let sawSuccess = false;

  while (page <= MAX_PAGES) {
    const payload = await fetchBackofficeListingsPage({
      ...query,
      page,
      limit: DEFAULT_LIMIT,
    });

    if (!payload) {
      return sawSuccess ? { status: "ok", listings: all } : { status: "error" };
    }

    sawSuccess = true;
    const batch = payload.data ?? [];
    all.push(...batch);

    const total = payload.meta?.total;
    if (batch.length < DEFAULT_LIMIT) break;
    if (typeof total === "number" && all.length >= total) break;
    page += 1;
  }

  return { status: "ok", listings: all };
}

export async function fetchAllBackofficeListings(
  query: Omit<BackofficeListingsQuery, "page" | "limit"> = {},
): Promise<BackofficePublicListing[]> {
  const result = await fetchAllBackofficeListingsResult(query);
  return result.status === "ok" ? result.listings : [];
}

export async function fetchBackofficeListingById(
  id: string,
): Promise<BackofficePublicListing | null> {
  const probed = await probeBackofficeListingById(id);
  return probed.status === "ok" ? probed.listing : null;
}

/** Distinguishes missing listings from transport/backoffice failures. */
export async function probeBackofficeListingById(
  id: string,
): Promise<
  | { status: "ok"; listing: BackofficePublicListing }
  | { status: "not_found" }
  | { status: "error" }
> {
  const base = getBackofficeBaseUrl();
  if (!base) return { status: "error" };

  try {
    const response = await fetch(`${base}/api/marketplace/v1/listings/${id}`, {
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
      signal: AbortSignal.timeout(LISTINGS_TIMEOUT_MS),
    });

    if (response.status === 404) {
      return { status: "not_found" };
    }

    if (!response.ok) {
      logBackofficeOnce(
        `status:listing:${id}:${response.status}`,
        `/api/marketplace/v1/listings/${id} failed: ${response.status}`,
      );
      return { status: "error" };
    }

    const payload = (await response.json()) as BackofficeListingResponse;
    if (!payload?.data) return { status: "not_found" };
    return { status: "ok", listing: payload.data };
  } catch (error) {
    if (isAbortOrTimeout(error)) {
      logBackofficeOnce(
        `timeout:listing:${id}`,
        `/api/marketplace/v1/listings/${id} timed out after ${LISTINGS_TIMEOUT_MS}ms`,
      );
    } else {
      logBackofficeOnce(
        `unreachable:listing:${id}`,
        `/api/marketplace/v1/listings/${id} unreachable: ${
          error instanceof Error ? error.message : String(error)
        }`,
      );
    }
    return { status: "error" };
  }
}

export async function incrementBackofficeListingViews(id: string): Promise<void> {
  await recordBackofficeListingEvent(id, "view");
}

export async function recordBackofficeListingEvent(
  id: string,
  event: "view" | "contact" | "click" | "favorite",
): Promise<void> {
  const base = getBackofficeBaseUrl();
  if (!base) return;

  try {
    await fetch(`${base}/api/marketplace/v1/listings/${id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ event }),
      signal: AbortSignal.timeout(EVENT_TIMEOUT_MS),
    });
  } catch {
    // non-blocking
  }
}

export { isBackofficeConfigured };
