import type { ServiceListing } from "@/features/services/types";
import {
  fetchAllBackofficeListingsResult,
  fetchBackofficeListingById,
  isBackofficeConfigured,
} from "@/lib/backoffice/client";
import { mapBackofficeToServiceListing } from "@/lib/backoffice/mappers";

export async function listServices(): Promise<ServiceListing[]> {
  if (!isBackofficeConfigured()) return [];

  const result = await fetchAllBackofficeListingsResult({ category: "service" });
  if (result.status !== "ok") return [];
  return result.listings.map(mapBackofficeToServiceListing);
}

export async function getServiceById(
  id: string,
): Promise<ServiceListing | undefined> {
  if (isBackofficeConfigured()) {
    const listing = await fetchBackofficeListingById(id);
    if (listing && (listing.category === "service" || listing.category === "services")) {
      return mapBackofficeToServiceListing(listing);
    }
  }
  const catalog = await listServices();
  return catalog.find((item) => item.id === id);
}
