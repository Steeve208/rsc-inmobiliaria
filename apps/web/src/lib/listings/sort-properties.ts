import type { ImoveisFilters, PropertyListing, PropertySort } from "@/features/imoveis/types";
import { haversineKm } from "@/lib/geocoding/geo-utils";

export function sortProperties(
  listings: PropertyListing[],
  sort: PropertySort,
  filters: ImoveisFilters,
): PropertyListing[] {
  const list = [...listings];

  if (sort === "relevance" && filters.lat != null && filters.lng != null) {
    return list.sort(
      (a, b) =>
        haversineKm(filters.lat!, filters.lng!, a.lat, a.lng) -
        haversineKm(filters.lat!, filters.lng!, b.lat, b.lng),
    );
  }

  switch (sort) {
    case "price_asc":
      return list.sort((a, b) => a.price - b.price);
    case "price_desc":
      return list.sort((a, b) => b.price - a.price);
    case "area_desc":
      return list.sort((a, b) => b.area - a.area);
    case "newest":
      return list.sort(
        (a, b) =>
          new Date(b.publishedAt || 0).getTime() -
          new Date(a.publishedAt || 0).getTime(),
      );
    default:
      return list;
  }
}

export const PROPERTY_PAGE_SIZE = 12;
