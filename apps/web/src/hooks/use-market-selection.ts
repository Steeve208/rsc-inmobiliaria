"use client";

import { useCallback } from "react";
import { useLocale } from "next-intl";
import { usePathname } from "@/lib/i18n/routing";
import { navigateToLocale } from "@/lib/i18n/navigate-locale";
import { useMarket } from "@/lib/providers/market-provider";
import type { MarketId } from "@/lib/markets/types";

/**
 * Selects a market (country/currency) without changing the UI language.
 * Language is chosen separately in LocaleSwitcher.
 */
export function useMarketSelection() {
  const locale = useLocale();
  const pathname = usePathname() || "/";
  const { market, marketId, setMarket, confirmMarket, isConfirmed } =
    useMarket();

  const selectMarket = useCallback(
    (id: MarketId, options?: { confirmed?: boolean }) => {
      setMarket(id, options);
    },
    [setMarket],
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
