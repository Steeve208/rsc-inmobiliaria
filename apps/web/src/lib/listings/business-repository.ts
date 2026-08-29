import type { BusinessListing } from "@/features/negocios/types";
import {
  fetchAllBackofficeListingsResult,
  fetchBackofficeListingById,
  isBackofficeConfigured,
} from "@/lib/backoffice/client";
import { mapBackofficeToBusinessListing } from "@/lib/backoffice/mappers";

export async function listBusinesses(): Promise<BusinessListing[]> {
  if (!isBackofficeConfigured()) return [];

  const result = await fetchAllBackofficeListingsResult({ category: "business" });
  if (result.status !== "ok") return [];
  return result.listings.map(mapBackofficeToBusinessListing);
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
