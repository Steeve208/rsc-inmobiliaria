import { listingDealFields } from "@/lib/backoffice/mappers";
import type {
  BackofficeHomeCategoryShortcut,
  BackofficeHomeDocument,
  BackofficeHomeFeaturedCity,
  BackofficeHomeListing,
  BackofficeHomePromoPanel,
  BackofficeHomeQuickPick,
  BackofficeHomeSection,
} from "@/lib/backoffice/types";
import { getCatalogHomeEditorial } from "@/lib/marketplace/catalog";
import { listingImageUrl } from "@/lib/listings/listing-image";
import {
  appendCountryToLocation,
  listingLocation,
} from "@/lib/marketplace/format";
import type {
  FeaturedCityBlock,
  MarketplaceBadge,
  MarketplaceCategoryShortcut,
  MarketplaceHomeData,
  MarketplaceListing,
  MarketplaceListingKind,
  MarketplacePromoPanel,
  MarketplaceQuickPick,
} from "@/lib/marketplace/types";

const KIND_BY_CATEGORY: Record<string, MarketplaceListingKind> = {
  real_estate: "property",
  property: "property",
  properties: "property",
  vehicle: "vehicle",
  vehicles: "vehicle",
  project: "project",
  projects: "project",
  business: "business",
  businesses: "business",
  service: "service",
  services: "service",
};

function listingKind(item: BackofficeHomeListing): MarketplaceListingKind {
  if (item.kind) return item.kind;
  const category = (item.category ?? "").trim().toLowerCase();
  return KIND_BY_CATEGORY[category] ?? "property";
}

function listingHref(kind: MarketplaceListingKind, id: string): string {
  switch (kind) {
    case "vehicle":
      return `/veiculos/${id}`;
    case "project":
      return `/projetos/${id}`;
    case "business":
      return `/negocios/${id}`;
    case "service":
      return `/services/${id}`;
    default:
      return `/imoveis/${id}`;
  }
}

function coverImage(item: BackofficeHomeListing): string {
  return listingImageUrl(item.image ?? item.photos?.[0]?.url);
}

function sectionItems(
  value: BackofficeHomeSection | BackofficeHomeListing[] | undefined,
): BackofficeHomeListing[] {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  return Array.isArray(value.items) ? value.items : [];
}

function sectionSeeAllHref(
  value: BackofficeHomeSection | BackofficeHomeListing[] | undefined,
): string | undefined {
  if (!value || Array.isArray(value)) return undefined;
  const href = value.seeAllHref?.trim();
  return href || undefined;
}

function str(value: unknown): string {
  return typeof value === "string" && value.trim() ? value.trim() : "";
}

function homeListingCountry(item: BackofficeHomeListing): string {
  const meta = item.metadata ?? {};
  return (
    str(item.country) ||
    str(meta.country) ||
    str(meta.countryName) ||
    str(meta.country_name) ||
    str(meta.countryCode) ||
    str(meta.country_code) ||
    str(item.organization?.country)
  );
}

function mapBadge(
  item: BackofficeHomeListing,
  deal: { originalPrice?: number; discountPercent?: number },
): MarketplaceBadge | undefined {
  if (item.badge) return item.badge;
  if (deal.discountPercent || deal.originalPrice) return "deal";
  return undefined;
}

export function mapBackofficeHomeListing(
  item: BackofficeHomeListing,
): MarketplaceListing | null {
  const id = item.id?.trim();
  if (!id) return null;

  const kind = listingKind(item);
  const meta = item.metadata ?? {};
  const deal = listingDealFields({
    price: item.price,
    originalPrice: item.originalPrice,
    discountPercent: item.discountPercent,
    metadata: meta,
  });
  const href = item.href?.trim() || listingHref(kind, id);
  const country = homeListingCountry(item);
  const baseLocation =
    item.location?.trim() ||
    listingLocation([
      item.locationCity,
      item.organization?.city,
      item.organization?.state,
    ]);
  const location = appendCountryToLocation(baseLocation, country);

  return {
    id,
    kind,
    href,
    title: item.title?.trim() || id,
    location,
    country: country || undefined,
    price: item.price ?? 0,
    originalPrice: deal.originalPrice,
    discountPercent: deal.discountPercent,
    currency: item.currency || "USD",
    image: coverImage(item),
    type: item.type?.trim() || kind,
    verified: item.verified,
    company: item.company?.trim() || item.organization?.name,
    badge: mapBadge(item, deal),
    bedrooms: item.bedrooms,
    bathrooms: item.bathrooms,
    area: item.area,
    garage: item.garage,
    year: item.year,
    mileage: item.mileage,
    make: item.make,
    model: item.model,
  };
}

