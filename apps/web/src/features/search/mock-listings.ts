import type { ListingItem } from "./types";

export const mockListings: ListingItem[] = [
  {
    id: "1",
    category: "properties",
    title: "Casa moderna com piscina",
    type: "house",
    price: 1850000,
    currency: "BRL",
    country: "Brasil",
    state: "SP",
    city: "São Paulo",
    neighborhood: "Morumbi",
    bedrooms: 4,
    garage: 3,
    pool: true,
    area: 420,
    company: "RSC Imóveis Premium",
    financing: true,
    image:
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80",
    lat: -23.6235,
    lng: -46.7023,
    publishedAt: "2026-06-20",
  },
  {
    id: "2",
    category: "properties",
    title: "Apartamento alto padrão",
    type: "apartment",
    price: 980000,
    currency: "BRL",
    country: "Brasil",
    state: "RJ",
    city: "Rio de Janeiro",
    neighborhood: "Barra da Tijuca",
    bedrooms: 3,
    garage: 2,
    pool: true,
    area: 145,
    company: "Barra Living",
    financing: true,
    image:
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80",
    lat: -23.0067,
    lng: -43.3656,
    publishedAt: "2026-06-18",
  },
  {
    id: "3",
    category: "properties",
    title: "Terreno comercial",
    type: "land",
    price: 650000,
    currency: "BRL",
    country: "Brasil",
    state: "MG",
    city: "Belo Horizonte",
    neighborhood: "Savassi",
    bedrooms: 0,
    garage: 0,
    pool: false,
    area: 800,
    company: "MG Terras",
    financing: false,
    image:
      "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80",
    lat: -19.9386,
    lng: -43.9378,
    publishedAt: "2026-06-15",
  },
  {
    id: "4",
    category: "vehicles",
    title: "SUV elétrico premium",
    type: "car",
    price: 320000,
    currency: "BRL",
    country: "Brasil",
    state: "SP",
    city: "São Paulo",
    neighborhood: "Pinheiros",
    bedrooms: 0,
    garage: 0,
    pool: false,
    area: 0,
    company: "Auto RSC",
    financing: true,
    image:
      "https://images.unsplash.com/photo-1617788138017-80ad40651399?w=800&q=80",
    lat: -23.5629,
    lng: -46.689,
    publishedAt: "2026-06-22",
  },
  {
    id: "5",
    category: "vehicles",
    title: "Motocicleta esportiva",
    type: "motorcycle",
    price: 45000,
    currency: "BRL",
    country: "Brasil",
    state: "PR",
    city: "Curitiba",
    neighborhood: "Batel",
    bedrooms: 0,
    garage: 0,
    pool: false,
    area: 0,
    company: "Moto Center",
    financing: true,
    image:
      "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=800&q=80",
    lat: -25.4419,
    lng: -49.2749,
    publishedAt: "2026-06-10",
  },
  {
    id: "6",
    category: "launches",
    title: "Residencial Horizon",
    type: "apartment",
    price: 720000,
    currency: "BRL",
    country: "Brasil",
    state: "SC",
    city: "Florianópolis",
    neighborhood: "Jurerê",
    bedrooms: 3,
    garage: 2,
    pool: true,
    area: 110,
    company: "Horizon Incorporadora",
    financing: true,
    image:
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80",
    lat: -27.4244,
    lng: -48.4922,
    publishedAt: "2026-06-01",
  },
  {
    id: "7",
    category: "properties",
    title: "Cobertura duplex",
    type: "apartment",
    price: 2100000,
    currency: "BRL",
    country: "Brasil",
    state: "SP",
    city: "São Paulo",
    neighborhood: "Itaim Bibi",
    bedrooms: 4,
    garage: 4,
    pool: false,
    area: 280,
    company: "RSC Imóveis Premium",
    financing: true,
    image:
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80",
    lat: -23.5847,
    lng: -46.6746,
    publishedAt: "2026-06-12",
  },
  {
    id: "8",
    category: "vehicles",
    title: "Caminhão seminovo",
    type: "truck",
    price: 185000,
    currency: "BRL",
    country: "Brasil",
    state: "RS",
    city: "Porto Alegre",
    neighborhood: "Cristal",
    bedrooms: 0,
    garage: 0,
    pool: false,
    area: 0,
    company: "Truck Brasil",
    financing: false,
    image:
      "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=800&q=80",
    lat: -30.1072,
    lng: -51.2287,
    publishedAt: "2026-05-28",
  },
];

export function filterListings(
  listings: ListingItem[],
  filters: import("./types").SearchFilters,
): ListingItem[] {
  return listings.filter((item) => {
    if (filters.category && item.category !== filters.category) return false;
    if (filters.query) {
      const q = filters.query.toLowerCase();
      if (
        !item.title.toLowerCase().includes(q) &&
        !item.city.toLowerCase().includes(q) &&
        !item.neighborhood.toLowerCase().includes(q)
      ) {
        return false;
      }
    }
    if (filters.country && item.country !== filters.country) return false;
    if (filters.state && item.state !== filters.state) return false;
    if (filters.city && !item.city.toLowerCase().includes(filters.city.toLowerCase()))
      return false;
    if (
      filters.neighborhood &&
      !item.neighborhood.toLowerCase().includes(filters.neighborhood.toLowerCase())
    )
      return false;
    if (filters.type && item.type !== filters.type) return false;
    if (filters.priceMin && item.price < Number(filters.priceMin)) return false;
    if (filters.priceMax && item.price > Number(filters.priceMax)) return false;
    if (filters.bedrooms && item.bedrooms < Number(filters.bedrooms)) return false;
    if (filters.garage && item.garage < Number(filters.garage)) return false;
    if (filters.pool && !item.pool) return false;
    if (filters.areaMin && item.area < Number(filters.areaMin)) return false;
    if (filters.areaMax && item.area > Number(filters.areaMax)) return false;
    if (filters.company && !item.company.toLowerCase().includes(filters.company.toLowerCase()))
      return false;
    if (filters.financing && !item.financing) return false;
    if (filters.date && item.publishedAt < filters.date) return false;
    return true;
  });
}
