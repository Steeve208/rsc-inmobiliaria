"use client";

import { useTranslations } from "next-intl";
import { ChevronDown, Globe } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { marketList } from "@/lib/markets/config";
import { useMarket } from "@/lib/providers/market-provider";

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
      <DropdownMenuContent align="end" className="min-w-44">
        {marketList.map((item) => (
          <DropdownMenuItem
            key={item.id}
            onClick={() => setMarket(item.id)}
            className={marketId === item.id ? "font-semibold" : undefined}
          >
            <span className="mr-2">{item.flag}</span>
            {t(`names.${item.id}`)}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
