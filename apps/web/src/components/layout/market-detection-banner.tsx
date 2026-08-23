"use client";

import { useTranslations } from "next-intl";
import { Check, Globe, X } from "lucide-react";
import { marketList } from "@/lib/markets/config";
import { useMarketSelection } from "@/hooks/use-market-selection";
import { SimpleMenu } from "@/components/layout/simple-menu";
import { cn } from "@/lib/utils";

export function MarketDetectionBanner() {
  const t = useTranslations("markets");
  const { market, isConfirmed, confirmDetectedMarket, selectMarket } =
    useMarketSelection();

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
            onClick={confirmDetectedMarket}
            className="inline-flex items-center gap-1.5 rounded-md bg-[#d4a017] px-3 py-1.5 text-xs font-semibold text-[#000a1a] transition-colors hover:bg-[#c39216]"
          >
            <Check className="size-3.5" />
            {t("detection.confirm")}
          </button>

          <SimpleMenu
            trigger={({ toggle }) => (
              <button
                type="button"
                onClick={toggle}
                className="rounded-md border border-white/20 px-3 py-1.5 text-xs font-medium text-white/90 transition-colors hover:bg-white/5"
              >
                {t("detection.change")}
              </button>
            )}
          >
            {(close) =>
              marketList.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    selectMarket(item.id, { confirmed: true });
                    close();
                  }}
                  className={cn(
                    "flex w-full items-center rounded-xl px-3 py-2 text-left text-sm text-[#AEB7C5] transition-colors hover:bg-white/5 hover:text-white",
                    market.id === item.id && "font-semibold text-white",
                  )}
                >
                  <span className="mr-2">{item.flag}</span>
                  {t(`names.${item.id}`)}
                </button>
              ))
            }
          </SimpleMenu>

          <button
            type="button"
            onClick={confirmDetectedMarket}
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
