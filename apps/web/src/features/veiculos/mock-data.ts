import type {
  PremiumDealership,
  RegionItem,
  VeiculosFilters,
  VehicleListing,
} from "./types";
import { haversineKm } from "@/lib/geocoding/geo-utils";
import { slugifyCompanyId } from "@/lib/leads/utils";

export const worldRegions: RegionItem[] = [
  { id: "br", name: "Brasil", count: 0, lat: -14.235, lng: -51.9253, flag: "🇧🇷" },
  { id: "pt", name: "Portugal", count: 0, lat: 39.3999, lng: -8.2245, flag: "🇵🇹" },
  { id: "ar", name: "Argentina", count: 0, lat: -38.4161, lng: -63.6167, flag: "🇦🇷" },
];

export const brazilStates: RegionItem[] = [
  { id: "SP", name: "São Paulo", count: 0, lat: -23.5505, lng: -46.6333 },
  { id: "RS", name: "Rio Grande do Sul", count: 0, lat: -30.0346, lng: -51.2177 },
  { id: "SC", name: "Santa Catarina", count: 0, lat: -27.5954, lng: -48.548 },
  { id: "RJ", name: "Rio de Janeiro", count: 0, lat: -22.9068, lng: -43.1729 },
  { id: "MG", name: "Minas Gerais", count: 0, lat: -19.9167, lng: -43.9345 },
  { id: "PR", name: "Paraná", count: 0, lat: -25.4284, lng: -49.2733 },
];

export const premiumDealerships: PremiumDealership[] = [
  {
    id: "d1",
    name: "Auto Premium RS",
    logo: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=200&q=80",
    listings: 142,
    city: "Porto Alegre",
    verified: true,
  },
  {
    id: "d2",
    name: "Serra Motors",
    logo: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=200&q=80",
    listings: 98,
    city: "Caxias do Sul",
    verified: true,
  },
  {
    id: "d3",
    name: "Vale Veículos",
    logo: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=200&q=80",
    listings: 76,
    city: "Bento Gonçalves",
    verified: true,
  },
  {
    id: "d4",
    name: "Elite Automóveis",
    logo: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=200&q=80",
    listings: 215,
    city: "São Paulo",
    verified: true,
  },
];

const vehicleImages = {
  car: "https://images.unsplash.com/photo-1494976688679-786211bc1775?w=800&q=80",
  suv: "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800&q=80",
  sports: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80",
  van: "https://images.unsplash.com/photo-1527786356703-4b100169fb23?w=800&q=80",
  truck: "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=800&q=80",
  motorcycle: "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=800&q=80",
  machinery: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&q=80",
  electric: "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=800&q=80",
  hybrid: "https://images.unsplash.com/photo-1619767886554-ef1f35a5c375?w=800&q=80",
};

