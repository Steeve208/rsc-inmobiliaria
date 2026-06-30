"use client";

import { useTranslations } from "next-intl";
import { Building2, Menu, X } from "lucide-react";
import { Logo } from "@/components/layout/logo";
import { GlobalSearch } from "@/components/layout/global-search";
import { RegionSwitcher } from "@/components/layout/region-switcher";
import { MarketDetectionBanner } from "@/components/layout/market-detection-banner";
import { HeaderAuthActions } from "@/features/auth";
import { Link } from "@/lib/i18n/routing";
import { useUiStore } from "@/hooks/use-ui-store";
import { useMarket } from "@/lib/providers/market-provider";
import { cn } from "@/lib/utils";

const navLinkClass =
  "text-sm font-medium text-white/75 transition-colors hover:text-white whitespace-nowrap";

export function Header() {
  const t = useTranslations("nav");
  const { market } = useMarket();
  const { isMobileMenuOpen, setMobileMenuOpen, toggleMobileMenu } =
    useUiStore();

  const navLinks = market.navLinks.map((link) => ({
    ...link,
    label: t(link.label),
    icon: link.icon === "business" ? Building2 : undefined,
  }));

  return (
    <>
      <MarketDetectionBanner />
      <header className="sticky top-0 z-50 bg-[#000a1a]">
        <div className="mx-auto flex h-[72px] max-w-[1440px] items-center gap-4 px-6 lg:px-8">
          <Logo />

          <GlobalSearch />

          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <div className="hidden sm:block">
              <RegionSwitcher />
            </div>

            <HeaderAuthActions />

            <button
              type="button"
              className="inline-flex rounded-md p-2 text-white lg:hidden"
              onClick={toggleMobileMenu}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="size-5" />
              ) : (
                <Menu className="size-5" />
              )}
            </button>
          </div>
        </div>

        <nav className="hidden border-t border-white/5 lg:block">
          <div className="mx-auto flex max-w-[1440px] items-center gap-6 px-6 py-2.5 lg:px-8 xl:gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  navLinkClass,
                  "inline-flex items-center gap-1.5",
                  link.highlight && "text-[#fbbf24] hover:text-[#fcd34d]",
                )}
              >
                {link.icon && <link.icon className="size-3.5 shrink-0" />}
                {link.label}
              </Link>
            ))}
          </div>
        </nav>

        {isMobileMenuOpen && (
          <div className="border-t border-white/10 px-6 py-4 lg:hidden">
            <nav className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "flex items-center gap-1.5 rounded-md px-2 py-2.5 text-sm font-medium hover:bg-white/5 hover:text-white",
                    link.highlight ? "text-[#fbbf24]" : "text-white/90",
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.icon && <link.icon className="size-3.5 shrink-0" />}
                  {link.label}
                </Link>
              ))}
            </nav>
            <div className="mt-4 flex flex-col gap-3 border-t border-white/10 pt-4">
              <RegionSwitcher />
              <HeaderAuthActions variant="mobile" />
            </div>
          </div>
        )}
      </header>
    </>
  );
}
