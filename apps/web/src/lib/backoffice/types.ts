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
