import { businessListings } from "@/features/negocios/mock-data";
import type { BusinessListing } from "@/features/negocios/types";
import { SHOW_MARKETPLACE_MOCKS } from "@/lib/marketplace/features";
import {
  fetchAllBackofficeListingsResult,
  fetchBackofficeListingById,
  isBackofficeConfigured,
} from "@/lib/backoffice/client";
import { mapBackofficeToBusinessListing } from "@/lib/backoffice/mappers";

export async function listBusinesses(): Promise<BusinessListing[]> {
  let live: BusinessListing[] = [];
  if (isBackofficeConfigured()) {
    const result = await fetchAllBackofficeListingsResult({ category: "business" });
    if (result.status === "ok") {
      live = result.listings.map(mapBackofficeToBusinessListing);
    }
  }
  if (!SHOW_MARKETPLACE_MOCKS) return live;

  const seen = new Set(live.map((item) => item.id));
  return [...businessListings.filter((item) => !seen.has(item.id)), ...live];
}

export async function getBusinessById(
  id: string,
): Promise<BusinessListing | undefined> {
  if (isBackofficeConfigured()) {
    const listing = await fetchBackofficeListingById(id);
    if (listing && (listing.category === "business" || listing.category === "businesses")) {
      return mapBackofficeToBusinessListing(listing);
    }
  }
  const catalog = await listBusinesses();
  return catalog.find((item) => item.id === id);
}
