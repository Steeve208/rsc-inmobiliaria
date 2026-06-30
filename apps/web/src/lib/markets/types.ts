export type Locale = "en" | "es" | "pt";

export type MarketId = "br" | "pt" | "us" | "es" | "fr" | "ar";

export type NavLinkConfig = {
  href: string;
  /** Translation key within the `nav` namespace */
  label: string;
  highlight?: boolean;
  icon?: "business";
};

export type MarketConfig = {
  id: MarketId;
  flag: string;
  nameKey: string;
  defaultLocale: Locale;
  currency: {
    code: string;
    symbol: string;
  };
  countryName: string;
  countryCode: string;
  creditAvailable: boolean;
  navLinks: NavLinkConfig[];
  geocodeLang: string;
  /** Photon bbox: minLon, maxLon, minLat, maxLat */
  geocodeBbox?: [number, number, number, number];
};

export type MarketContextValue = {
  market: MarketConfig;
  marketId: MarketId;
  isConfirmed: boolean;
  setMarket: (id: MarketId, options?: { confirmed?: boolean }) => void;
  confirmMarket: () => void;
};
