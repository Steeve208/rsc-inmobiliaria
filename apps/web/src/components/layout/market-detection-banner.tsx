"use client";

import { useTranslations } from "next-intl";
import { Check, Globe, X } from "lucide-react";
import { useMarket } from "@/lib/providers/market-provider";
import { marketList } from "@/lib/markets/config";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function MarketDetectionBanner() {
  const t = useTranslations("markets");
  const { market, isConfirmed, confirmMarket, setMarket } = useMarket();

  if (isConfirmed) return null;

  return (
    <div
      role="status"
      className="border-b border-[#d4a017]/30 bg-[#0f172a] px-4 py-3 text-sm text-white"
    >
      <div className="mx-auto flex max-w-[1440px] flex-col gap-3 sm:flex-row sm:items-center sm:justify-between lg:px-8">
        <p className="flex items-start gap-2 sm:items-center">
          <Globe className="mt-0.5 size-4 shrink-0 text-[#d4a017] sm:mt-0" />
          <span>
            {t("detection.message", {
              country: `${market.flag} ${t(`names.${market.id}`)}`,
            })}
          </span>
        </p>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={confirmMarket}
            className="inline-flex items-center gap-1.5 rounded-md bg-[#d4a017] px-3 py-1.5 text-xs font-semibold text-[#000a1a] transition-colors hover:bg-[#c39216]"
          >
            <Check className="size-3.5" />
            {t("detection.confirm")}
          </button>

          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <button
                  type="button"
                  className="rounded-md border border-white/20 px-3 py-1.5 text-xs font-medium text-white/90 transition-colors hover:bg-white/5"
                >
                  {t("detection.change")}
                </button>
              }
            />
            <DropdownMenuContent align="end" className="min-w-44">
              {marketList.map((item) => (
                <DropdownMenuItem
                  key={item.id}
                  onClick={() => setMarket(item.id, { confirmed: true })}
                  className={market.id === item.id ? "font-semibold" : undefined}
                >
                  <span className="mr-2">{item.flag}</span>
                  {t(`names.${item.id}`)}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <button
            type="button"
            onClick={confirmMarket}
            className="rounded-md p-1.5 text-white/50 transition-colors hover:bg-white/5 hover:text-white"
            aria-label={t("detection.dismiss")}
          >
            <X className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
