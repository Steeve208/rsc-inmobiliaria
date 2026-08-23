import type { BusinessListing, NegociosFilters } from "@/features/negocios/types";

export const BUSINESS_CATEGORIES = [
  "food",
  "retail",
  "services",
  "beauty",
  "education",
  "hospitality",
] as const;

export const POPULAR_BUSINESS_CITIES = [
  { city: "São Paulo", country: "Brasil", state: "SP" },
  { city: "Rio de Janeiro", country: "Brasil", state: "RJ" },
  { city: "Curitiba", country: "Brasil", state: "PR" },
  { city: "Lisbon", country: "Portugal", state: "Lisboa" },
  { city: "Miami", country: "United States", state: "FL" },
] as const;

export function countByType(items: BusinessListing[], type: NegociosFilters["type"]) {
  if (!type) return items.length;
  return items.filter((item) => item.type === type).length;
}

export function countByCity(items: BusinessListing[], city: string) {
  return items.filter((item) => item.city.toLowerCase() === city.toLowerCase()).length;
}

export function priceExtent(items: BusinessListing[]) {
  if (items.length === 0) return { min: 0, max: 2000000 };
  const prices = items.map((item) => item.price);
  return { min: Math.min(...prices), max: Math.max(...prices) };
}

export function priceHistogram(items: BusinessListing[], buckets = 16) {
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

export function averagePrice(items: BusinessListing[]) {
  if (items.length === 0) return 0;
  return Math.round(items.reduce((sum, item) => sum + item.price, 0) / items.length);
}

export function averageRevenue(items: BusinessListing[]) {
  if (items.length === 0) return 0;
  return Math.round(items.reduce((sum, item) => sum + item.revenue, 0) / items.length);
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
