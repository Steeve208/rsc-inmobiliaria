import type {
  ServiceCategory,
  ServiceCycle,
  ServiceListing,
} from "@/features/services/types";
import { formatMarketplacePrice } from "@/lib/marketplace/format";

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

export const POPULAR_SERVICE_CITIES = [
  { city: "São Paulo", country: "Brasil", state: "SP" },
  { city: "Rio de Janeiro", country: "Brasil", state: "RJ" },
  { city: "Lisbon", country: "Portugal", state: "Lisboa" },
  { city: "Miami", country: "United States", state: "FL" },
  { city: "Dubai", country: "United Arab Emirates", state: "DU" },
] as const;

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
