import type { MapNavigation, RegionItem } from "@/features/imoveis/types";

/** Geographic anchors only — listing counts come from live catalog queries. */
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
