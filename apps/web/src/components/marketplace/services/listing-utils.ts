import type {
  ServiceCategory,
  ServiceCycle,
  ServiceListing,
  ServicesFilters,
} from "@/features/services/types";
import { brazilStates } from "@/lib/listings/regions";
import { formatMarketplacePrice } from "@/lib/marketplace/format";
import { marketList } from "@/lib/markets/config";

export const SERVICE_CATEGORIES: ServiceCategory[] = [
  "agents",
  "management",
  "inspection",
  "appraisal",
  "architecture",
  "interior",
  "renovation",
  "construction",
  "landscaping",
  "cleaning",
  "moving",
  "security",
  "maintenance",
  "photography",
  "legal",
  "financing",
  "insurance",
  "staging",
];

export const POPULAR_SERVICE_TYPES: ServiceCategory[] = [
  "management",
  "inspection",
  "architecture",
  "renovation",
  "interior",
  "moving",
  "insurance",
  "financing",
];

export const SERVICE_CYCLES: ServiceCycle[] = [
  "buy",
  "finance",
  "inspect",
  "renovate",
  "manage",
  "sell",
];

export const CYCLE_TYPES: Record<ServiceCycle, ServiceCategory[]> = {
  buy: ["agents", "appraisal", "photography", "staging", "legal"],
  finance: ["financing", "insurance"],
  inspect: ["inspection"],
  renovate: ["architecture", "interior", "renovation", "construction", "landscaping"],
  manage: ["management", "cleaning", "security", "maintenance"],
  sell: ["agents", "photography", "staging", "moving"],
};

export type LocationOption = { value: string; label: string };

function uniqueSorted(values: string[]) {
  return [...new Set(values.map((value) => value.trim()).filter(Boolean))].sort((a, b) =>
    a.localeCompare(b, undefined, { sensitivity: "base" }),
  );
}

function matchesCountry(item: ServiceListing, country: string) {
  return item.country.toLowerCase() === country.toLowerCase();
}

function matchesState(item: ServiceListing, state: string) {
  if (!state) return true;
  const region = brazilStates.find(
    (entry) => entry.id === state || entry.name.toLowerCase() === state.toLowerCase(),
  );
  const aliases = [state, region?.id, region?.name].filter(Boolean) as string[];
  return aliases.some((alias) => item.state.toLowerCase() === alias.toLowerCase());
}

export function serviceLocationCountries(catalog: ServiceListing[]): LocationOption[] {
  const fromCatalog = uniqueSorted(catalog.map((item) => item.country));
  const fromMarkets = marketList
    .map((market) => market.countryName)
    .sort((a, b) => a.localeCompare(b, undefined, { sensitivity: "base" }));
  const seen = new Set<string>();
  const options: LocationOption[] = [];

  for (const name of [...fromCatalog, ...fromMarkets]) {
    const key = name.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    const market = marketList.find((entry) => entry.countryName === name);
    options.push({
      value: name,
      label: market?.flag ? `${market.flag} ${name}` : name,
    });
  }

  return options;
}

export function serviceLocationRegions(
  catalog: ServiceListing[],
  country: string,
): LocationOption[] {
  if (!country) return [];
  const fromCatalog = uniqueSorted(
    catalog.filter((item) => matchesCountry(item, country)).map((item) => item.state),
  );

  if (country === "Brasil") {
    const seen = new Set<string>();
    const options: LocationOption[] = [];
    for (const region of brazilStates) {
      seen.add(region.id.toLowerCase());
      seen.add(region.name.toLowerCase());
      options.push({ value: region.id, label: region.name });
    }
    for (const state of fromCatalog) {
      if (seen.has(state.toLowerCase())) continue;
      seen.add(state.toLowerCase());
      options.push({ value: state, label: state });
    }
    return options;
  }

  return fromCatalog.map((state) => {
    const region = brazilStates.find(
      (entry) => entry.id === state || entry.name.toLowerCase() === state.toLowerCase(),
    );
    return { value: state, label: region?.name ?? state };
  });
}

export function serviceLocationCities(
  catalog: ServiceListing[],
  country: string,
  state: string,
): LocationOption[] {
  if (!country || !state) return [];
  return uniqueSorted(
    catalog
      .filter((item) => matchesCountry(item, country) && matchesState(item, state))
      .map((item) => item.city),
  ).map((city) => ({ value: city, label: city }));
}

export function serviceLocationPatch(next: {
  country?: string;
  state?: string;
  city?: string;
}): Partial<ServicesFilters> {
  const country = next.country ?? "";
  const state = country ? (next.state ?? "") : "";
  const city = country && state ? (next.city ?? "") : "";
  return {
    country,
    state,
    city,
    locationLabel: [city, state, country].filter(Boolean).join(", "),
    lat: null,
    lng: null,
  };
}

export function countByType(items: ServiceListing[], type: ServiceCategory | "") {
  if (!type) return items.length;
  return items.filter((item) => item.type === type).length;
}

export function countByCity(items: ServiceListing[], city: string) {
  return items.filter((item) => item.city.toLowerCase() === city.toLowerCase()).length;
}

export function pricedServices(items: ServiceListing[]) {
  return items.filter((item) => item.price != null && item.pricing !== "quote");
}

export function priceExtent(items: ServiceListing[]) {
  const prices = pricedServices(items).map((item) => item.price as number);
  if (prices.length === 0) return { min: 0, max: 5000 };
  return { min: Math.min(...prices), max: Math.max(...prices) };
}

export function priceHistogram(items: ServiceListing[], buckets = 16) {
  const priced = pricedServices(items);
  const { min, max } = priceExtent(priced);
  const span = Math.max(max - min, 1);
  const counts = Array.from({ length: buckets }, () => 0);
  for (const item of priced) {
    const index = Math.min(buckets - 1, Math.floor((((item.price ?? min) - min) / span) * buckets));
    counts[index] += 1;
  }
  const peak = Math.max(1, ...counts);
  return counts.map((count) => count / peak);
}

export function averageRating(items: ServiceListing[]) {
  if (items.length === 0) return 0;
  return items.reduce((sum, item) => sum + item.rating, 0) / items.length;
}

export function formatServicePrice(
  item: Pick<ServiceListing, "pricing" | "price" | "currency">,
  labels: { from: string; month: string; quote: string },
) {
  if (item.pricing === "quote" || item.price == null) return labels.quote;
  const amount = formatMarketplacePrice(item.price, item.currency);
  if (item.pricing === "month") return `${labels.from} ${amount} ${labels.month}`;
  return `${labels.from} ${amount}`;
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
