import type { VehicleListing } from "@/features/veiculos/types";
import {
  MOCK_DEALS,
  MOCK_FEATURED_CITY,
  MOCK_NEW_LISTINGS,
  MOCK_POPULAR_VEHICLES,
} from "@/lib/marketplace/mock-home";
import type { MarketplaceListing } from "@/lib/marketplace/types";
import { vehicleListings } from "@/features/veiculos/mock-data";
import { listingCodeValue } from "@/lib/listings/listing-code";

/** Preview-only home mocks. Drop this file and its import before production. */
export const INCLUDE_HOME_VEHICLE_MOCKS = process.env.NODE_ENV !== "production";

const CITY_GEO: Record<
  string,
  { lat: number; lng: number; country: string; state: string; city: string }
> = {
  "são paulo": {
    lat: -23.5505,
    lng: -46.6333,
    country: "Brasil",
    state: "SP",
    city: "São Paulo",
  },
  "sao paulo": {
    lat: -23.5505,
    lng: -46.6333,
    country: "Brasil",
    state: "SP",
    city: "São Paulo",
  },
  campinas: {
    lat: -22.9056,
    lng: -47.0608,
    country: "Brasil",
    state: "SP",
    city: "Campinas",
  },
  curitiba: {
    lat: -25.4284,
    lng: -49.2733,
    country: "Brasil",
    state: "PR",
    city: "Curitiba",
  },
  "rio de janeiro": {
    lat: -22.9068,
    lng: -43.1729,
    country: "Brasil",
    state: "RJ",
    city: "Rio de Janeiro",
  },
  "belo horizonte": {
    lat: -19.9167,
    lng: -43.9345,
    country: "Brasil",
    state: "MG",
    city: "Belo Horizonte",
  },
  lisbon: {
    lat: 38.7223,
    lng: -9.1393,
    country: "Portugal",
    state: "Lisboa",
    city: "Lisbon",
  },
};

function geoFor(location: string) {
  const key = Object.keys(CITY_GEO).find((name) =>
    location.toLowerCase().includes(name),
  );
  return (
    (key ? CITY_GEO[key] : undefined) ?? {
      lat: -23.5505,
      lng: -46.6333,
      country: "Brasil",
      state: "SP",
      city: location.split(",")[0]?.trim() || "São Paulo",
    }
  );
}

function mapHomeVehicle(item: MarketplaceListing, index: number): VehicleListing {
  const place = geoFor(item.location);
  const type = (
    ["car", "suv", "motorcycle", "truck", "van", "electric", "hybrid"].includes(
      item.type,
    )
      ? item.type
      : "car"
  ) as VehicleListing["type"];

  return {
    id: item.id,
    category: "vehicles",
    title: item.title,
    type,
    make: item.make ?? item.title.split(" ")[0] ?? "Vehicle",
    model: item.model ?? item.title.split(" ").slice(1, 3).join(" "),
    year: item.year ?? 2022,
    mileage: item.mileage ?? 24000,
    fuel: type === "electric" ? "electric" : type === "hybrid" ? "hybrid" : "flex",
    transmission: type === "motorcycle" ? "manual" : "automatic",
    color: "",
    engine: "",
    drive: type === "suv" || type === "truck" ? "4x4" : "fwd",
    price: item.price,
    originalPrice: item.originalPrice,
    discountPercent: item.discountPercent,
    currency: item.currency,
    country: place.country,
    state: place.state,
    city: place.city,
    company: item.company ?? "Reeskova Motors",
    financing: true,
    verified: item.verified ?? true,
    premium: item.badge === "premium" || undefined,
    featured: item.badge === "featured" || item.badge === "deal" || undefined,
    rating: 4.8,
    reviews: 86 + index * 7,
    image: item.image,
    lat: place.lat,
    lng: place.lng,
    publishedAt: new Date(Date.now() - index * 28 * 60 * 60 * 1000)
      .toISOString()
      .slice(0, 10),
    code: listingCodeValue(item.id, item.code, "vehicle"),
  };
}

export function getHomeVehicleMocks(): VehicleListing[] {
  const items = [
    ...MOCK_DEALS,
    ...MOCK_POPULAR_VEHICLES,
    ...MOCK_NEW_LISTINGS,
    ...(MOCK_FEATURED_CITY.items ?? []),
  ].filter((item) => item.kind === "vehicle");

  const unique = new Map<string, MarketplaceListing>();
  for (const item of items) unique.set(item.id, item);
  return [...unique.values()].map((item, index) => mapHomeVehicle(item, index));
}

export function mergeVehicleCatalog(live: VehicleListing[]) {
  const extras = [
    ...(INCLUDE_HOME_VEHICLE_MOCKS ? getHomeVehicleMocks() : []),
    ...vehicleListings,
  ];
  const preview = INCLUDE_HOME_VEHICLE_MOCKS || live.length < 12 ? extras : [];
  const merged: VehicleListing[] = [];
  const seen = new Set<string>();

  for (const item of [...preview, ...live]) {
    if (seen.has(item.id)) continue;
    seen.add(item.id);
    merged.push(item);
  }
  return merged;
}
