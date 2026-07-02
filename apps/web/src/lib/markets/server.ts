import {
  defaultMarketId,
  getMarketOrDefault,
  isMarketId,
  isoCountryToMarket,
  markets,
} from "./config";
import {
  MARKET_CONFIRMED_COOKIE,
  MARKET_COOKIE,
  MARKET_COOKIE_MAX_AGE,
} from "./constants";
import type { MarketId } from "./types";

type CookieReader = {
  get: (name: string) => { value: string } | undefined;
};

const COUNTRY_TO_MARKET = isoCountryToMarket;

function detectFromAcceptLanguage(acceptLanguage: string | null): MarketId {
  const primary = acceptLanguage?.split(",")[0]?.trim().toLowerCase() ?? "";

  if (primary.startsWith("pt")) return "br";
  if (primary.startsWith("es")) return "es";
  if (primary.startsWith("fr")) return "fr";
  if (primary.startsWith("en")) return "us";

  return defaultMarketId;
}

export function detectMarketFromHeaders(
  headers: Headers | Record<string, string | string[] | undefined>,
): MarketId {
  const getHeader = (name: string) => {
    if (headers instanceof Headers) {
      return headers.get(name);
    }
    const value = headers[name.toLowerCase()];
    return Array.isArray(value) ? value[0] : value ?? null;
  };

  const geoCountry =
    getHeader("x-vercel-ip-country") ??
    getHeader("cf-ipcountry") ??
    getHeader("x-country-code");

  if (geoCountry) {
    const mapped = COUNTRY_TO_MARKET[geoCountry.toUpperCase()];
    if (mapped) return mapped;
  }

  return detectFromAcceptLanguage(getHeader("accept-language"));
}

export function readMarketFromCookies(
  cookieStore: CookieReader,
  headers?: Headers | Record<string, string | string[] | undefined>,
) {
  const cookieMarket = cookieStore.get(MARKET_COOKIE)?.value;
  const confirmed = cookieStore.get(MARKET_CONFIRMED_COOKIE)?.value === "1";

  if (isMarketId(cookieMarket)) {
    return {
      marketId: cookieMarket,
      market: getMarketOrDefault(cookieMarket),
      isConfirmed: confirmed,
    };
  }

  const detected = headers
    ? detectMarketFromHeaders(headers)
    : defaultMarketId;

  return {
    marketId: detected,
    market: markets[detected],
    isConfirmed: false,
  };
}

export function readMarketFromRequest(request: {
  cookies: CookieReader;
  headers: Headers;
}) {
  return readMarketFromCookies(request.cookies, request.headers);
}

export function marketCookieOptions() {
  return {
    path: "/",
    maxAge: MARKET_COOKIE_MAX_AGE,
    sameSite: "lax" as const,
  };
}

export { MARKET_COOKIE, MARKET_CONFIRMED_COOKIE };
