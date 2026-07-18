"use client";

import { useLocale, useTranslations } from "next-intl";
import { ChevronDown, Heart, Menu, X } from "lucide-react";
import { Logo } from "@/components/layout/logo";
import { RegionSwitcher } from "@/components/layout/region-switcher";
import { MarketDetectionBanner } from "@/components/layout/market-detection-banner";
import { HeaderAuthActions } from "@/features/auth";
import { Link } from "@/lib/i18n/routing";
import { useUiStore } from "@/hooks/use-ui-store";
import { useFavorites } from "@/hooks/use-favorites";
import { cn } from "@/lib/utils";

const navLinkClass =
  "text-sm font-medium text-[#C8D0DD] transition-colors duration-300 hover:text-[#D6A62E] whitespace-nowrap";

const landingNav = [
  { href: "/imoveis?transaction=buy", labelKey: "buy" as const },
  { href: "/imoveis?transaction=rent", labelKey: "rent" as const },
  { href: "/veiculos", labelKey: "vehicles" as const },
  { href: "/cadastrar", labelKey: "sell" as const },
  { href: "/para-empresas", labelKey: "companies" as const },
  { href: "/financing", labelKey: "financing" as const },
] as const;

const moreLinks = [
  { href: "invest", labelKey: "invest" as const },
  { href: "/services", labelKey: "services" as const },
  { href: "/help", labelKey: "help" as const },
] as const;

export function Header() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const { count } = useFavorites();
  const { isMobileMenuOpen, setMobileMenuOpen, toggleMobileMenu } =
    useUiStore();

  return (
    <>
      <MarketDetectionBanner />
      <header className="sticky top-0 z-50 border-b border-[rgba(255,255,255,.05)] bg-[rgba(6,8,15,.90)] backdrop-blur-[20px]">
        <div className="rk-container flex h-[92px] items-center gap-6">
          <Logo />

          <nav className="ml-4 hidden items-center gap-10 xl:flex">
            {landingNav.map((link) => (
              <Link key={link.labelKey} href={link.href} className={navLinkClass}>
                {t(link.labelKey)}
              </Link>
            ))}
            <div className="group relative">
              <button type="button" className={cn(navLinkClass, "inline-flex items-center gap-1")}>
                {t("more")}
                <ChevronDown className="size-4 opacity-70" />
              </button>
              <div className="invisible absolute left-0 top-full z-50 min-w-[180px] pt-3 opacity-0 transition duration-300 group-hover:visible group-hover:opacity-100">
                <div className="rounded-[16px] border border-[rgba(255,255,255,.08)] bg-[#111827] py-2 shadow-[0_15px_40px_rgba(0,0,0,.30)]">
                  {moreLinks.map((link) =>
                    link.href === "invest" ? (
                      <a
                        key={link.labelKey}
                        href={`/${locale}#inversion`}
                        className="block px-4 py-2.5 text-sm text-[#C8D0DD] transition-colors duration-300 hover:bg-[#161F31] hover:text-[#D6A62E]"
                      >
                        {t(link.labelKey)}
                      </a>
                    ) : (
                      <Link
                        key={link.labelKey}
                        href={link.href}
                        className="block px-4 py-2.5 text-sm text-[#C8D0DD] transition-colors duration-300 hover:bg-[#161F31] hover:text-[#D6A62E]"
                      >
                        {t(link.labelKey)}
                      </Link>
                    ),
                  )}
                </div>
              </div>
            </div>
          </nav>

          <div className="ml-auto flex shrink-0 items-center gap-3">
            <div className="hidden sm:block">
              <RegionSwitcher />
            </div>

            <Link
              href="/favoritos"
              className="relative inline-flex rounded-[14px] p-2 text-[#C8D0DD] transition-colors duration-300 hover:text-[#D6A62E]"
              aria-label={t("wishlist")}
            >
              <Heart className="size-5" strokeWidth={1.75} />
              {count > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full bg-[#D6A62E] text-[10px] font-bold text-[#070B14]">
                  {count > 9 ? "9+" : count}
                </span>
              )}
            </Link>

            <HeaderAuthActions />

            <button
              type="button"
              className="inline-flex rounded-[14px] p-2 text-white xl:hidden"
              onClick={toggleMobileMenu}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="border-t border-[rgba(255,255,255,.05)] px-5 py-4 md:px-8 xl:hidden">
            <nav className="flex flex-col gap-1">
              {landingNav.map((link) => (
                <Link
                  key={link.labelKey}
                  href={link.href}
                  className="rounded-[14px] px-2 py-2.5 text-sm font-medium text-[#C8D0DD] hover:bg-[#161F31] hover:text-[#D6A62E]"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t(link.labelKey)}
                </Link>
              ))}
              {moreLinks.map((link) =>
                link.href === "invest" ? (
                  <a
                    key={link.labelKey}
                    href={`/${locale}#inversion`}
                    className="rounded-[14px] px-2 py-2.5 text-sm font-medium text-[#8C97A8] hover:bg-[#161F31]"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {t(link.labelKey)}
                  </a>
                ) : (
                  <Link
                    key={link.labelKey}
                    href={link.href}
                    className="rounded-[14px] px-2 py-2.5 text-sm font-medium text-[#8C97A8] hover:bg-[#161F31]"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {t(link.labelKey)}
                  </Link>
                ),
              )}
            </nav>
            <div className="mt-4 flex flex-col gap-3 border-t border-[rgba(255,255,255,.05)] pt-4">
              <RegionSwitcher />
              <HeaderAuthActions variant="mobile" />
            </div>
          </div>
        )}
      </header>
    </>
  );
}
