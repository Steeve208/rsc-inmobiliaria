"use client";

import { useCallback } from "react";
import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/lib/i18n/routing";
import { getMarket } from "@/lib/markets/config";
import { useMarket } from "@/lib/providers/market-provider";
import type { MarketId } from "@/lib/markets/types";

/**
 * Selects a market and switches the UI locale to that market's default language.
 * Region used to only update currency/geo cookies, which made translations look broken.
 */
export function useMarketSelection() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const { market, marketId, setMarket, confirmMarket, isConfirmed } =
    useMarket();

  const selectMarket = useCallback(
    (id: MarketId, options?: { confirmed?: boolean }) => {
      const next = getMarket(id);
      setMarket(id, options);

      if (next.defaultLocale !== locale) {
        router.replace(pathname, { locale: next.defaultLocale });
      }
    },
    [locale, pathname, router, setMarket],
  );

  const confirmDetectedMarket = useCallback(() => {
    confirmMarket();
    const nextLocale = market.defaultLocale;
    if (nextLocale !== locale) {
      router.replace(pathname, { locale: nextLocale });
    }
  }, [confirmMarket, locale, market.defaultLocale, pathname, router]);

  return {
    market,
    marketId,
    isConfirmed,
    selectMarket,
    confirmDetectedMarket,
  };
}
