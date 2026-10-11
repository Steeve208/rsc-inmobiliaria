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
  size?: "md" | "lg";
};

function MarketCurrencyCode() {
  const market = useMarketOptional();
  return <>{market?.market.currency.code ?? "USD"}</>;
}

export function LocaleSwitcher({ className, size = "md" }: Props) {
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
          className={cn(
            "inline-flex items-center font-medium text-[#C8D0DD] transition-colors duration-300 hover:bg-white/5 hover:text-[#D49A3F]",
            size === "lg"
              ? "h-14 gap-2.5 rounded-full px-4 text-xl"
              : "h-11 gap-2 rounded-full px-3.5 text-base",
          )}
          aria-label={tNav("changeLanguage")}
          aria-expanded={open}
          aria-haspopup="menu"
        >
          <span
            className={cn(
              "font-semibold tracking-wide",
              size === "lg" ? "text-xl" : "text-base",
            )}
          >
            {locale.toUpperCase()}
            <span className="hidden min-[400px]:inline">
              {" "}
              / <MarketCurrencyCode />
            </span>
          </span>
          <ChevronDown className={cn("opacity-70", size === "lg" ? "size-6" : "size-5")} />
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
