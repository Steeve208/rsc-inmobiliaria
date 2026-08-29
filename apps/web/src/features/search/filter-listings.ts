import type { ListingItem, SearchFilters } from "./types";
import {
  isListingCodeQuery,
  listingCodeKindFrom,
  matchesListingCode,
} from "@/lib/listings/listing-code";

export function filterListings(
  listings: ListingItem[],
  filters: SearchFilters,
): ListingItem[] {
  if (isListingCodeQuery(filters.query)) {
    return listings.filter((item) =>
      matchesListingCode(item, filters.query, listingCodeKindFrom(item.category)),
    );
  }

  return listings.filter((item) => {
    if (filters.category && item.category !== filters.category) return false;
    if (filters.query) {
      const q = filters.query.toLowerCase();
      if (
        !matchesListingCode(
          item,
          filters.query,
          listingCodeKindFrom(item.category),
        ) &&
        !item.title.toLowerCase().includes(q) &&
        !item.city.toLowerCase().includes(q) &&
        !item.neighborhood.toLowerCase().includes(q)
      ) {
        return false;
      }
    }
    if (filters.country && item.country !== filters.country) return false;
    if (filters.state && item.state !== filters.state) return false;
    if (filters.city && !item.city.toLowerCase().includes(filters.city.toLowerCase()))
      return false;
    if (
      filters.neighborhood &&
      !item.neighborhood.toLowerCase().includes(filters.neighborhood.toLowerCase())
    )
      return false;
    if (filters.type && item.type !== filters.type) return false;
    if (filters.priceMin && item.price < Number(filters.priceMin)) return false;
    if (filters.priceMax && item.price > Number(filters.priceMax)) return false;
    if (filters.bedrooms && item.bedrooms < Number(filters.bedrooms)) return false;
    if (filters.garage && item.garage < Number(filters.garage)) return false;
    if (filters.pool && !item.pool) return false;
    if (filters.areaMin && item.area < Number(filters.areaMin)) return false;
    if (filters.areaMax && item.area > Number(filters.areaMax)) return false;
    if (filters.company && !item.company.toLowerCase().includes(filters.company.toLowerCase()))
      return false;
    if (filters.financing && !item.financing) return false;
    if (filters.date && item.publishedAt < filters.date) return false;
    return true;
  });
}
