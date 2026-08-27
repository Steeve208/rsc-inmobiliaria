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
  items: MarketplaceListing[];
};

export type MarketplaceHomeData = {
  deals: MarketplaceListing[];
  featuredProperties: MarketplaceListing[];
  newListings: MarketplaceListing[];
  popularVehicles: MarketplaceListing[];
  featuredCity: FeaturedCityBlock | null;
};
