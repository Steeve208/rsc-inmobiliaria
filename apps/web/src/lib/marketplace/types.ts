export type MarketplaceListingKind =
  | "property"
  | "vehicle"
  | "project"
  | "business"
  | "service";

export type MarketplaceBadge = "premium" | "new" | "featured" | "deal";

export type MarketplaceListing = {
  id: string;
  kind: MarketplaceListingKind;
  href: string;
  title: string;
  location: string;
  price: number;
  originalPrice?: number;
  discountPercent?: number;
  currency: string;
  image: string;
  type: string;
  verified?: boolean;
  company?: string;
  badge?: MarketplaceBadge;
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
  garage?: number;
  year?: number;
  mileage?: number;
  make?: string;
  model?: string;
  code?: string;
  country?: string;
};

export type FeaturedCityBlock = {
  city: string;
  state: string;
  country: string;
  seeAllHref?: string;
  items: MarketplaceListing[];
};

export type MarketplaceHeroContent = {
  imageUrl: string;
  title?: string;
  titleHighlight?: string;
  subtitle?: string;
  popularSearches: Array<{ label: string; href: string }>;
};

export type MarketplaceQuickPick = {
  id: string;
  href: string;
  title?: string;
  subtitle?: string;
};

export type MarketplacePromoPanel = {
  id: string;
  href: string;
  imageUrl?: string | null;
  title?: string;
  subtitle?: string;
  cta?: string;
  graphic?: "tags" | null;
};

export type MarketplaceCategoryShortcut = {
  id: string;
  href: string;
  label?: string;
};

export type MarketplaceHomeData = {
  hero: MarketplaceHeroContent;
  quickPicks: MarketplaceQuickPick[];
  promoPanels: MarketplacePromoPanel[];
  categoryShortcuts: MarketplaceCategoryShortcut[];
  deals: MarketplaceListing[];
  dealsSeeAllHref?: string;
  featuredProperties: MarketplaceListing[];
  featuredPropertiesSeeAllHref?: string;
  newListings: MarketplaceListing[];
  newListingsSeeAllHref?: string;
  popularVehicles: MarketplaceListing[];
  popularVehiclesSeeAllHref?: string;
  featuredCity: FeaturedCityBlock | null;
};
