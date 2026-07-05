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

const DEFAULT_LIMIT = 50;

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
    });

    if (!response.ok) {
      console.error(`[backoffice] ${path} failed: ${response.status}`);
      return null;
    }
    return (await response.json()) as T;
  } catch {
    return null;
  }
}

export async function fetchBackofficeListings(
  query: BackofficeListingsQuery = {},
): Promise<BackofficePublicListing[]> {
  if (!isBackofficeConfigured()) return [];

  const params = new URLSearchParams();
  if (query.category) params.set("category", query.category);
  if (query.city) params.set("city", query.city);
  if (query.featured) params.set("featured", "true");
  if (query.organization) params.set("organization", query.organization);
  params.set("page", String(query.page ?? 1));
  params.set("limit", String(query.limit ?? DEFAULT_LIMIT));

  const payload = await backofficeFetch<BackofficeListingsResponse>(
    `/api/marketplace/v1/listings?${params.toString()}`,
  );

  return payload?.data ?? [];
}

export async function fetchAllBackofficeListings(
  query: Omit<BackofficeListingsQuery, "page" | "limit"> = {},
): Promise<BackofficePublicListing[]> {
  const firstPage = await fetchBackofficeListings({ ...query, page: 1, limit: DEFAULT_LIMIT });
  if (firstPage.length < DEFAULT_LIMIT) return firstPage;

  const secondPage = await fetchBackofficeListings({ ...query, page: 2, limit: DEFAULT_LIMIT });
  return [...firstPage, ...secondPage];
}

export async function fetchBackofficeListingById(
  id: string,
): Promise<BackofficePublicListing | null> {
  const payload = await backofficeFetch<BackofficeListingResponse>(
    `/api/marketplace/v1/listings/${id}`,
  );
  return payload?.data ?? null;
}

export async function incrementBackofficeListingViews(id: string): Promise<void> {
  const base = getBackofficeBaseUrl();
  if (!base) return;

  try {
    await fetch(`${base}/api/marketplace/v1/listings/${id}`, {
      method: "POST",
    });
  } catch {
    // non-blocking
  }
}

export { isBackofficeConfigured };
