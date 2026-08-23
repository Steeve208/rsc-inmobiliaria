import type { ProjetosFilters, ProjectListing, ProjectStatus } from "@/features/projetos/types";

export const PROJECT_TYPE_OPTIONS = [
  "residential",
  "commercial",
  "mixed",
  "industrial",
  "hospitality",
] as const;

export const PROJECT_STATUS_OPTIONS = [
  "prelaunch",
  "construction",
  "ready",
] as const;

export const POPULAR_PROJECT_CITIES = [
  { city: "São Paulo", country: "Brasil", state: "SP" },
  { city: "Rio de Janeiro", country: "Brasil", state: "RJ" },
  { city: "Lisbon", country: "Portugal", state: "Lisboa" },
  { city: "Miami", country: "United States", state: "FL" },
  { city: "Orlando", country: "United States", state: "FL" },
  { city: "Dubai", country: "United Arab Emirates", state: "DU" },
] as const;

export const MOBILE_STATUS_CHIPS = [
  "prelaunch",
  "construction",
] as const satisfies readonly ProjectStatus[];

export function deliveryYears() {
  const start = new Date().getFullYear();
  return Array.from({ length: 7 }, (_, index) => String(start + index));
}

export function countByType(items: ProjectListing[], type: ProjetosFilters["type"]) {
  if (!type) return items.length;
  return items.filter((item) => item.type === type).length;
}

export function countByStatus(items: ProjectListing[], status: ProjectStatus) {
  return items.filter((item) => item.status === status).length;
}

export function countByCity(items: ProjectListing[], city: string) {
  return items.filter((item) => item.city.toLowerCase() === city.toLowerCase())
    .length;
}

export function priceExtent(items: ProjectListing[]) {
  if (items.length === 0) return { min: 0, max: 2000000 };
  const prices = items.map((item) => item.price);
  return { min: Math.min(...prices), max: Math.max(...prices) };
}

export function priceHistogram(items: ProjectListing[], buckets = 16) {
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

export function averagePrice(items: ProjectListing[]) {
  if (items.length === 0) return 0;
  return Math.round(
    items.reduce((sum, item) => sum + item.price, 0) / items.length,
  );
}

export function insightCity(filters: ProjetosFilters, items: ProjectListing[]) {
  if (filters.city) return filters.city;
  const top = items.reduce<Record<string, number>>((acc, item) => {
    acc[item.city] = (acc[item.city] ?? 0) + 1;
    return acc;
  }, {});
  return Object.entries(top).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "São Paulo";
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

export function bedsLabel(item: ProjectListing) {
  if (!item.bedsMin && !item.bedsMax) return "";
  if (item.bedsMin && item.bedsMax && item.bedsMin !== item.bedsMax) {
    return `${item.bedsMin}–${item.bedsMax}`;
  }
  return String(item.bedsMax || item.bedsMin);
}
