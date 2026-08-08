"use client";

import { useCallback } from "react";
import { useLocale } from "next-intl";
import { getPathname, usePathname } from "@/lib/i18n/routing";
import { getMarket } from "@/lib/markets/config";
import { useMarket } from "@/lib/providers/market-provider";
import type { Locale, MarketId } from "@/lib/markets/types";

/**
 * Hard-navigate when the market's default language differs from the current
 * locale. Soft `router.replace(..., { locale })` can leave the URL on `/pt`
 * while only the market cookie updates (Senegal → French looked "broken").
 */
function navigateToLocale(pathname: string, locale: Locale) {
  const href = getPathname({
    href: pathname || "/",
    locale,
    forcePrefix: true,
  });
  const search =
    typeof window !== "undefined" ? window.location.search : "";
  const hash = typeof window !== "undefined" ? window.location.hash : "";
  window.location.assign(`${href}${search}${hash}`);
}

/**
 * Selects a market and switches the UI locale to that market's default language.
 */
export function useMarketSelection() {
  const locale = useLocale();
  const pathname = usePathname() || "/";
  const { market, marketId, setMarket, confirmMarket, isConfirmed } =
    useMarket();

  const selectMarket = useCallback(
    (id: MarketId, options?: { confirmed?: boolean }) => {
      const next = getMarket(id);
      setMarket(id, options);

      if (next.defaultLocale !== locale) {
        navigateToLocale(pathname, next.defaultLocale);
      }
    },
    [locale, pathname, setMarket],
  );

  const confirmDetectedMarket = useCallback(() => {
    confirmMarket();
    const nextLocale = market.defaultLocale;
    if (nextLocale !== locale) {
      navigateToLocale(pathname, nextLocale);
    }
  }, [confirmMarket, locale, market.defaultLocale, pathname]);

  return {
    market,
    marketId,
    isConfirmed,
    selectMarket,
    confirmDetectedMarket,
  };
}