export const vehicleListings: VehicleListing[] = [
  {
    id: "v1",
    category: "vehicles",
    title: "Toyota Corolla XEi 2.0",
    type: "car",
    make: "Toyota",
    model: "Corolla",
    year: 2024,
    mileage: 12000,
    fuel: "flex",
    transmission: "automatic",
    color: "Prata",
    engine: "2.0",
    drive: "fwd",
    price: 145900,
    currency: "BRL",
    country: "Brasil",
    state: "RS",
    city: "Porto Alegre",
    company: "Auto Premium RS",
    financing: true,
    verified: true,
    premium: true,
    featured: true,
    image: vehicleImages.car,
    lat: -30.0346,
    lng: -51.2177,
    publishedAt: "2026-06-25",
  },
  {
    id: "v2",
    category: "vehicles",
    title: "Jeep Compass Limited",
    type: "suv",
    make: "Jeep",
    model: "Compass",
    year: 2023,
    mileage: 28000,
    fuel: "diesel",
    transmission: "automatic",
    color: "Preto",
    engine: "2.0 Turbo",
    drive: "4x4",
    price: 189900,
    currency: "BRL",
    country: "Brasil",
    state: "RS",
    city: "Caxias do Sul",
    company: "Serra Motors",
    financing: true,
    verified: true,
    premium: true,
    featured: true,
    image: vehicleImages.suv,
    lat: -29.1634,
    lng: -51.1797,
    publishedAt: "2026-06-24",
  },
  {
    id: "v3",
    category: "vehicles",
    title: "Porsche 911 Carrera S",
    type: "sports",
    make: "Porsche",
    model: "911",
    year: 2022,
    mileage: 8500,
    fuel: "gasoline",
    transmission: "automatic",
    color: "Vermelho",
    engine: "3.0 Turbo",
    drive: "rwd",
    price: 890000,
    currency: "BRL",
    country: "Brasil",
    state: "SP",
    city: "São Paulo",
    company: "Elite Automóveis",
    financing: true,
    verified: true,
    premium: true,
    featured: true,
    image: vehicleImages.sports,
    lat: -23.5505,
    lng: -46.6333,
    publishedAt: "2026-06-23",
  },
  {
    id: "v4",
    category: "vehicles",
    title: "Mercedes-Benz Sprinter 415",
    type: "van",
    make: "Mercedes-Benz",
    model: "Sprinter",
    year: 2021,
    mileage: 65000,
    fuel: "diesel",
    transmission: "automatic",
    color: "Branco",
    engine: "2.2",
    drive: "rwd",
    price: 245000,
    currency: "BRL",
    country: "Brasil",
    state: "RS",
    city: "Bento Gonçalves",
    company: "Vale Veículos",
    financing: true,
    verified: true,
    image: vehicleImages.van,
    lat: -29.1714,
    lng: -51.5192,
    publishedAt: "2026-06-22",
  },
  {
    id: "v5",
    category: "vehicles",
    title: "Volkswagen Amarok V6 Highline",
    type: "truck",
    make: "Volkswagen",
    model: "Amarok",
    year: 2023,
    mileage: 35000,
    fuel: "diesel",
    transmission: "automatic",
    color: "Cinza",
    engine: "3.0 V6",
    drive: "4x4",
    price: 268900,
    currency: "BRL",
    country: "Brasil",
    state: "RS",
    city: "Porto Alegre",
    company: "Auto Premium RS",
    financing: true,
    verified: true,
    premium: true,
    image: vehicleImages.truck,
    lat: -30.028,
    lng: -51.21,
    publishedAt: "2026-06-21",
  },
  {
    id: "v6",
    category: "vehicles",
    title: "Honda CB 650R",
    type: "motorcycle",
    make: "Honda",
    model: "CB 650R",
    year: 2024,
    mileage: 3200,
    fuel: "gasoline",
    transmission: "manual",
    color: "Preto",
    engine: "649cc",
    drive: "rwd",
    price: 52900,
    currency: "BRL",
    country: "Brasil",
    state: "SC",
    city: "Florianópolis",
    company: "Serra Motors",
    financing: true,
    verified: true,
    image: vehicleImages.motorcycle,
    lat: -27.5954,
    lng: -48.548,
    publishedAt: "2026-06-20",
  },
  {
    id: "v7",
    category: "vehicles",
    title: "John Deere 6110J Trator",
    type: "machinery",
    make: "John Deere",
    model: "6110J",
    year: 2020,
    mileage: 4200,
    fuel: "diesel",
    transmission: "manual",
    color: "Verde",
    engine: "110 cv",
    drive: "4x4",
    price: 385000,
    currency: "BRL",
    country: "Brasil",
    state: "RS",
    city: "Passo Fundo",
    company: "Vale Veículos",
    financing: true,
    image: vehicleImages.machinery,
    lat: -28.262,
    lng: -52.406,
    publishedAt: "2026-06-19",
  },
  {
    id: "v8",
    category: "vehicles",
    title: "Tesla Model 3 Long Range",
    type: "electric",
    make: "Tesla",
    model: "Model 3",
    year: 2024,
    mileage: 8000,
    fuel: "electric",
    transmission: "automatic",
    color: "Branco",
    engine: "Elétrico",
    drive: "awd",
    price: 289900,
    currency: "BRL",
    country: "Brasil",
    state: "SP",
    city: "São Paulo",
    company: "Elite Automóveis",
    financing: true,
    verified: true,
    premium: true,
    featured: true,
    image: vehicleImages.electric,
    lat: -23.56,
    lng: -46.64,
    publishedAt: "2026-06-18",
  },
  {
    id: "v9",
    category: "vehicles",
    title: "Toyota RAV4 Hybrid",
    type: "hybrid",
    make: "Toyota",
    model: "RAV4",
    year: 2024,
    mileage: 15000,
    fuel: "hybrid",
    transmission: "cvt",
    color: "Azul",
    engine: "2.5 Hybrid",
    drive: "awd",
    price: 219900,
    currency: "BRL",
    country: "Brasil",
    state: "RS",
    city: "Gramado",
    company: "Serra Motors",
    financing: true,
    verified: true,
    premium: true,
    image: vehicleImages.hybrid,
    lat: -29.3784,
    lng: -50.875,
    publishedAt: "2026-06-17",
  },
  {
    id: "v10",
    category: "vehicles",
    title: "Chevrolet Onix Plus LTZ",
    type: "car",
    make: "Chevrolet",
    model: "Onix Plus",
    year: 2023,
    mileage: 22000,
    fuel: "flex",
    transmission: "automatic",
    color: "Branco",
    engine: "1.0 Turbo",
    drive: "fwd",
    price: 89900,
    currency: "BRL",
    country: "Brasil",
    state: "RS",
    city: "Bento Gonçalves",
    company: "Vale Veículos",
    financing: true,
    verified: true,
    image: vehicleImages.car,
    lat: -29.168,
    lng: -51.519,
    publishedAt: "2026-06-16",
  },
  {
    id: "v11",
    category: "vehicles",
    title: "BMW X5 xDrive40i",
    type: "suv",
    make: "BMW",
    model: "X5",
    year: 2023,
    mileage: 18000,
    fuel: "gasoline",
    transmission: "automatic",
    color: "Preto",
    engine: "3.0 Turbo",
    drive: "awd",
    price: 459900,
    currency: "BRL",
    country: "Brasil",
    state: "SP",
    city: "São Paulo",
    company: "Elite Automóveis",
    financing: true,
    verified: true,
    premium: true,
    image: vehicleImages.suv,
    lat: -23.545,
    lng: -46.655,
    publishedAt: "2026-06-15",
  },
  {
    id: "v12",
    category: "vehicles",
    title: "Fiat Toro Ranch",
    type: "truck",
    make: "Fiat",
    model: "Toro",
    year: 2024,
    mileage: 9000,
    fuel: "diesel",
    transmission: "automatic",
    color: "Marrom",
    engine: "2.0 Turbo",
    drive: "4x4",
    price: 179900,
    currency: "BRL",
    country: "Brasil",
    state: "RS",
    city: "Caxias do Sul",
    company: "Serra Motors",
    financing: true,
    verified: true,
    image: vehicleImages.truck,
    lat: -29.17,
    lng: -51.185,
    publishedAt: "2026-06-14",
  },
];

