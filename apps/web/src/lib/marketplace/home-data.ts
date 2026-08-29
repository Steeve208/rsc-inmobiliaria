import type { PropertyListing } from "@/features/imoveis/types";
import type { ProjectListing } from "@/features/projetos/types";
import type { VehicleListing } from "@/features/veiculos/types";
import { fetchBackofficeHome } from "@/lib/backoffice/client";
import { listingCodeValue } from "@/lib/listings/listing-code";
import { listProperties } from "@/lib/listings/property-repository";
import { listProjects } from "@/lib/listings/project-repository";
import { listVehicles } from "@/lib/listings/vehicle-repository";
import { getCatalogHomeEditorial } from "@/lib/marketplace/catalog";
import {
  formatMileage,
  listingLocation,
} from "@/lib/marketplace/format";
import { mapBackofficeHomeDocument } from "@/lib/marketplace/map-home";
import type {
  FeaturedCityBlock,
  MarketplaceBadge,
  MarketplaceHomeData,
  MarketplaceListing,
} from "@/lib/marketplace/types";

function propertyBadge(item: PropertyListing): MarketplaceBadge | undefined {
  if (item.launch) return "new";
  if (item.premium) return "premium";
  return "featured";
}

function vehicleBadge(item: VehicleListing): MarketplaceBadge | undefined {
  if (item.premium) return "premium";
  if (item.featured) return "featured";
  return undefined;
}

export function mapPropertyListing(item: PropertyListing): MarketplaceListing {
  return {
    id: item.id,
    kind: item.launch ? "project" : "property",
    href: `/imoveis/${item.id}`,
    title: item.title,
    location: listingLocation([item.neighborhood, item.city, item.state, item.country]),
    price: item.price,
    originalPrice: item.originalPrice,
    discountPercent: item.discountPercent,
    currency: item.currency,
    image: item.image,
    type: item.type,
    verified: item.verified,
    company: item.company,
    badge: propertyBadge(item),
    bedrooms: item.bedrooms,
    bathrooms: item.bathrooms,
    area: item.area,
    garage: item.garage,
    code: listingCodeValue(item.id, item.code, "property"),
    country: item.country,
  };
}

export function mapVehicleListing(
  item: VehicleListing,
  locale = "pt-BR",
): MarketplaceListing {
  return {
    id: item.id,
    kind: "vehicle",
    href: `/veiculos/${item.id}`,
    title: item.title,
    location: [
      item.year ? String(item.year) : "",
      item.mileage ? formatMileage(item.mileage, locale) : "",
      item.city,
    ]
      .filter(Boolean)
      .join(" · "),
    price: item.price,
    originalPrice: item.originalPrice,
    discountPercent: item.discountPercent,
    currency: item.currency,
    image: item.image,
    type: item.type,
    verified: item.verified,
    company: item.company,
    badge: vehicleBadge(item),
    year: item.year,
    mileage: item.mileage,
    make: item.make,
    model: item.model,
    code: listingCodeValue(item.id, item.code, "vehicle"),
    country: item.country,
  };
}

export function mapProjectListing(item: ProjectListing): MarketplaceListing {
  return {
    id: item.id,
    kind: "project",
    href: `/projetos/${item.id}`,
    title: item.title,
    location: listingLocation([
      item.neighborhood,
      item.city,
      item.state,
      item.country,
    ]),
    price: item.price,
    currency: item.currency,
    image: item.image,
    type: item.type,
    verified: item.verified,
    company: item.developer,
    badge: item.premium ? "premium" : item.featured ? "featured" : "new",
    bedrooms: item.bedsMin,
    code: listingCodeValue(item.id, item.code, "project"),
    country: item.country,
  };
}

function hasCover(item: { image?: string; title?: string }) {
  return Boolean(item.image?.trim() && item.title?.trim());
}

function takeListings(items: MarketplaceListing[], limit: number) {
  const seen = new Set<string>();
  const out: MarketplaceListing[] = [];
  for (const item of items) {
    const key = `${item.kind}:${item.id}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(item);
    if (out.length >= limit) break;
  }
  return out;
}

function isDeal<T extends { originalPrice?: number; price: number }>(item: T) {
  return Boolean(item.originalPrice && item.originalPrice > item.price);
}

function featuredCityFromProperties(
  properties: PropertyListing[],
): FeaturedCityBlock | null {
  const byCity = new Map<string, PropertyListing[]>();
  for (const item of properties) {
    const city = item.city?.trim();
    if (!city) continue;
    const list = byCity.get(city) ?? [];
    list.push(item);
    byCity.set(city, list);
  }

  let best: PropertyListing[] = [];
  for (const items of byCity.values()) {
    if (items.length > best.length) best = items;
  }
  if (best.length === 0) return null;

  const first = best[0];
  const cityQuery = encodeURIComponent(first.city);
  return {
    city: first.city,
    state: first.state,
    country: first.country,
    seeAllHref: `/imoveis?city=${cityQuery}&locationLabel=${cityQuery}`,
    items: takeListings(best.map(mapPropertyListing), 4),
  };
}

async function getLiveMarketplaceHomeData(
  locale = "en",
): Promise<MarketplaceHomeData> {
  const [properties, vehicles, projects] = await Promise.all([
    listProperties(),
    listVehicles(),
    listProjects(),
  ]);

  const liveProperties = properties.filter(hasCover);
  const liveVehicles = vehicles.filter(hasCover);
  const liveProjects = projects.filter(hasCover);

  const propertyCards = liveProperties.map(mapPropertyListing);
  const vehicleCards = liveVehicles.map((item) =>
    mapVehicleListing(item, locale),
  );

  const dealCards = takeListings(
    [
      ...liveProperties.filter(isDeal).map(mapPropertyListing),
      ...liveVehicles.filter(isDeal).map((item) =>
        mapVehicleListing(item, locale),
      ),
      ...propertyCards.filter(
        (item) => item.badge === "premium" || item.badge === "featured",
      ),
      ...vehicleCards.filter(
        (item) => item.badge === "premium" || item.badge === "featured",
      ),
    ],
    6,
  );

  const featuredProperties = takeListings(
    [
      ...liveProperties
        .filter((item) => item.premium || item.featured || item.verified)
        .map(mapPropertyListing),
      ...propertyCards,
    ],
    8,
  );

  const popularVehicles = takeListings(
    [
      ...liveVehicles
        .filter((item) => item.premium || item.featured || item.verified)
        .map((item) => mapVehicleListing(item, locale)),
      ...vehicleCards,
    ],
    8,
  );

  const newest = [
    ...liveProperties.map((item) => ({
      publishedAt: item.publishedAt,
      card: mapPropertyListing(item),
    })),
    ...liveVehicles.map((item) => ({
      publishedAt: item.publishedAt,
      card: mapVehicleListing(item, locale),
    })),
    ...liveProjects.map((item) => ({
      publishedAt: item.publishedAt,
      card: mapProjectListing(item),
    })),
  ].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));

  return {
    ...getCatalogHomeEditorial(),
    deals: dealCards,
    featuredProperties,
    popularVehicles,
    newListings: takeListings(
      newest.map((item) => item.card),
      12,
    ),
    featuredCity: featuredCityFromProperties(liveProperties),
  };
}

export async function getMarketplaceHomeData(
  locale = "en",
): Promise<MarketplaceHomeData> {
  const published = await fetchBackofficeHome(locale);
  if (published) return mapBackofficeHomeDocument(published);
  return getLiveMarketplaceHomeData(locale);
}
