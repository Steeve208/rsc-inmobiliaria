export type VeiculosView = "grid" | "list" | "map";

export type VehicleSort = "newest" | "price_asc" | "price_desc" | "mileage_asc";

export type VehicleCategory =
  | "car"
  | "suv"
  | "sports"
  | "van"
  | "truck"
  | "motorcycle"
  | "machinery"
  | "electric"
  | "hybrid";

export type FuelType = "gasoline" | "diesel" | "electric" | "hybrid" | "flex";
export type TransmissionType = "manual" | "automatic" | "cvt";
export type DriveType = "fwd" | "rwd" | "awd" | "4x4";
export type VehicleCondition = "new" | "used" | "";

export type VeiculosFilters = {
  query: string;
  type: VehicleCategory | "";
  make: string;
  model: string;
  yearMin: string;
  yearMax: string;
  priceMin: string;
  priceMax: string;
  mileageMin: string;
  mileageMax: string;
  fuel: FuelType | "";
  transmission: TransmissionType | "";
  color: string;
  engine: string;
  drive: DriveType | "";
  financing: boolean;
  city: string;
  state: string;
  country: string;
  condition: VehicleCondition;
  verifiedOnly: boolean;
  withPhotos: boolean;
  lowMileage: boolean;
  priceReduced: boolean;
  newThisWeek: boolean;
  locationLabel: string;
  lat: number | null;
  lng: number | null;
  sort: VehicleSort;
};

export type VehicleListing = {
  id: string;
  category: "vehicles";
  title: string;
  type: VehicleCategory;
  make: string;
  model: string;
  year: number;
  mileage: number;
  fuel: FuelType;
  transmission: TransmissionType;
  color: string;
  engine: string;
  drive: DriveType;
  price: number;
  originalPrice?: number;
  discountPercent?: number;
  currency: string;
  country: string;
  state: string;
  city: string;
  company: string;
  financing: boolean;
  verified?: boolean;
  premium?: boolean;
  featured?: boolean;
  rating?: number;
  reviews?: number;
  image: string;
  lat: number;
  lng: number;
  publishedAt: string;
};

export type DealershipAgent = {
  name: string;
  role: string;
  phone: string;
  photo: string;
};

export type VehicleDetail = VehicleListing & {
  companyId: string;
  companyLogoUrl?: string;
  whatsappNumber: string;
  images: string[];
  videoUrl?: string;
  has360: boolean;
  tour360Url?: string;
  address: string;
  description: string;
  condition: VehicleCondition;
  doors: number;
  consumption: string;
  warranty: string;
  history: string[];
  equipment: string[];
  specs: Record<string, string>;
  agent: DealershipAgent;
  companyInfo: import("@/features/imoveis/types").CompanyPublicInfo;
  dealershipRating: number;
  dealershipYears: number;
  dealershipActive: number;
  dealershipSold: number;
  dealershipReviews: number;
};

export type PremiumDealership = {
  id: string;
  name: string;
  logo: string;
  listings: number;
  city: string;
  verified: boolean;
};

export type RegionItem = {
  id: string;
  name: string;
  count: number;
  lat: number;
  lng: number;
  flag?: string;
};

export const defaultVeiculosFilters: VeiculosFilters = {
  query: "",
  type: "",
  make: "",
  model: "",
  yearMin: "",
  yearMax: "",
  priceMin: "",
  priceMax: "",
  mileageMin: "",
  mileageMax: "",
  fuel: "",
  transmission: "",
  color: "",
  engine: "",
  drive: "",
  financing: false,
  city: "",
  state: "",
  country: "",
  condition: "",
  verifiedOnly: false,
  withPhotos: false,
  lowMileage: false,
  priceReduced: false,
  newThisWeek: false,
  locationLabel: "",
  lat: null,
  lng: null,
  sort: "newest",
};
