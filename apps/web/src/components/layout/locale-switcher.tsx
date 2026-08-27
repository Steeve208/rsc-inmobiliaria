"use client";

import { useLocale, useTranslations } from "next-intl";
import { ChevronDown } from "lucide-react";
import { usePathname } from "@/lib/i18n/routing";
import { navigateToLocale } from "@/lib/i18n/navigate-locale";
import { SimpleMenu } from "@/components/layout/simple-menu";
import { useMarketOptional } from "@/lib/providers/market-provider";
import { TOP_LOCALES } from "@/lib/markets/types";
import { cn } from "@/lib/utils";

type Props = {
  className?: string;
};

function MarketCurrencyCode() {
  const market = useMarketOptional();
  return <>{market?.market.currency.code ?? "USD"}</>;
}

export function LocaleSwitcher({ className }: Props) {
  const t = useTranslations("markets.languages");
  const tNav = useTranslations("nav");
  const locale = useLocale();
  const pathname = usePathname() || "/";

  return (
    <SimpleMenu
      className={className}
      trigger={({ open, toggle }) => (
        <button
          type="button"
          onClick={toggle}
          className="inline-flex h-9 items-center gap-1.5 rounded-[14px] px-2 text-sm font-medium text-[#C8D0DD] transition-colors duration-300 hover:bg-white/5 hover:text-[#D49A3F]"
          aria-label={tNav("changeLanguage")}
          aria-expanded={open}
          aria-haspopup="menu"
        >
          <span className="text-xs font-semibold tracking-wide">
            {locale.toUpperCase()} / <MarketCurrencyCode />
          </span>
          <ChevronDown className="size-3.5 opacity-70" />
        </button>
      )}
    >
      {(close) =>
        TOP_LOCALES.map((item) => (
          <button
            key={item}
            type="button"
            role="menuitem"
            onClick={() => {
              close();
              if (item !== locale) navigateToLocale(pathname, item);
            }}
            className={cn(
              "flex w-full items-center rounded-xl px-3 py-2 text-left text-sm text-[#AEB7C5] transition-colors hover:bg-white/5 hover:text-white",
              locale === item && "font-semibold text-white",
            )}
          >
            <span className="me-2 text-xs font-bold tracking-wide">
              {item.toUpperCase()}
            </span>
            {t(item)}
          </button>
        ))
      }
    </SimpleMenu>
  );
}
