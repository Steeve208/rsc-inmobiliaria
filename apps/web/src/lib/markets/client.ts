import {
  MARKET_CONFIRMED_COOKIE,
  MARKET_COOKIE,
  MARKET_COOKIE_MAX_AGE,
} from "./constants";
import type { MarketId } from "./types";

function writeCookie(name: string, value: string) {
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${MARKET_COOKIE_MAX_AGE}; samesite=lax`;
}

export function setMarketCookies(id: MarketId, confirmed = true) {
  writeCookie(MARKET_COOKIE, id);
  writeCookie(MARKET_CONFIRMED_COOKIE, confirmed ? "1" : "0");
}

export function readMarketCookie(): MarketId | null {
  if (typeof document === "undefined") return null;

  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${MARKET_COOKIE}=`));

  if (!match) return null;

  const value = decodeURIComponent(match.split("=")[1] ?? "");
  return value as MarketId;
}

export function readMarketConfirmedCookie(): boolean {
  if (typeof document === "undefined") return false;

  return document.cookie
    .split("; ")
    .some((row) => row.startsWith(`${MARKET_CONFIRMED_COOKIE}=1`));
}
