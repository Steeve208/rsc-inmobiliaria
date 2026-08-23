"use client";

import { useTranslations } from "next-intl";
import { ChevronDown, Globe, MapPin } from "lucide-react";
import { SimpleMenu } from "@/components/layout/simple-menu";
import { marketList, marketRegions } from "@/lib/markets/config";
import { useMarketSelection } from "@/hooks/use-market-selection";
import type { MarketRegion } from "@/lib/markets/types";
import { cn } from "@/lib/utils";

function marketsByRegion(region: MarketRegion) {
  return marketList.filter((market) => market.region === region);
}

type Props = {
  variant?: "default" | "location";
};

export function RegionSwitcher({ variant = "default" }: Props) {
  const t = useTranslations("markets");
  const tNav = useTranslations("nav");
  const tHeader = useTranslations("marketplace.header");
  const { market, marketId, selectMarket } = useMarketSelection();

  return (
    <SimpleMenu
      contentClassName="min-w-56"
      trigger={({ open, toggle }) => (
        <button
          type="button"
          onClick={toggle}
          className="inline-flex h-9 items-center gap-1.5 rounded-[14px] px-2 text-sm font-medium text-[#C8D0DD] transition-colors duration-300 hover:bg-white/5 hover:text-[#D4A62A]"
          aria-label={tNav("changeRegion")}
          aria-expanded={open}
          aria-haspopup="menu"
        >
          {variant === "location" ? (
            <>
              <MapPin className="size-4 shrink-0 text-[#D4A62A]" />
              <span className="leading-tight text-left">
                <span className="block text-[10px] text-white/55">
                  {tHeader("deliverTo")}
                </span>
                <span className="block max-w-[72px] truncate text-xs font-semibold text-white sm:max-w-[140px]">
                  {market.flag} {t(`names.${marketId}`)}
                </span>
              </span>
            </>
          ) : (
            <>
              <Globe className="size-4" strokeWidth={1.75} />
              <span className="max-w-[140px] truncate">
                {market.flag} {t(`names.${marketId}`)}
              </span>
              <ChevronDown className="size-3.5 opacity-70" />
            </>
          )}
        </button>
      )}
    >
      {(close) =>
        marketRegions.map((region) => {
          const items = marketsByRegion(region.id);
          if (items.length === 0) return null;

          return (
            <div key={region.id} className="py-1">
              <p className="px-3 py-1 text-[10px] font-semibold tracking-wide text-[#8C97A8] uppercase">
                {t(region.labelKey)}
              </p>
              {items.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    selectMarket(item.id);
                    close();
                  }}
                  className={cn(
                    "flex w-full items-center rounded-xl px-3 py-2 text-left text-sm text-[#AEB7C5] transition-colors hover:bg-white/5 hover:text-white",
                    marketId === item.id && "font-semibold text-white",
                  )}
                >
                  <span className="me-2">{item.flag}</span>
                  <span className="flex-1">{t(`names.${item.id}`)}</span>
                  <span className="ms-2 text-xs text-[#8C97A8]">
                    {item.currency.code}
                  </span>
                </button>
              ))}
            </div>
          );
        })
      }
    </SimpleMenu>
  );
}