function mapListings(
  value: BackofficeHomeSection | BackofficeHomeListing[] | undefined,
): MarketplaceListing[] {
  return sectionItems(value)
    .map(mapBackofficeHomeListing)
    .filter((item): item is MarketplaceListing => item !== null);
}

function mapQuickPicks(
  items: BackofficeHomeQuickPick[] | undefined,
  fallback: MarketplaceQuickPick[],
): MarketplaceQuickPick[] {
  if (!items?.length) return fallback;
  return items
    .filter((item) => item.id?.trim() && item.href?.trim())
    .map((item) => ({
      id: item.id.trim(),
      href: item.href.trim(),
      title: item.title?.trim() || undefined,
      subtitle: item.subtitle?.trim() || undefined,
    }));
}

function mapPromoPanels(
  items: BackofficeHomePromoPanel[] | undefined,
  fallback: MarketplacePromoPanel[],
): MarketplacePromoPanel[] {
  if (!items?.length) return fallback;
  return items
    .filter((item) => item.id?.trim() && item.href?.trim())
    .map((item) => ({
      id: item.id.trim(),
      href: item.href.trim(),
      imageUrl: item.imageUrl ?? null,
      title: item.title?.trim() || undefined,
      subtitle: item.subtitle?.trim() || undefined,
      cta: item.cta?.trim() || undefined,
      graphic: item.graphic ?? null,
    }));
}

function mapCategoryShortcuts(
  items: BackofficeHomeCategoryShortcut[] | null | undefined,
  fallback: MarketplaceCategoryShortcut[],
): MarketplaceCategoryShortcut[] {
  if (!items?.length) return fallback;
  return items
    .filter((item) => item.id?.trim() && item.href?.trim())
    .map((item) => ({
      id: item.id.trim(),
      href: item.href.trim(),
      label: item.label?.trim() || undefined,
    }));
}

function mapFeaturedCity(
  block: BackofficeHomeFeaturedCity | null | undefined,
): FeaturedCityBlock | null {
  if (!block?.city?.trim()) return null;
  const items = mapListings(block.items);
  if (items.length === 0) return null;
  return {
    city: block.city.trim(),
    state: block.state?.trim() ?? "",
    country: block.country?.trim() ?? "",
    seeAllHref: block.seeAllHref?.trim() || undefined,
    items,
  };
}

export function mapBackofficeHomeDocument(
  document: BackofficeHomeDocument,
): MarketplaceHomeData {
  const catalog = getCatalogHomeEditorial();
  const popularSearches = document.hero?.popularSearches?.filter(
    (item) => item.label?.trim() && item.href?.trim(),
  );

  return {
    hero: {
      imageUrl: document.hero?.imageUrl?.trim() || catalog.hero.imageUrl,
      title: document.hero?.title?.trim() || undefined,
      titleHighlight: document.hero?.titleHighlight?.trim() || undefined,
      subtitle: document.hero?.subtitle?.trim() || undefined,
      popularSearches: popularSearches?.length
        ? popularSearches.map((item) => ({
            label: item.label.trim(),
            href: item.href.trim(),
          }))
        : catalog.hero.popularSearches,
    },
    quickPicks: mapQuickPicks(document.quickPicks, catalog.quickPicks),
    promoPanels: mapPromoPanels(document.promoPanels, catalog.promoPanels),
    categoryShortcuts: mapCategoryShortcuts(
      document.categoryShortcuts,
      catalog.categoryShortcuts,
    ),
    deals: mapListings(document.deals),
    dealsSeeAllHref: sectionSeeAllHref(document.deals),
    featuredProperties: mapListings(document.featuredProperties),
    featuredPropertiesSeeAllHref: sectionSeeAllHref(document.featuredProperties),
    popularVehicles: mapListings(document.popularVehicles),
    popularVehiclesSeeAllHref: sectionSeeAllHref(document.popularVehicles),
    newListings: mapListings(document.newListings),
    newListingsSeeAllHref: sectionSeeAllHref(document.newListings),
    featuredCity: mapFeaturedCity(document.featuredCity),
  };
}
