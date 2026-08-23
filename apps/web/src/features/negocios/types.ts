export type NegociosView = "grid" | "list" | "map";

export type BusinessSort =
  | "newest"
  | "price_asc"
  | "price_desc"
  | "revenue_desc";

export type BusinessCategory =
  | "food"
  | "retail"
  | "services"
  | "beauty"
  | "education"
  | "hospitality";

export type NegociosFilters = {
  query: string;
  type: BusinessCategory | "";
  priceMin: string;
  priceMax: string;
  revenueMin: string;
  revenueMax: string;
  city: string;
  state: string;
  country: string;
  locationLabel: string;
  lat: number | null;
  lng: number | null;
  verifiedOnly: boolean;
  profitable: boolean;
  withEquipment: boolean;
  franchise: boolean;
  sellerFinancing: boolean;
  priceReduced: boolean;
  sort: BusinessSort;
};

export type BusinessListing = {
  id: string;
  category: "businesses";
  title: string;
  type: BusinessCategory;
  price: number;
  originalPrice?: number;
  discountPercent?: number;
  revenue: number;
  cashFlow: number;
  currency: string;
  country: string;
  state: string;
  city: string;
  neighborhood?: string;
  broker: string;
  equipment: boolean;
  franchise: boolean;
  profitable: boolean;
  sellerFinancing: boolean;
  verified?: boolean;
  featured?: boolean;
  image: string;
  lat: number;
  lng: number;
  publishedAt: string;
};

export const defaultNegociosFilters: NegociosFilters = {
  query: "",
  type: "",
  priceMin: "",
  priceMax: "",
  revenueMin: "",
  revenueMax: "",
  city: "",
  state: "",
  country: "",
  locationLabel: "",
  lat: null,
  lng: null,
  verifiedOnly: false,
  profitable: false,
  withEquipment: false,
  franchise: false,
  sellerFinancing: false,
  priceReduced: false,
  sort: "newest",
};
