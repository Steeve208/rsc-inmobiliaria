import type { ListingItem, SearchFilters } from "@/features/search/types";

export type ImoveisView = "list" | "gallery" | "map" | "satellite";

export type PropertySort =
  | "relevance"
  | "price_asc"
  | "price_desc"
  | "area_desc"
  | "newest";

export type MapNavLevel = "world" | "country" | "state" | "city" | "properties";

export type MapNavigation = {
  level: MapNavLevel;
  country?: string;
  countryCode?: string;
  state?: string;
  city?: string;
  neighborhood?: string;
};

export type RegionItem = {
  id: string;
  name: string;
  count: number;
  lat: number;
  lng: number;
  flag?: string;
};

export type ImoveisFilters = SearchFilters & {
  transaction: "buy" | "rent" | "";
  condition: "new" | "used" | "";
  pets: boolean;
  rscCredit: boolean;
  launchOnly: boolean;
  locationLabel: string;
  lat: number | null;
  lng: number | null;
  radiusKm: number;
  sort: PropertySort;
};

export type PremiumCompany = {
  id: string;
  name: string;
  logo: string;
  listings: number;
};

export type PropertyListing = ListingItem & {
  transaction?: string;
  condition?: string;
  verified?: boolean;
  bathrooms?: number;
  premium?: boolean;
  launch?: boolean;
  videoUrl?: string;
};

export type PropertyAgent = {
  name: string;
  role: string;
  creci: string;
  photo: string;
};

export type CompanyBusinessHour = {
  dayOfWeek: number;
  openTime: string;
  closeTime: string;
  isClosed: boolean;
  timezone: string;
};

export type CompanyPublicInfo = {
  cnpj: string | null;
  phone: string | null;
  website: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  postalCode: string | null;
  branchName: string | null;
  businessHours: CompanyBusinessHour[];
};

export type PropertyDetail = PropertyListing & {
  companyId: string;
  companyLogoUrl?: string;
  whatsappNumber: string;
  images: string[];
  featured?: boolean;
  virtualTourUrl?: string;
  floorPlanUrl?: string;
  address: string;
  condoFee: number;
  iptu: number;
  landArea: number;
  suites: number;
  livingRooms: number;
  kitchen: number;
  laundry: number;
  heating: string;
  yearBuilt: number;
  description: string;
  agent: PropertyAgent | null;
  companyInfo: CompanyPublicInfo;
  agencyRating: number;
  agencyYears: number;
  agencyActive: number;
  agencySold: number;
  agencyReviews: number;
};

export const defaultImoveisFilters: ImoveisFilters = {
  category: "properties",
  query: "",
  country: "Brasil",
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
  transaction: "",
  condition: "",
  pets: false,
  rscCredit: false,
  launchOnly: false,
  locationLabel: "",
  lat: null,
  lng: null,
  radiusKm: 40,
  sort: "relevance",
};
