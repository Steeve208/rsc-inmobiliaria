export type BackofficePublicListingPhoto = {
  id: string;
  url: string;
  name: string;
};

export type BackofficeBusinessHour = {
  dayOfWeek: number;
  openTime: string;
  closeTime: string;
  isClosed: boolean;
  timezone: string;
};

export type BackofficeCompanyBranch = {
  id: string;
  name: string;
  address: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  postalCode: string | null;
  phone: string | null;
  isPrimary: boolean;
};

export type BackofficePublicListingOrganization = {
  id: string;
  name: string;
  slug: string;
  cnpj?: string | null;
  logoUrl?: string | null;
  website?: string | null;
  description?: string | null;
  phone?: string | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  postalCode?: string | null;
  whatsappNumber?: string | null;
  whatsappUrl?: string | null;
  primaryBranch?: BackofficeCompanyBranch | null;
  businessHours?: BackofficeBusinessHour[];
};

export type BackofficePublicListing = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  category: string;
  price: number | null;
  originalPrice?: number | null;
  discountPercent?: number | null;
  currency: string;
  locationCity: string | null;
  isFeatured: boolean;
  views: number;
  publishedAt: string | null;
  createdAt: string;
  metadata: Record<string, unknown>;
  organization: BackofficePublicListingOrganization;
  photos: BackofficePublicListingPhoto[];
};

export type BackofficeListingsResponse = {
  data: BackofficePublicListing[];
  meta: {
    page: number;
    limit: number;
    total: number;
  };
};

export type BackofficeListingResponse = {
  data: BackofficePublicListing;
};

export type BackofficeListingsQuery = {
  category?: string;
  city?: string;
  featured?: boolean;
  organization?: string;
  page?: number;
  limit?: number;
};

export type BackofficeHomeListingKind =
  | "property"
  | "vehicle"
  | "project"
  | "business"
  | "service";

export type BackofficeHomeBadge = "premium" | "new" | "featured" | "deal";

/** Compact card embedded in the published home payload (or a full listing). */
export type BackofficeHomeListing = {
  id: string;
  kind?: BackofficeHomeListingKind;
  category?: string;
  href?: string;
  title: string;
  location?: string;
  locationCity?: string;
  price?: number | null;
  originalPrice?: number | null;
  discountPercent?: number | null;
  currency?: string;
  image?: string | null;
  type?: string;
  verified?: boolean;
  company?: string;
  badge?: BackofficeHomeBadge;
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
  garage?: number;
  year?: number;
  mileage?: number;
  make?: string;
  model?: string;
  metadata?: Record<string, unknown>;
  photos?: BackofficePublicListingPhoto[];
  organization?: Pick<BackofficePublicListingOrganization, "name"> & {
    city?: string | null;
    state?: string | null;
  };
};

export type BackofficeHomeLink = {
  label: string;
  href: string;
};

export type BackofficeHomeHero = {
  imageUrl?: string;
  title?: string;
  titleHighlight?: string;
  subtitle?: string;
  popularSearches?: BackofficeHomeLink[];
};

export type BackofficeHomeQuickPick = {
  id: string;
  href: string;
  title?: string;
  subtitle?: string;
  imageUrl?: string;
};

export type BackofficeHomePromoPanel = {
  id: string;
  href: string;
  imageUrl?: string | null;
  title?: string;
  subtitle?: string;
  cta?: string;
  graphic?: "tags" | null;
};

export type BackofficeHomeCategoryShortcut = {
  id: string;
  href: string;
  label?: string;
};

export type BackofficeHomeSection = {
  seeAllHref?: string;
  items?: BackofficeHomeListing[];
};

export type BackofficeHomeFeaturedCity = {
  city: string;
  state?: string;
  country?: string;
  seeAllHref?: string;
  items?: BackofficeHomeListing[];
};

export type BackofficeHomeDocument = {
  publishedAt?: string;
  hero?: BackofficeHomeHero;
  quickPicks?: BackofficeHomeQuickPick[];
  promoPanels?: BackofficeHomePromoPanel[];
  categoryShortcuts?: BackofficeHomeCategoryShortcut[] | null;
  deals?: BackofficeHomeSection | BackofficeHomeListing[];
  featuredProperties?: BackofficeHomeSection | BackofficeHomeListing[];
  popularVehicles?: BackofficeHomeSection | BackofficeHomeListing[];
  newListings?: BackofficeHomeSection | BackofficeHomeListing[];
  featuredCity?: BackofficeHomeFeaturedCity | null;
};

export type BackofficeHomeResponse = {
  data: BackofficeHomeDocument;
};
