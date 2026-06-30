import type { MarketConfig, MarketId } from "./types";

const baseNavLinks = {
  properties: { href: "/imoveis", label: "properties" },
  vehicles: { href: "/veiculos", label: "vehicles" },
  credit: { href: "/financing", label: "credit" },
  business: {
    href: "/para-empresas",
    label: "paraEmpresas",
    highlight: true,
    icon: "business" as const,
  },
  help: { href: "/help", label: "help" },
} as const;

export const markets: Record<MarketId, MarketConfig> = {
  br: {
    id: "br",
    flag: "🇧🇷",
    nameKey: "markets.names.br",
    defaultLocale: "pt",
    currency: { code: "BRL", symbol: "R$" },
    countryName: "Brasil",
    countryCode: "br",
    creditAvailable: true,
    navLinks: [
      baseNavLinks.properties,
      baseNavLinks.vehicles,
      baseNavLinks.credit,
      baseNavLinks.business,
      baseNavLinks.help,
    ],
    geocodeLang: "pt",
    geocodeBbox: [-74.0, -33.0, -32.0, 5.5],
  },
  pt: {
    id: "pt",
    flag: "🇵🇹",
    nameKey: "markets.names.pt",
    defaultLocale: "pt",
    currency: { code: "EUR", symbol: "€" },
    countryName: "Portugal",
    countryCode: "pt",
    creditAvailable: false,
    navLinks: [
      baseNavLinks.properties,
      baseNavLinks.vehicles,
      baseNavLinks.business,
      baseNavLinks.help,
    ],
    geocodeLang: "pt",
    geocodeBbox: [-9.6, 36.8, -6.0, 42.2],
  },
  us: {
    id: "us",
    flag: "🇺🇸",
    nameKey: "markets.names.us",
    defaultLocale: "en",
    currency: { code: "USD", symbol: "$" },
    countryName: "United States",
    countryCode: "us",
    creditAvailable: false,
    navLinks: [
      baseNavLinks.properties,
      baseNavLinks.vehicles,
      baseNavLinks.business,
      baseNavLinks.help,
    ],
    geocodeLang: "en",
    geocodeBbox: [-125.0, 24.0, -66.0, 50.0],
  },
  es: {
    id: "es",
    flag: "🇪🇸",
    nameKey: "markets.names.es",
    defaultLocale: "es",
    currency: { code: "EUR", symbol: "€" },
    countryName: "España",
    countryCode: "es",
    creditAvailable: false,
    navLinks: [
      baseNavLinks.properties,
      baseNavLinks.vehicles,
      baseNavLinks.business,
      baseNavLinks.help,
    ],
    geocodeLang: "es",
    geocodeBbox: [-9.6, 36.0, 4.5, 43.9],
  },
  fr: {
    id: "fr",
    flag: "🇫🇷",
    nameKey: "markets.names.fr",
    defaultLocale: "en",
    currency: { code: "EUR", symbol: "€" },
    countryName: "France",
    countryCode: "fr",
    creditAvailable: false,
    navLinks: [
      baseNavLinks.properties,
      baseNavLinks.vehicles,
      baseNavLinks.business,
      baseNavLinks.help,
    ],
    geocodeLang: "fr",
    geocodeBbox: [-5.2, 41.0, 9.7, 51.2],
  },
  ar: {
    id: "ar",
    flag: "🇦🇷",
    nameKey: "markets.names.ar",
    defaultLocale: "es",
    currency: { code: "ARS", symbol: "$" },
    countryName: "Argentina",
    countryCode: "ar",
    creditAvailable: false,
    navLinks: [
      baseNavLinks.properties,
      baseNavLinks.vehicles,
      baseNavLinks.business,
      baseNavLinks.help,
    ],
    geocodeLang: "es",
    geocodeBbox: [-73.6, -55.2, -53.5, -21.8],
  },
};

export const marketList = Object.values(markets);

export const defaultMarketId: MarketId = "us";

export function isMarketId(value: string | undefined | null): value is MarketId {
  return value != null && value in markets;
}

export function getMarket(id: MarketId): MarketConfig {
  return markets[id];
}

export function getMarketOrDefault(id: string | undefined | null): MarketConfig {
  if (isMarketId(id)) return markets[id];
  return markets[defaultMarketId];
}

export function getDefaultCountryFilters(marketId: MarketId) {
  const market = markets[marketId];
  return {
    country: market.countryName,
    countryCode: market.countryCode,
  };
}
