import type { PropertyListing } from "@/features/imoveis/types";
import {
  MOCK_DEALS,
  MOCK_FEATURED_CITY,
  MOCK_FEATURED_PROPERTIES,
  MOCK_NEW_LISTINGS,
} from "@/lib/marketplace/mock-home";
import type { MarketplaceListing } from "@/lib/marketplace/types";

/** Preview-only home mocks. Drop this file and its import before production. */
export const INCLUDE_HOME_PROPERTY_MOCKS = process.env.NODE_ENV !== "production";

const CITY_GEO: Record<
  string,
  { lat: number; lng: number; country: string; state: string }
> = {
  miami: { lat: 25.7617, lng: -80.1918, country: "United States", state: "FL" },
  "são paulo": { lat: -23.5505, lng: -46.6333, country: "Brasil", state: "SP" },
  "sao paulo": { lat: -23.5505, lng: -46.6333, country: "Brasil", state: "SP" },
  lisbon: { lat: 38.7223, lng: -9.1393, country: "Portugal", state: "Lisboa" },
  dubai: { lat: 25.2048, lng: 55.2708, country: "United Arab Emirates", state: "Dubai" },
  "rio de janeiro": {
    lat: -22.9068,
    lng: -43.1729,
    country: "Brasil",
    state: "RJ",
  },
  campinas: { lat: -22.9056, lng: -47.0608, country: "Brasil", state: "SP" },
  guarulhos: { lat: -23.4538, lng: -46.5333, country: "Brasil", state: "SP" },
};

function parseLocation(location: string) {
  const parts = location.split(",").map((part) => part.trim()).filter(Boolean);
  const neighborhood = parts[0] ?? "";
  const cityHint = parts[1] ?? parts[0] ?? "";
  const geoKey = Object.keys(CITY_GEO).find(
    (key) =>
      location.toLowerCase().includes(key) || cityHint.toLowerCase().includes(key),
  );
  const geo = geoKey ? CITY_GEO[geoKey] : undefined;
  const city =
    geoKey === "miami"
      ? "Miami"
      : geoKey === "são paulo" || geoKey === "sao paulo"
        ? "São Paulo"
        : geoKey === "lisbon"
          ? "Lisbon"
          : geoKey === "dubai"
            ? "Dubai"
            : geoKey === "rio de janeiro"
              ? "Rio de Janeiro"
              : geoKey === "campinas"
                ? "Campinas"
                : geoKey === "guarulhos"
                  ? "Guarulhos"
                  : cityHint || neighborhood;

  return {
    neighborhood: neighborhood === city ? "" : neighborhood,
    city,
    state: geo?.state ?? "",
    country: geo?.country ?? "",
    lat: geo?.lat ?? 0,
    lng: geo?.lng ?? 0,
  };
}

function mapHomeListing(item: MarketplaceListing, index: number): PropertyListing {
  const place = parseLocation(item.location);
  const isRent = /\/\s*month|aluguel|rent/i.test(item.title);

  return {
    id: item.id,
    category: "properties",
    title: item.title,
    type: item.type === "penthouse" ? "penthouse" : item.type,
    transaction: isRent ? "rent" : "buy",
    price: item.price,
    originalPrice: item.originalPrice,
    discountPercent: item.discountPercent,
    currency: item.currency,
    country: place.country,
    state: place.state,
    city: place.city,
    neighborhood: place.neighborhood,
    bedrooms: item.bedrooms ?? 0,
    bathrooms: item.bathrooms ?? 0,
    garage: item.garage ?? 0,
    pool: false,
    area: item.area ?? 0,
    company: item.company ?? "Reeskova",
    financing: true,
    verified: item.verified,
    premium: item.badge === "premium" || undefined,
    featured: item.badge === "featured" || item.badge === "deal" || undefined,
    launch: item.badge === "new" || item.kind === "project" || undefined,
    virtualTour: item.badge === "premium" || item.kind === "project",
    image: item.image,
    lat: place.lat,
    lng: place.lng,
    publishedAt: new Date(Date.now() - index * 36 * 60 * 60 * 1000)
      .toISOString()
      .slice(0, 10),
  };
}

export function getHomePropertyMocks(): PropertyListing[] {
  const items = [
    ...MOCK_DEALS,
    ...MOCK_FEATURED_PROPERTIES,
    ...MOCK_NEW_LISTINGS,
    ...(MOCK_FEATURED_CITY.items ?? []),
  ].filter(
    (item) => item.kind === "property" || item.kind === "project",
  );

  const unique = new Map<string, MarketplaceListing>();
  for (const item of items) unique.set(item.id, item);

  return [...unique.values()].map((item, index) => mapHomeListing(item, index));
}

export function mergePropertyCatalog(
  live: PropertyListing[],
  extras: PropertyListing[],
) {
  const homeMocks = INCLUDE_HOME_PROPERTY_MOCKS ? getHomePropertyMocks() : [];
  const preview = INCLUDE_HOME_PROPERTY_MOCKS ? extras : live.length >= 12 ? [] : extras;
  const merged: PropertyListing[] = [];
  const seen = new Set<string>();

  for (const item of [...homeMocks, ...live, ...preview]) {
    if (seen.has(item.id)) continue;
    seen.add(item.id);
    merged.push(item);
  }

  return merged;
}
