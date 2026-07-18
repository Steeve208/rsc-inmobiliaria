import type { PropertyListing } from "@/features/imoveis/types";
import type { VehicleListing } from "@/features/veiculos/types";

export type FavoriteListingItem = {
  listingKind: "property" | "vehicle";
  listingId: string;
};

export type FavoriteListingsResponse = {
  properties: PropertyListing[];
  vehicles: VehicleListing[];
  missing: FavoriteListingItem[];
};

export async function fetchFavoriteListings(
  items: FavoriteListingItem[],
): Promise<FavoriteListingsResponse> {
  if (items.length === 0) {
    return { properties: [], vehicles: [], missing: [] };
  }

  const res = await fetch("/api/favorites/listings", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ items }),
  });

  if (!res.ok) {
    throw new Error("favorite_listings_failed");
  }

  const data = (await res.json()) as Partial<FavoriteListingsResponse>;
  return {
    properties: data.properties ?? [],
    vehicles: data.vehicles ?? [],
    missing: Array.isArray(data.missing) ? data.missing : [],
  };
}
