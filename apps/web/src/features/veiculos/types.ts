export type VeiculosView = "list" | "gallery" | "map" | "satellite";

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
  mileageMax: string;
  fuel: FuelType | "";
  transmission: TransmissionType | "";
  color: string;
  engine: string;
  drive: DriveType | "";
  financing: boolean;
  city: string;
  state: string;
  condition: VehicleCondition;
  locationLabel: string;
  lat: number | null;
  lng: number | null;
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
  currency: string;
  country: string;
  state: string;
  city: string;
  company: string;
  financing: boolean;
  verified?: boolean;
  premium?: boolean;
  featured?: boolean;
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
  mileageMax: "",
  fuel: "",
  transmission: "",
  color: "",
  engine: "",
  drive: "",
  financing: false,
  city: "",
  state: "",
  condition: "",
  locationLabel: "",
  lat: null,
  lng: null,
};
