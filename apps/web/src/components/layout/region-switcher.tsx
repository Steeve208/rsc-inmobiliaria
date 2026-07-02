"use client";

import { useTranslations } from "next-intl";
import { ChevronDown, Globe } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { marketList, marketRegions } from "@/lib/markets/config";
import { useMarket } from "@/lib/providers/market-provider";
import type { MarketRegion } from "@/lib/markets/types";

function marketsByRegion(region: MarketRegion) {
  return marketList.filter((market) => market.region === region);
}

export function RegionSwitcher() {
  const t = useTranslations("markets");
  const tNav = useTranslations("nav");
  const { market, marketId, setMarket } = useMarket();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <button
            type="button"
            className="flex items-center gap-1.5 rounded-md px-2 py-1.5 text-sm text-white/90 transition-colors hover:bg-white/5 hover:text-white"
            aria-label={tNav("changeRegion")}
          >
            <Globe className="size-4" strokeWidth={1.5} />
            <span>
              {market.flag} {t(`names.${marketId}`)}
            </span>
            <ChevronDown className="size-3.5 opacity-70" />
          </button>
        }
      />
      <DropdownMenuContent
        align="end"
        className="max-h-[min(70vh,28rem)] min-w-56 overflow-y-auto"
      >
        {marketRegions.map((region) => {
          const items = marketsByRegion(region.id);
          if (items.length === 0) return null;

          return (
            <DropdownMenuGroup key={region.id}>
              <DropdownMenuLabel className="text-xs uppercase tracking-wide text-muted-foreground">
                {t(region.labelKey)}
              </DropdownMenuLabel>
              {items.map((item) => (
                <DropdownMenuItem
                  key={item.id}
                  onClick={() => setMarket(item.id)}
                  className={marketId === item.id ? "font-semibold" : undefined}
                >
                  <span className="mr-2">{item.flag}</span>
                  <span className="flex-1">{t(`names.${item.id}`)}</span>
                  <span className="ml-2 text-xs text-muted-foreground">
                    {t(`languages.${item.defaultLocale}`)}
                  </span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
