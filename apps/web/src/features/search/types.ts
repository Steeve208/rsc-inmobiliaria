export type SearchCategory = "properties" | "vehicles" | "launches";

export type SearchView = "list" | "map" | "gallery";

export type SearchFilters = {
  category: SearchCategory;
  query: string;
  country: string;
  state: string;
  city: string;
  neighborhood: string;
  priceMin: string;
  priceMax: string;
  type: string;
  bedrooms: string;
  garage: string;
  pool: boolean;
  areaMin: string;
  areaMax: string;
  date: string;
  company: string;
  financing: boolean;
};

export type ListingItem = {
  id: string;
  category: SearchCategory;
  title: string;
  type: string;
  price: number;
  currency: string;
  country: string;
  state: string;
  city: string;
  neighborhood: string;
  bedrooms: number;
  garage: number;
  pool: boolean;
  area: number;
  company: string;
  financing: boolean;
  image: string;
  lat: number;
  lng: number;
  publishedAt: string;
};

export const defaultFilters: SearchFilters = {
  category: "properties",
  query: "",
  country: "",
  state: "",
  city: "",
  neighborhood: "",
  priceMin: "",
  priceMax: "",
  type: "",
  bedrooms: "",
  garage: "",
  pool: false,
  areaMin: "",
  areaMax: "",
  date: "",
  company: "",
  financing: false,
};
