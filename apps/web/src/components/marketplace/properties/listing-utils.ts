import type { ImoveisFilters, PropertyListing } from "@/features/imoveis/types";

export const PROPERTY_TYPE_OPTIONS = [
  "apartment",
  "house",
  "condominium",
  "penthouse",
  "studio",
  "commercial",
  "land",
] as const;

export const ROOM_OPTIONS = ["1", "2", "3", "4", "5"] as const;

export const POPULAR_PROPERTY_CITIES = [
  { city: "Miami", country: "United States", state: "FL" },
  { city: "São Paulo", country: "Brasil", state: "SP" },
  { city: "Lisbon", country: "Portugal", state: "Lisboa" },
  { city: "Dubai", country: "United Arab Emirates", state: "Dubai" },
  { city: "Orlando", country: "United States", state: "FL" },
] as const;

export const EXPLORE_AREAS = [
  ...POPULAR_PROPERTY_CITIES,
  { city: "New York", country: "United States", state: "NY" },
] as const;

export function countByTransaction(
  items: PropertyListing[],
  transaction: ImoveisFilters["transaction"],
) {
  if (!transaction) return items.length;
  return items.filter((item) => item.transaction === transaction).length;
}

export function countByType(items: PropertyListing[], type: string) {
  return items.filter((item) => item.type === type).length;
}

export function countByCity(items: PropertyListing[], city: string) {
  return items.filter((item) => item.city.toLowerCase() === city.toLowerCase())
    .length;
}

export function priceExtent(items: PropertyListing[]) {
  if (items.length === 0) return { min: 0, max: 1_000_000 };
  const prices = items.map((item) => item.price);
  return { min: Math.min(...prices), max: Math.max(...prices) };
}

export function priceHistogram(items: PropertyListing[], buckets = 16) {
  const { min, max } = priceExtent(items);
  const span = Math.max(max - min, 1);
  const counts = Array.from({ length: buckets }, () => 0);
  for (const item of items) {
    const index = Math.min(
      buckets - 1,
      Math.floor(((item.price - min) / span) * buckets),
    );
    counts[index] += 1;
  }
  const peak = Math.max(1, ...counts);
  return counts.map((count) => count / peak);
}

export function averagePrice(items: PropertyListing[]) {
  if (items.length === 0) return 0;
  return Math.round(
    items.reduce((sum, item) => sum + item.price, 0) / items.length,
  );
}

export function insightCity(filters: ImoveisFilters, items: PropertyListing[]) {
  if (filters.city) return filters.city;
  const top = items.reduce<Record<string, number>>((acc, item) => {
    acc[item.city] = (acc[item.city] ?? 0) + 1;
    return acc;
  }, {});
  return (
    Object.entries(top).sort((a, b) => b[1] - a[1])[0]?.[0] ??
    POPULAR_PROPERTY_CITIES[0].city
  );
}

export function initials(name?: string) {
  if (!name) return "RK";
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function listingTypeLabel(
  item: PropertyListing,
  translate: (key: string) => string,
) {
  const known = new Set(PROPERTY_TYPE_OPTIONS);
  return known.has(item.type as (typeof PROPERTY_TYPE_OPTIONS)[number])
    ? translate(`types.${item.type}`)
    : item.type;
}
