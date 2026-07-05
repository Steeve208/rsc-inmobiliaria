export type BackofficePublicListingPhoto = {
  id: string;
  url: string;
  name: string;
};

export type BackofficePublicListingOrganization = {
  id: string;
  name: string;
  slug: string;
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
