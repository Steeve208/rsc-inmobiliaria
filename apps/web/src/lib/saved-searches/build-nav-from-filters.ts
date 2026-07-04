import type { ImoveisFilters, MapNavigation } from "@/features/imoveis/types";
import { defaultImoveisFilters } from "@/features/imoveis/types";
import { getDefaultCountryFilters } from "@/lib/markets/config";

export function buildNavFromFilters(filters: ImoveisFilters): MapNavigation {
  const country = filters.country || defaultImoveisFilters.country;
  const countryCode =
    country === "Brasil" || country === "Brazil" ? "BR" : filters.country.slice(0, 2).toUpperCase();

  return {
    level: "properties",
    country,
    countryCode,
    state: filters.state || undefined,
    city: filters.city || undefined,
    neighborhood: filters.neighborhood || undefined,
  };
}

export function defaultMarketCountryName(marketId = "br") {
  return getDefaultCountryFilters(marketId as "br" | "us").country;
}
