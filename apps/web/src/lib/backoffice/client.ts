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

async function backofficeFetch<T>(path: string, init?: RequestInit): Promise<T | null> {
  const base = getBackofficeBaseUrl();
  if (!base) return null;

  try {
    const response = await fetch(`${base}${path}`, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...init?.headers,
      },
      cache: "no-store",
      signal: init?.signal ?? AbortSignal.timeout(15000),
    });

    if (!response.ok) {
      console.error(`[backoffice] ${path} failed: ${response.status}`);
      return null;
    }
    return (await response.json()) as T;
  } catch (error) {
    console.error(
      `[backoffice] ${path} unreachable:`,
      error instanceof Error ? error.message : error,
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
      signal: AbortSignal.timeout(8000),
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

export async function fetchBackofficeListingsPage(
  query: BackofficeListingsQuery = {},
): Promise<BackofficeListingsResponse | null> {
  if (!isBackofficeConfigured()) return null;

  const params = new URLSearchParams();
  if (query.category) params.set("category", query.category);
  if (query.city) params.set("city", query.city);
  if (query.featured) params.set("featured", "true");
  if (query.organization) params.set("organization", query.organization);
  params.set("page", String(query.page ?? 1));
  params.set("limit", String(query.limit ?? DEFAULT_LIMIT));

  return backofficeFetch<BackofficeListingsResponse>(
    `/api/marketplace/v1/listings?${params.toString()}`,
  );
}

export async function fetchBackofficeListings(
  query: BackofficeListingsQuery = {},
): Promise<BackofficePublicListing[]> {
  const payload = await fetchBackofficeListingsPage(query);
  return payload?.data ?? [];
}

export async function fetchAllBackofficeListings(
  query: Omit<BackofficeListingsQuery, "page" | "limit"> = {},
): Promise<BackofficePublicListing[]> {
  const all: BackofficePublicListing[] = [];
  let page = 1;

  while (page <= MAX_PAGES) {
    const payload = await fetchBackofficeListingsPage({
      ...query,
      page,
      limit: DEFAULT_LIMIT,
    });
    const batch = payload?.data ?? [];
    all.push(...batch);

    const total = payload?.meta?.total;
    if (batch.length < DEFAULT_LIMIT) break;
    if (typeof total === "number" && all.length >= total) break;
    page += 1;
  }

  return all;
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
      signal: AbortSignal.timeout(15000),
    });

    if (response.status === 404) {
      return { status: "not_found" };
    }

    if (!response.ok) {
      console.error(
        `[backoffice] /api/marketplace/v1/listings/${id} failed: ${response.status}`,
      );
      return { status: "error" };
    }

    const payload = (await response.json()) as BackofficeListingResponse;
    if (!payload?.data) return { status: "not_found" };
    return { status: "ok", listing: payload.data };
  } catch (error) {
    console.error(
      `[backoffice] /api/marketplace/v1/listings/${id} unreachable:`,
      error instanceof Error ? error.message : error,
    );
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
      signal: AbortSignal.timeout(8000),
    });
  } catch {
    // non-blocking
  }
}

export { isBackofficeConfigured };
