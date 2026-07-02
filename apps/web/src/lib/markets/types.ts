export type Locale = "en" | "es" | "pt";

export type MarketRegion =
  | "latam"
  | "north_america"
  | "caribbean"
  | "europe"
  | "africa";

export type MarketId =
  | "br" | "mx" | "ar" | "co" | "cl" | "pe" | "uy" | "ec" | "ve" | "bo"
  | "py" | "cr" | "pa" | "gt" | "do" | "cu" | "hn" | "sv" | "ni"
  | "us" | "ca"
  | "jm" | "pr" | "tt" | "ht" | "bs" | "bb"
  | "es" | "pt" | "fr" | "de" | "it" | "gb" | "ie" | "nl" | "be" | "ch"
  | "at" | "pl" | "se" | "no" | "gr" | "cz" | "ro"
  | "za" | "ng" | "ke" | "gh" | "eg" | "ma" | "ao" | "mz" | "sn" | "ci" | "tz";

export type NavLinkConfig = {
  href: string;
  /** Translation key within the `nav` namespace */
  label: string;
  highlight?: boolean;
  icon?: "business";
};

export type MarketConfig = {
  id: MarketId;
  region: MarketRegion;
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
  /** Photon bbox: minLon, minLat, maxLon, maxLat */
  geocodeBbox?: [number, number, number, number];
};

export type MarketContextValue = {
  market: MarketConfig;
  marketId: MarketId;
  isConfirmed: boolean;
  setMarket: (id: MarketId, options?: { confirmed?: boolean }) => void;
  confirmMarket: () => void;
};
