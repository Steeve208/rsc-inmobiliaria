"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/lib/i18n/routing";
import { getMarket, markets } from "@/lib/markets/config";
import { setMarketCookies } from "@/lib/markets/client";
import type { MarketContextValue, MarketId } from "@/lib/markets/types";

const MarketContext = createContext<MarketContextValue | null>(null);

type Props = {
  children: ReactNode;
  initialMarketId: MarketId;
  initialConfirmed: boolean;
};

export function MarketProvider({
  children,
  initialMarketId,
  initialConfirmed,
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();
  const [marketId, setMarketId] = useState<MarketId>(initialMarketId);
  const [isConfirmed, setIsConfirmed] = useState(initialConfirmed);

  const setMarket = useCallback(
    (id: MarketId, options?: { confirmed?: boolean }) => {
      const next = getMarket(id);
      const confirmed = options?.confirmed ?? true;

      setMarketId(id);
      setIsConfirmed(confirmed);
      setMarketCookies(id, confirmed);

      if (confirmed && next.defaultLocale !== locale) {
        router.replace(pathname, { locale: next.defaultLocale });
      }
    },
    [locale, pathname, router],
  );

  const confirmMarket = useCallback(() => {
    setIsConfirmed(true);
    setMarketCookies(marketId, true);
  }, [marketId]);

  const value = useMemo<MarketContextValue>(
    () => ({
      market: markets[marketId],
      marketId,
      isConfirmed,
      setMarket,
      confirmMarket,
    }),
    [confirmMarket, isConfirmed, marketId, setMarket],
  );

  return (
    <MarketContext.Provider value={value}>{children}</MarketContext.Provider>
  );
}

export function useMarket(): MarketContextValue {
  const context = useContext(MarketContext);
  if (!context) {
    throw new Error("useMarket must be used within MarketProvider");
  }
  return context;
}

export function useMarketOptional(): MarketContextValue | null {
  return useContext(MarketContext);
}
