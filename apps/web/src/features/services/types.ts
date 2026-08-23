export type ServicesView = "grid" | "list" | "map";

export type ServiceSort = "recommended" | "newest" | "price_asc";

export type ServiceCycle =
  | "buy"
  | "finance"
  | "inspect"
  | "renovate"
  | "manage"
  | "sell";

export type ServiceCategory =
  | "agents"
  | "management"
  | "inspection"
  | "appraisal"
  | "architecture"
  | "interior"
  | "renovation"
  | "construction"
  | "landscaping"
  | "cleaning"
  | "moving"
  | "security"
  | "maintenance"
  | "photography"
  | "legal"
  | "financing"
  | "insurance"
  | "staging";

export type ServicePricing = "from" | "month" | "quote";

export type ServicesFilters = {
  query: string;
  type: ServiceCategory | "";
  priceMin: string;
  priceMax: string;
  city: string;
  state: string;
  country: string;
  locationLabel: string;
  lat: number | null;
  lng: number | null;
  verifiedOnly: boolean;
  availableToday: boolean;
  availableWeek: boolean;
  online: boolean;
  cycle: ServiceCycle | "";
  sort: ServiceSort;
};

export type ServiceListing = {
  id: string;
  category: "services";
  title: string;
  type: ServiceCategory;
  pricing: ServicePricing;
  price?: number;
  currency: string;
  country: string;
  state: string;
  city: string;
  description: string;
  provider: string;
  rating: number;
  reviews: number;
  verified?: boolean;
  topRated?: boolean;
  availableToday?: boolean;
  availableWeek?: boolean;
  online?: boolean;
  image: string;
  lat: number;
  lng: number;
  publishedAt: string;
};

export const defaultServicesFilters: ServicesFilters = {
  query: "",
  type: "",
  priceMin: "",
  priceMax: "",
  city: "",
  state: "",
  country: "",
  locationLabel: "",
  lat: null,
  lng: null,
  verifiedOnly: false,
  availableToday: false,
  availableWeek: false,
  online: false,
  cycle: "",
  sort: "recommended",
};
