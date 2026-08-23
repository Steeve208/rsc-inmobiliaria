export type ProjetosView = "grid" | "list" | "map";

export type ProjectSort = "newest" | "price_asc" | "price_desc" | "delivery_asc";

export type ProjectType =
  | "residential"
  | "commercial"
  | "mixed"
  | "industrial"
  | "hospitality";

export type ProjectStatus = "prelaunch" | "construction" | "ready";

export type ProjectUnitType =
  | "apartments"
  | "houses"
  | "studios"
  | "offices"
  | "villas";

export type ProjetosFilters = {
  query: string;
  type: ProjectType | "";
  status: ProjectStatus | "";
  deliveryFrom: string;
  deliveryTo: string;
  priceMin: string;
  priceMax: string;
  city: string;
  state: string;
  country: string;
  locationLabel: string;
  lat: number | null;
  lng: number | null;
  verifiedOnly: boolean;
  paymentPlan: boolean;
  highRoi: boolean;
  luxury: boolean;
  sustainable: boolean;
  withAmenities: boolean;
  sort: ProjectSort;
};

export type ProjectListing = {
  id: string;
  category: "projects";
  title: string;
  type: ProjectType;
  status: ProjectStatus;
  unitType: ProjectUnitType;
  bedsMin?: number;
  bedsMax?: number;
  price: number;
  currency: string;
  country: string;
  state: string;
  city: string;
  neighborhood?: string;
  developer: string;
  delivery: string;
  deliveryYear: number;
  paymentPlan: boolean;
  highRoi: boolean;
  sustainable: boolean;
  luxury: boolean;
  amenities?: boolean;
  verified?: boolean;
  featured?: boolean;
  premium?: boolean;
  image: string;
  lat: number;
  lng: number;
  publishedAt: string;
  propertyId?: string;
};

export const defaultProjetosFilters: ProjetosFilters = {
  query: "",
  type: "",
  status: "",
  deliveryFrom: "",
  deliveryTo: "",
  priceMin: "",
  priceMax: "",
  city: "",
  state: "",
  country: "",
  locationLabel: "",
  lat: null,
  lng: null,
  verifiedOnly: false,
  paymentPlan: false,
  highRoi: false,
  luxury: false,
  sustainable: false,
  withAmenities: false,
  sort: "newest",
};
