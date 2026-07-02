import type { MarketConfig, MarketId } from "./types";
import { marketDefinitions } from "./definitions";

export const markets: Record<MarketId, MarketConfig> = marketDefinitions;

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

export { marketDefinitions, marketRegions, isoCountryToMarket } from "./definitions";
