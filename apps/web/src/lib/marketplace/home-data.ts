import type { PropertyListing } from "@/features/imoveis/types";
import type { VehicleListing } from "@/features/veiculos/types";
import {
  formatMileage,
  listingLocation,
} from "@/lib/marketplace/format";
import { getMockMarketplaceHomeData } from "@/lib/marketplace/mock-home";
import type {
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
  };
}

export async function getMarketplaceHomeData(
  _locale = "en",
): Promise<MarketplaceHomeData> {
  return getMockMarketplaceHomeData();
}
