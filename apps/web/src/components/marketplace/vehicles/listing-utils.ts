import type { VeiculosFilters, VehicleListing } from "@/features/veiculos/types";
import { matchesVehicleType } from "@/lib/listings/filters";

export const VEHICLE_TYPE_CHIPS = ["car", "motorcycle", "truck", "van"] as const;

export const POPULAR_VEHICLE_CITIES = [
  { city: "São Paulo", country: "Brasil", state: "SP" },
  { city: "Rio de Janeiro", country: "Brasil", state: "RJ" },
  { city: "Curitiba", country: "Brasil", state: "PR" },
  { city: "Belo Horizonte", country: "Brasil", state: "MG" },
  { city: "Campinas", country: "Brasil", state: "SP" },
] as const;

export const POPULAR_SEARCHES = [
  "Jeep Compass",
  "Toyota Corolla",
  "Honda Civic",
  "BMW 320i",
  "Volkswagen T-Cross",
];

export const TRANSMISSIONS = ["automatic", "manual", "cvt"] as const;
export const FUELS = ["flex", "gasoline", "diesel", "hybrid", "electric"] as const;

export const EXPLORE_AREAS = POPULAR_VEHICLE_CITIES;

export function yearOptions() {
  const year = new Date().getFullYear();
  return Array.from({ length: year - 1994 }, (_, index) => String(year - index));
}

export const KM_OPTIONS = [
  "10000",
  "30000",
  "50000",
  "80000",
  "100000",
  "150000",
  "200000",
] as const;

export function countByType(items: VehicleListing[], type: VeiculosFilters["type"]) {
  return items.filter((item) => matchesVehicleType(item.type, type)).length;
}

export function countByCity(items: VehicleListing[], city: string) {
  return items.filter((item) => item.city.toLowerCase() === city.toLowerCase())
    .length;
}

export function uniqueMakes(items: VehicleListing[]) {
  return [...new Set(items.map((item) => item.make).filter(Boolean))].sort();
}

export function uniqueModels(items: VehicleListing[], make: string) {
  return [
    ...new Set(
      items
        .filter((item) => !make || item.make === make)
        .map((item) => item.model)
        .filter(Boolean),
    ),
  ].sort();
}

export function priceExtent(items: VehicleListing[]) {
  if (items.length === 0) return { min: 0, max: 500000 };
  const prices = items.map((item) => item.price);
  return { min: Math.min(...prices), max: Math.max(...prices) };
}

export function priceHistogram(items: VehicleListing[], buckets = 16) {
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

export function averagePrice(items: VehicleListing[]) {
  if (items.length === 0) return 0;
  return Math.round(
    items.reduce((sum, item) => sum + item.price, 0) / items.length,
  );
}

export function insightCity(filters: VeiculosFilters, items: VehicleListing[]) {
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
