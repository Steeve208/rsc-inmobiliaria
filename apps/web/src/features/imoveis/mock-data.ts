import type {
  ImoveisFilters,
  MapNavigation,
  PremiumCompany,
  PropertyListing,
  RegionItem,
} from "./types";
import { haversineKm } from "@/lib/geocoding/geo-utils";
import { slugifyCompanyId } from "@/lib/leads/utils";

export const imoveisStats = {
  properties: 0,
  agencies: 0,
  builders: 0,
  countries: 0,
};

export const worldRegions: RegionItem[] = [
  { id: "br", name: "Brasil", count: 0, lat: -14.235, lng: -51.9253, flag: "🇧🇷" },
  { id: "pt", name: "Portugal", count: 0, lat: 39.3999, lng: -8.2245, flag: "🇵🇹" },
  { id: "us", name: "Estados Unidos", count: 0, lat: 37.0902, lng: -95.7129, flag: "🇺🇸" },
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

export const rsCities: RegionItem[] = [
  { id: "caxias", name: "Caxias do Sul", count: 0, lat: -29.1634, lng: -51.1797 },
  { id: "bento", name: "Bento Gonçalves", count: 0, lat: -29.1714, lng: -51.5192 },
  { id: "poa", name: "Porto Alegre", count: 0, lat: -30.0346, lng: -51.2177 },
  { id: "gramado", name: "Gramado", count: 0, lat: -29.3784, lng: -50.875 },
];

export const bentoNeighborhoods: RegionItem[] = [
  { id: "centro", name: "Centro", count: 0, lat: -29.168, lng: -51.519 },
  { id: "sao-roque", name: "São Roque", count: 0, lat: -29.175, lng: -51.512 },
  { id: "planalto", name: "Planalto", count: 0, lat: -29.162, lng: -51.528 },
  { id: "humaita", name: "Humaitá", count: 0, lat: -29.18, lng: -51.505 },
];

export const propertyListings: PropertyListing[] = [
  {
    id: "p1",
    category: "properties",
    title: "Casa em Bento Gonçalves",
    type: "house",
    transaction: "buy",
    price: 850000,
    currency: "BRL",
    country: "Brasil",
    state: "RS",
    city: "Bento Gonçalves",
    neighborhood: "São Bento",
    bedrooms: 3,
    bathrooms: 2,
    garage: 2,
    pool: true,
    area: 180,
    company: "RSC Imóveis",
    financing: true,
    verified: true,
    premium: true,
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80",
    lat: -29.175,
    lng: -51.512,
    publishedAt: "2026-06-25",
  },
  {
    id: "p2",
    category: "properties",
    title: "Apartamento no centro histórico",
    type: "apartment",
    transaction: "buy",
    price: 520000,
    currency: "BRL",
    country: "Brasil",
    state: "RS",
    city: "Bento Gonçalves",
    neighborhood: "Centro",
    bedrooms: 2,
    bathrooms: 1,
    garage: 1,
    pool: false,
    area: 85,
    company: "Vale Imóveis",
    financing: true,
    verified: true,
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80",
    lat: -29.168,
    lng: -51.519,
    publishedAt: "2026-06-22",
  },
  {
    id: "p3",
    category: "properties",
    title: "Casa de campo com lago privativo",
    type: "house",
    transaction: "buy",
    price: 890000,
    currency: "BRL",
    country: "Brasil",
    state: "RS",
    city: "Bento Gonçalves",
    neighborhood: "Planalto",
    bedrooms: 4,
    bathrooms: 3,
    garage: 3,
    pool: true,
    area: 320,
    company: "RSC Imóveis Premium",
    financing: true,
    verified: true,
    premium: true,
    image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80",
    lat: -29.162,
    lng: -51.528,
    publishedAt: "2026-06-20",
  },
  {
    id: "p4",
    category: "properties",
    title: "Terreno residencial plano",
    type: "land",
    transaction: "buy",
    price: 280000,
    currency: "BRL",
    country: "Brasil",
    state: "RS",
    city: "Bento Gonçalves",
    neighborhood: "Humaitá",
    bedrooms: 0,
    bathrooms: 0,
    garage: 0,
    pool: false,
    area: 450,
    company: "Serra Terras",
    financing: false,
    image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80",
    lat: -29.18,
    lng: -51.505,
    publishedAt: "2026-06-18",
  },
  {
    id: "p5",
    category: "properties",
    title: "Cobertura duplex premium",
    type: "apartment",
    transaction: "buy",
    price: 1250000,
    currency: "BRL",
    country: "Brasil",
    state: "RS",
    city: "Caxias do Sul",
    neighborhood: "São Pelegrino",
    bedrooms: 3,
    bathrooms: 3,
    garage: 2,
    pool: true,
    area: 195,
    company: "RSC Imóveis Premium",
    financing: true,
    verified: true,
    premium: true,
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80",
    lat: -29.1634,
    lng: -51.1797,
    publishedAt: "2026-06-15",
  },
  {
    id: "p6",
    category: "properties",
    title: "Casa térrea com jardim",
    type: "house",
    transaction: "buy",
    price: 680000,
    currency: "BRL",
    country: "Brasil",
    state: "RS",
    city: "Porto Alegre",
    neighborhood: "Moinhos de Vento",
    bedrooms: 3,
    bathrooms: 2,
    garage: 2,
    pool: false,
    area: 160,
    company: "POA Living",
    financing: true,
    verified: true,
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
    lat: -30.0346,
    lng: -51.2177,
    publishedAt: "2026-06-12",
  },
  {
    id: "p7",
    category: "properties",
    title: "Casa moderna com piscina",
    type: "house",
    transaction: "buy",
    price: 1850000,
    currency: "BRL",
    country: "Brasil",
    state: "SP",
    city: "São Paulo",
    neighborhood: "Morumbi",
    bedrooms: 4,
    bathrooms: 4,
    garage: 3,
    pool: true,
    area: 420,
    company: "RSC Imóveis Premium",
    financing: true,
    verified: true,
    premium: true,
    image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80",
    lat: -23.6235,
    lng: -46.7023,
    publishedAt: "2026-06-20",
  },
  {
    id: "p8",
    category: "properties",
    title: "Residencial Horizon — Lançamento",
    type: "apartment",
    transaction: "buy",
    price: 720000,
    currency: "BRL",
    country: "Brasil",
    state: "SC",
    city: "Florianópolis",
    neighborhood: "Jurerê",
    bedrooms: 3,
    bathrooms: 2,
    garage: 2,
    pool: true,
    area: 110,
    company: "Horizon Incorporadora",
    financing: true,
    verified: true,
    launch: true,
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80",
    lat: -27.4244,
    lng: -48.4922,
    publishedAt: "2026-06-01",
  },
  {
    id: "p9",
    category: "properties",
    title: "Loft industrial reformado",
    type: "apartment",
    transaction: "buy",
    price: 750000,
    currency: "BRL",
    country: "Brasil",
    state: "RS",
    city: "Bento Gonçalves",
    neighborhood: "Centro",
    bedrooms: 2,
    bathrooms: 2,
    garage: 1,
    pool: false,
    area: 120,
    company: "Vale Imóveis",
    financing: true,
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80",
    lat: -29.169,
    lng: -51.518,
    publishedAt: "2026-06-10",
  },
  {
    id: "p10",
    category: "properties",
    title: "Casa de praia em Jurerê",
    type: "house",
    transaction: "buy",
    price: 3200000,
    currency: "BRL",
    country: "Brasil",
    state: "SC",
    city: "Florianópolis",
    neighborhood: "Jurerê Internacional",
    bedrooms: 5,
    bathrooms: 4,
    garage: 4,
    pool: true,
    area: 380,
    company: "RSC Imóveis Premium",
    financing: true,
    verified: true,
    premium: true,
    image: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=800&q=80",
    lat: -27.42,
    lng: -48.49,
    publishedAt: "2026-06-08",
  },
  {
    id: "p11",
    category: "properties",
    title: "Luxury apartment with ocean view",
    type: "apartment",
    transaction: "buy",
    price: 1280000,
    originalPrice: 1455000,
    discountPercent: 12,
    currency: "USD",
    country: "United States",
    state: "FL",
    city: "Miami",
    neighborhood: "Brickell",
    bedrooms: 3,
    bathrooms: 3,
    garage: 2,
    pool: true,
    area: 145,
    company: "Oceanic Real Estate",
    financing: true,
    verified: true,
    premium: true,
    featured: true,
    virtualTour: true,
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80",
    lat: 25.7617,
    lng: -80.1918,
    publishedAt: "2026-08-18",
  },
  {
    id: "p12",
    category: "properties",
    title: "Modern penthouse in downtown",
    type: "penthouse",
    transaction: "buy",
    price: 2450000,
    currency: "USD",
    country: "United States",
    state: "FL",
    city: "Miami",
    neighborhood: "Downtown",
    bedrooms: 4,
    bathrooms: 4,
    garage: 2,
    pool: true,
    area: 280,
    company: "Skyline Estates",
    financing: true,
    verified: true,
    premium: true,
    virtualTour: true,
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80",
    lat: 25.7743,
    lng: -80.1937,
    publishedAt: "2026-08-16",
  },
  {
    id: "p13",
    category: "properties",
    title: "Family house with garden and pool",
    type: "house",
    transaction: "buy",
    price: 866000,
    originalPrice: 920000,
    discountPercent: 6,
    currency: "USD",
    country: "United States",
    state: "FL",
    city: "Orlando",
    neighborhood: "Winter Park",
    bedrooms: 4,
    bathrooms: 3,
    garage: 2,
    pool: true,
    area: 220,
    company: "Sunshine Homes",
    financing: true,
    verified: true,
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80",
    lat: 28.5383,
    lng: -81.3792,
    publishedAt: "2026-08-12",
  },
  {
    id: "p14",
    category: "properties",
    title: "Studio near the historic center",
    type: "studio",
    transaction: "rent",
    price: 2400,
    currency: "USD",
    country: "United States",
    state: "NY",
    city: "New York",
    neighborhood: "Chelsea",
    bedrooms: 1,
    bathrooms: 1,
    garage: 0,
    pool: false,
    area: 42,
    company: "Metro Living",
    financing: false,
    verified: true,
    launch: true,
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80",
    lat: 40.7465,
    lng: -74.0014,
    publishedAt: "2026-08-20",
  },
  {
    id: "p15",
    category: "properties",
    title: "Condominium with marina view",
    type: "condominium",
    transaction: "buy",
    price: 598000,
    currency: "USD",
    country: "United States",
    state: "FL",
    city: "Miami",
    neighborhood: "Coconut Grove",
    bedrooms: 2,
    bathrooms: 2,
    garage: 1,
    pool: true,
    area: 98,
    company: "Atlantic Realty",
    financing: true,
    verified: true,
    featured: true,
    virtualTour: true,
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
    lat: 25.728,
    lng: -80.237,
    publishedAt: "2026-08-10",
  },
  {
    id: "p16",
    category: "properties",
    title: "Bright apartment in Avenidas Novas",
    type: "apartment",
    transaction: "buy",
    price: 620000,
    currency: "EUR",
    country: "Portugal",
    state: "Lisboa",
    city: "Lisbon",
    neighborhood: "Avenidas Novas",
    bedrooms: 2,
    bathrooms: 2,
    garage: 1,
    pool: false,
    area: 86,
    company: "Lisboa Urban",
    financing: true,
    verified: true,
    image: "https://images.unsplash.com/photo-1460317442991-0ec209397118?w=800&q=80",
    lat: 38.7369,
    lng: -9.1427,
    publishedAt: "2026-08-08",
  },
  {
    id: "p17",
    category: "properties",
    title: "Waterfront apartment in Dubai Marina",
    type: "apartment",
    transaction: "buy",
    price: 1890000,
    currency: "USD",
    country: "United Arab Emirates",
    state: "Dubai",
    city: "Dubai",
    neighborhood: "Dubai Marina",
    bedrooms: 3,
    bathrooms: 3,
    garage: 2,
    pool: true,
    area: 168,
    company: "Gulf Prestige",
    financing: true,
    verified: true,
    premium: true,
    virtualTour: true,
    image: "https://images.unsplash.com/photo-1518684079-3c830dcef090?w=800&q=80",
    lat: 25.0805,
    lng: 55.1403,
    publishedAt: "2026-08-14",
  },
  {
    id: "p18",
    category: "properties",
    title: "Garden apartment in Jardins",
    type: "apartment",
    transaction: "rent",
    price: 12500,
    currency: "BRL",
    country: "Brasil",
    state: "SP",
    city: "São Paulo",
    neighborhood: "Jardins",
    bedrooms: 2,
    bathrooms: 2,
    garage: 1,
    pool: true,
    area: 92,
    company: "Urban Homes",
    financing: false,
    verified: true,
    image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80",
    lat: -23.5717,
    lng: -46.662,
    publishedAt: "2026-08-11",
  },
];

export const premiumCompanies: PremiumCompany[] = [
  { id: "1", name: "RSC Imóveis Premium", logo: "RSC", listings: 1240 },
  { id: "2", name: "Vale Imóveis", logo: "VI", listings: 890 },
  { id: "3", name: "Horizon Incorporadora", logo: "HI", listings: 560 },
  { id: "4", name: "Serra Terras", logo: "ST", listings: 320 },
  { id: "5", name: "POA Living", logo: "PL", listings: 780 },
  { id: "6", name: "Barra Living", logo: "BL", listings: 450 },
];

export function getRegionsForNav(nav: MapNavigation): RegionItem[] {
  switch (nav.level) {
    case "world":
      return worldRegions;
    case "country":
      return brazilStates;
    case "state":
      if (nav.state === "Rio Grande do Sul" || nav.state === "RS") return rsCities;
      return brazilStates.filter((s) => s.name === nav.state || s.id === nav.state);
    case "city":
      if (nav.city === "Bento Gonçalves") return bentoNeighborhoods;
      return [];
    default:
      return [];
  }
}

export function getMapCenter(nav: MapNavigation): { lat: number; lng: number; zoom: number } {
  switch (nav.level) {
    case "world":
      return { lat: 10, lng: -30, zoom: 1.5 };
    case "country":
      return { lat: -14.235, lng: -51.9253, zoom: 3.5 };
    case "state":
      return { lat: -29.5, lng: -51.5, zoom: 7 };
    case "city":
      return { lat: -29.1714, lng: -51.5192, zoom: 12 };
    case "properties":
      return { lat: -29.1714, lng: -51.5192, zoom: 13 };
    default:
      return { lat: -14.235, lng: -51.9253, zoom: 3.5 };
  }
}

export function filterProperties(
  listings: PropertyListing[],
  filters: ImoveisFilters,
  nav: MapNavigation,
): PropertyListing[] {
  return listings.filter((item) => {
    if (filters.query) {
      const q = filters.query.toLowerCase();
      const matches =
        item.title.toLowerCase().includes(q) ||
        item.city.toLowerCase().includes(q) ||
        item.neighborhood.toLowerCase().includes(q) ||
        item.type.toLowerCase().includes(q);
      if (!matches) return false;
    }
    if (nav.country && item.country !== nav.country) return false;
    if (filters.country && item.country !== filters.country) return false;
    if (nav.state) {
      const stateMatch =
        item.state === nav.state ||
        item.state === brazilStates.find((s) => s.name === nav.state)?.id;
      if (!stateMatch) return false;
    }
    if (filters.state) {
      const stateMatch =
        item.state === filters.state ||
        item.state === brazilStates.find((s) => s.name === filters.state)?.id;
      if (!stateMatch) return false;
    }
    const cityFilter = filters.city || nav.city;
    const neighborhoodFilter = filters.neighborhood || nav.neighborhood;

    if (filters.lat != null && filters.lng != null) {
      const radius = filters.radiusKm || 40;
      const distance = haversineKm(filters.lat, filters.lng, item.lat, item.lng);
      if (distance > radius) return false;
    } else {
      if (cityFilter && !item.city.toLowerCase().includes(cityFilter.toLowerCase()))
        return false;
      if (
        neighborhoodFilter &&
        !item.neighborhood.toLowerCase().includes(neighborhoodFilter.toLowerCase())
      )
        return false;
    }
    if (filters.type && item.type !== filters.type) return false;
    if (filters.priceMin && item.price < Number(filters.priceMin)) return false;
    if (filters.priceMax && item.price > Number(filters.priceMax)) return false;
    if (filters.bedrooms && item.bedrooms < Number(filters.bedrooms)) return false;
    if (filters.garage && item.garage < Number(filters.garage)) return false;
    if (filters.pool && !item.pool) return false;
    if (filters.areaMin && item.area < Number(filters.areaMin)) return false;
    if (filters.areaMax && item.area > Number(filters.areaMax)) return false;
    if (filters.financing && !item.financing) return false;
    if (filters.rscCredit && !item.financing) return false;
    return true;
  });
}

const AI_KEYWORDS: Record<string, Partial<ImoveisFilters>> = {
  moderna: { type: "house" },
  casa: { type: "house" },
  apartamento: { type: "apartment" },
  terreno: { type: "land" },
  lago: { query: "lago" },
  piscina: { pool: true },
};

export function parseAiQuery(query: string): Partial<ImoveisFilters> {
  const lower = query.toLowerCase();
  const result: Partial<ImoveisFilters> = { query };

  const priceMatch = lower.match(/r?\$?\s*([\d.]+)/);
  if (priceMatch) {
    const num = Number(priceMatch[1].replace(/\./g, ""));
    if (num > 0) result.priceMax = String(num);
  }

  for (const [keyword, filters] of Object.entries(AI_KEYWORDS)) {
    if (lower.includes(keyword)) Object.assign(result, filters);
  }

  if (lower.includes("menos de") || lower.includes("até")) {
    const match = lower.match(/(?:menos de|até)\s*r?\$?\s*([\d.]+)/);
    if (match) result.priceMax = String(Number(match[1].replace(/\./g, "")));
  }

  return result;
}

export function getLaunchListings() {
  return propertyListings.filter((p) => p.launch);
}

export function getPremiumListings() {
  return propertyListings.filter((p) => p.premium);
}

export function getRecommendedListings() {
  return propertyListings.filter((p) => p.verified).slice(0, 6);
}

export function getPropertyById(id: string): PropertyListing | undefined {
  return propertyListings.find((p) => p.id === id);
}

const detailGallery = [
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80",
  "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=600&q=80",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80",
  "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&q=80",
  "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=600&q=80",
  "https://images.unsplash.com/photo-1600573472592-401b489a3cdc?w=600&q=80",
];

export function enrichProperty(base: PropertyListing) {
  const companyId = slugifyCompanyId(base.company);

  return {
    ...base,
    companyId,
    whatsappNumber: "",
    images: detailGallery,
    featured: base.premium ?? false,
    address: `Rua das Hortênsias, 123 — ${base.neighborhood}, ${base.city} - ${base.state}, ${base.country}`,
    condoFee: 350,
    iptu: 120,
    landArea: Math.round(base.area * 2),
    suites: base.bedrooms,
    livingRooms: 2,
    kitchen: 1,
    laundry: 1,
    heating: "Solar",
    yearBuilt: 2023,
    bathrooms: base.bathrooms ?? 4,
    description:
      "Casa moderna e sofisticada localizada em um dos bairros mais valorizados da cidade. Projeto arquitetônico contemporâneo com acabamentos premium, amplas janelas em vidro, integração total entre áreas internas e externas, piscina aquecida e vista privilegiada. Ideal para famílias que buscam conforto, segurança e qualidade de vida.",
    virtualTourUrl: "https://my.matterport.com/show/?m=8Qy963ZYY7F",
    agent: {
      name: base.company,
      role: "Imobiliária",
      creci: undefined,
      photo: "",
    },
    agencyRating: 0,
    agencyYears: 0,
    agencyActive: 0,
    agencySold: 0,
    agencyReviews: 0,
    companyInfo: {
      cnpj: null,
      phone: "",
      website: null,
      address: `Rua das Hortênsias, 123 — ${base.neighborhood}`,
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

export function getPropertyDetail(id: string) {
  const base = getPropertyById(id);
  if (!base) return undefined;
  return enrichProperty(base);
}

export function getSimilarProperties(id: string, limit = 4) {
  return propertyListings.filter((p) => p.id !== id).slice(0, limit);
}
