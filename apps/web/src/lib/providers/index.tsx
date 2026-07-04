"use client";

import { QueryProvider } from "./query-provider";
import { ThemeProvider } from "./theme-provider";
import { MarketProvider } from "./market-provider";
import { FavoritesProvider } from "./favorites-provider";
import { CompareProvider } from "./compare-provider";
import { VehicleCompareProvider } from "./vehicle-compare-provider";
import { SavedSearchesProvider } from "./saved-searches-provider";
import { BuyerActivitySyncProvider } from "./buyer-activity-sync-provider";
import type { MarketId } from "@/lib/markets/types";

type Props = {
  children: React.ReactNode;
  initialMarketId: MarketId;
  initialMarketConfirmed: boolean;
};

export function Providers({
  children,
  initialMarketId,
  initialMarketConfirmed,
}: Props) {
  return (
    <QueryProvider>
      <ThemeProvider>
        <MarketProvider
          initialMarketId={initialMarketId}
          initialConfirmed={initialMarketConfirmed}
        >
          <FavoritesProvider>
            <CompareProvider>
              <VehicleCompareProvider>
                <SavedSearchesProvider>
                  <BuyerActivitySyncProvider>{children}</BuyerActivitySyncProvider>
                </SavedSearchesProvider>
              </VehicleCompareProvider>
            </CompareProvider>
          </FavoritesProvider>
        </MarketProvider>
      </ThemeProvider>
    </QueryProvider>
  );
}