export function filterVehicles(
  listings: VehicleListing[],
  filters: VeiculosFilters,
): VehicleListing[] {
  return listings.filter((v) => {
    if (filters.type && v.type !== filters.type) return false;
    if (filters.make && !v.make.toLowerCase().includes(filters.make.toLowerCase()))
      return false;
    if (filters.model && !v.model.toLowerCase().includes(filters.model.toLowerCase()))
      return false;
    if (filters.yearMin && v.year < Number(filters.yearMin)) return false;
    if (filters.yearMax && v.year > Number(filters.yearMax)) return false;
    if (filters.priceMin && v.price < Number(filters.priceMin)) return false;
    if (filters.priceMax && v.price > Number(filters.priceMax)) return false;
    if (filters.mileageMax && v.mileage > Number(filters.mileageMax)) return false;
    if (filters.fuel && v.fuel !== filters.fuel) return false;
    if (filters.transmission && v.transmission !== filters.transmission) return false;
    if (filters.color && !v.color.toLowerCase().includes(filters.color.toLowerCase()))
      return false;
    if (filters.engine && !v.engine.toLowerCase().includes(filters.engine.toLowerCase()))
      return false;
    if (filters.drive && v.drive !== filters.drive) return false;
    if (filters.financing && !v.financing) return false;
    if (filters.city && !v.city.toLowerCase().includes(filters.city.toLowerCase()))
      return false;
    if (filters.state && v.state !== filters.state) return false;
    if (filters.query) {
      const q = filters.query.toLowerCase();
      const haystack = `${v.title} ${v.make} ${v.model} ${v.city}`.toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    if (filters.lat != null && filters.lng != null) {
      const dist = haversineKm(filters.lat, filters.lng, v.lat, v.lng);
      if (dist > 200) return false;
    }
    return true;
  });
}

export function parseAiQuery(query: string): Partial<VeiculosFilters> {
  const lower = query.toLowerCase();
  const result: Partial<VeiculosFilters> = { query };

  const priceMatch = lower.match(/r?\$?\s*([\d.]+)/);
  if (priceMatch) {
    const num = Number(priceMatch[1].replace(/\./g, ""));
    if (num > 0) result.priceMax = String(num);
  }

  if (lower.includes("suv")) result.type = "suv";
  if (lower.includes("sedan") || lower.includes("carro")) result.type = "car";
  if (lower.includes("moto")) result.type = "motorcycle";
  if (lower.includes("elétric") || lower.includes("eletric")) result.type = "electric";
  if (lower.includes("híbrid") || lower.includes("hibrid")) result.type = "hybrid";
  if (lower.includes("zero km") || lower.includes("novo")) result.condition = "new";
  if (lower.includes("usado")) result.condition = "used";

  return result;
}

export function getFeaturedListings() {
  return vehicleListings.filter((v) => v.featured);
}

export function getPremiumListings() {
  return vehicleListings.filter((v) => v.premium);
}

export function getRecommendedListings() {
  return vehicleListings.filter((v) => v.verified).slice(0, 6);
}

export function getVehicleById(id: string): VehicleListing | undefined {
  return vehicleListings.find((v) => v.id === id);
}

const detailGallery = [
  "https://images.unsplash.com/photo-1494976688679-786211bc1775?w=1200&q=80",
  "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&q=80",
  "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=600&q=80",
  "https://images.unsplash.com/photo-1583121274602-3e2820c088d8?w=600&q=80",
  "https://images.unsplash.com/photo-1542362567-b07e54358753?w=600&q=80",
  "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=600&q=80",
];

export function enrichVehicle(base: VehicleListing) {
  const companyId = slugifyCompanyId(base.company);
  return {
    ...base,
    companyId,
    whatsappNumber: "5554999887766",
    images: detailGallery,
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    has360: true,
    tour360Url: "https://my.matterport.com/show/?m=8Qy963ZYY7F",
    address: `Av. das Indústrias, 450 — ${base.city} - ${base.state}, ${base.country}`,
    condition: base.year >= 2024 ? ("new" as const) : ("used" as const),
    doors: base.type === "motorcycle" ? 0 : 4,
    consumption:
      base.fuel === "electric"
        ? "0 L/100km — 15 kWh/100km"
        : base.fuel === "hybrid"
          ? "18 km/L (cidade) / 16 km/L (estrada)"
          : "12 km/L (cidade) / 14 km/L (estrada)",
    warranty:
      base.year >= 2024
        ? "3 anos de garantia de fábrica"
        : "6 meses de garantia da concessionária",
    history: [
      "Veículo verificado pela RSC — documentação em dia",
      "Sem sinistro registrado",
      "Revisões realizadas conforme manual do fabricante",
      "Único dono",
    ],
    equipment: [
      "Ar-condicionado digital",
      "Central multimídia com Apple CarPlay / Android Auto",
      "Câmera de ré",
      "Sensores de estacionamento",
      "Controle de tração e estabilidade",
      "Airbags frontais e laterais",
      "Freios ABS",
      "Rodas de liga leve",
    ],
    specs: {
      Marca: base.make,
      Modelo: base.model,
      Ano: String(base.year),
      Quilometragem: `${base.mileage.toLocaleString("pt-BR")} km`,
      Combustível: base.fuel,
      Transmissão: base.transmission,
      Cor: base.color,
      Motor: base.engine,
      Tração: base.drive,
    },
    description: `${base.make} ${base.model} ${base.year} em excelente estado de conservação. Veículo verificado pela RSC com histórico completo, documentação regularizada e opções de financiamento disponíveis.`,
    agent: {
      name: "RSC Market",
      role: "Concessionária",
      phone: "",
      photo: "",
    },
    dealershipRating: 0,
    dealershipYears: 0,
    dealershipActive: 0,
    dealershipSold: 0,
    dealershipReviews: 0,
    companyInfo: {
      cnpj: null,
      phone: "5554999887766",
      website: null,
      address: `Av. das Indústrias, 450 — ${base.city}`,
      city: base.city,
      state: base.state,
      postalCode: null,
      branchName: base.company,
      businessHours: [
        { dayOfWeek: 0, openTime: "00:00", closeTime: "00:00", isClosed: true, timezone: "America/Sao_Paulo" },
        { dayOfWeek: 1, openTime: "09:00", closeTime: "18:00", isClosed: false, timezone: "America/Sao_Paulo" },
        { dayOfWeek: 2, openTime: "09:00", closeTime: "18:00", isClosed: false, timezone: "America/Sao_Paulo" },
        { dayOfWeek: 3, openTime: "09:00", closeTime: "18:00", isClosed: false, timezone: "America/Sao_Paulo" },
        { dayOfWeek: 4, openTime: "09:00", closeTime: "18:00", isClosed: false, timezone: "America/Sao_Paulo" },
        { dayOfWeek: 5, openTime: "09:00", closeTime: "18:00", isClosed: false, timezone: "America/Sao_Paulo" },
        { dayOfWeek: 6, openTime: "09:00", closeTime: "13:00", isClosed: false, timezone: "America/Sao_Paulo" },
      ],
    },
  };
}

export function getVehicleDetail(id: string) {
  const base = getVehicleById(id);
  if (!base) return undefined;
  return enrichVehicle(base);
}

export function getSimilarVehicles(id: string, limit = 4) {
  const base = getVehicleById(id);
  if (!base) return vehicleListings.filter((v) => v.id !== id).slice(0, limit);
  return vehicleListings
    .filter((v) => v.id !== id && (v.type === base.type || v.make === base.make))
    .slice(0, limit);
}

export const vehicleMakes = [
  "Toyota",
  "Honda",
  "Volkswagen",
  "Chevrolet",
  "Fiat",
  "Jeep",
  "BMW",
  "Mercedes-Benz",
  "Porsche",
  "Tesla",
];
