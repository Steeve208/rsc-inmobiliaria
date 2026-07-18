"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
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
  "text-sm font-medium text-[#AEB7C5] transition-colors duration-300 hover:text-[#D4A62A] whitespace-nowrap";

const productNav = [
  { href: "/imoveis", labelKey: "exploreNav" as const },
  { href: "/#categorias", labelKey: "categories" as const },
  { href: "/para-empresas", labelKey: "companies" as const },
  { href: "/services", labelKey: "services" as const },
] as const;

const moreLinks = [
  { href: "/imoveis?type=house", labelKey: "explore.houses" as const },
  { href: "/imoveis?type=apartment", labelKey: "explore.apartments" as const },
  { href: "/imoveis?type=land", labelKey: "explore.land" as const },
  { href: "/imoveis?launch=1", labelKey: "explore.launches" as const },
  { href: "/imoveis?type=commercial", labelKey: "explore.commercial" as const },
  { href: "/imoveis?featured=1", labelKey: "explore.luxury" as const },
  { href: "/veiculos", labelKey: "vehicles" as const },
  { href: "/financing", labelKey: "financing" as const },
  { href: "/como-funciona", labelKey: "howItWorks" as const },
  { href: "/help", labelKey: "help" as const },
] as const;

const categoryLinks = [
  { href: "/imoveis", labelKey: "cat.properties" as const },
  { href: "/veiculos", labelKey: "cat.vehicles" as const },
  { href: "/imoveis?launch=1", labelKey: "cat.launches" as const },
  { href: "/para-empresas", labelKey: "cat.companies" as const },
  { href: "/financing", labelKey: "cat.financing" as const },
  { href: "/services", labelKey: "cat.services" as const },
] as const;

export function Header() {
  const t = useTranslations("nav");
  const { count } = useFavorites();
  const { isMobileMenuOpen, setMobileMenuOpen, toggleMobileMenu } =
    useUiStore();
  const [moreOpen, setMoreOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);

  return (
    <>
      <MarketDetectionBanner />
      <header className="sticky top-0 z-50 border-b border-[rgba(255,255,255,.05)] bg-[rgba(6,8,15,.90)] backdrop-blur-[20px]">
        <div className="rk-container flex h-[96px] items-center gap-5">
          <Logo />

          <nav className="ml-2 hidden items-center gap-8 xl:flex">
            {productNav.map((link) =>
              link.labelKey === "categories" ? (
                <div
                  key={link.labelKey}
                  className="relative"
                  onMouseEnter={() => setCategoriesOpen(true)}
                  onMouseLeave={() => setCategoriesOpen(false)}
                >
                  <button
                    type="button"
                    className={cn(navLinkClass, "inline-flex items-center gap-1")}
                    aria-expanded={categoriesOpen}
                    onClick={() => setCategoriesOpen((open) => !open)}
                  >
                    {t(link.labelKey)}
                    <ChevronDown
                      className={cn(
                        "size-3.5 transition-transform duration-200",
                        categoriesOpen && "rotate-180",
                      )}
                    />
                  </button>
                  {categoriesOpen ? (
                    <div className="absolute left-0 top-full z-50 pt-3">
                      <div className="min-w-[220px] rounded-2xl border border-white/10 bg-[#0E1422]/98 p-2 shadow-[0_24px_60px_rgba(0,0,0,.45)] backdrop-blur-xl">
                        {categoryLinks.map((item) => (
                          <Link
                            key={item.labelKey}
                            href={item.href}
                            className="block rounded-xl px-3 py-2.5 text-sm text-[#AEB7C5] transition-colors hover:bg-white/5 hover:text-[#D4A62A]"
                            onClick={() => setCategoriesOpen(false)}
                          >
                            {t(item.labelKey)}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ) : null}
                </div>
              ) : (
                <Link key={link.labelKey} href={link.href} className={navLinkClass}>
                  {t(link.labelKey)}
                </Link>
              ),
            )}

            <div
              className="relative"
              onMouseEnter={() => setMoreOpen(true)}
              onMouseLeave={() => setMoreOpen(false)}
            >
              <button
                type="button"
                className={cn(navLinkClass, "inline-flex items-center gap-1")}
                aria-expanded={moreOpen}
                onClick={() => setMoreOpen((open) => !open)}
              >
                {t("more")}
                <ChevronDown
                  className={cn(
                    "size-3.5 transition-transform duration-200",
                    moreOpen && "rotate-180",
                  )}
                />
              </button>
              {moreOpen ? (
                <div className="absolute left-0 top-full z-50 pt-3">
                  <div className="min-w-[240px] rounded-2xl border border-white/10 bg-[#0E1422]/98 p-2 shadow-[0_24px_60px_rgba(0,0,0,.45)] backdrop-blur-xl">
                    <p className="px-3 pb-1.5 pt-2 text-[10px] font-semibold tracking-[0.14em] text-[#AEB7C5] uppercase">
                      {t("explore.title")}
                    </p>
                    {moreLinks.map((link) => (
                      <Link
                        key={link.labelKey}
                        href={link.href}
                        className="block rounded-xl px-3 py-2.5 text-sm text-[#AEB7C5] transition-colors hover:bg-white/5 hover:text-[#D4A62A]"
                        onClick={() => setMoreOpen(false)}
                      >
                        {t(link.labelKey)}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          </nav>

          <div className="ml-auto flex shrink-0 items-center gap-2 sm:gap-3">
            <div className="hidden lg:block">
              <RegionSwitcher />
            </div>

            <Link
              href="/favoritos"
              className="relative inline-flex rounded-2xl p-2.5 text-[#AEB7C5] transition-colors duration-300 hover:text-[#D4A62A]"
              aria-label={t("wishlist")}
            >
              <Heart className="size-5" strokeWidth={1.75} />
              {count > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full bg-[#D4A62A] text-[10px] font-bold text-[#070B14]">
                  {count > 9 ? "9+" : count}
                </span>
              )}
            </Link>

            <HeaderAuthActions />

            <Link
              href="/empresa/painel"
              className="rk-btn-gold hidden h-11 items-center justify-center px-5 text-sm xl:inline-flex"
            >
              {t("companyPortal")}
            </Link>

            <button
              type="button"
              className="inline-flex rounded-2xl p-2 text-white xl:hidden"
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
              {productNav.map((link) => (
                <Link
                  key={link.labelKey}
                  href={link.href}
                  className="rounded-2xl px-2 py-2.5 text-sm font-medium text-[#AEB7C5] hover:bg-[#161F31] hover:text-[#D4A62A]"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t(link.labelKey)}
                </Link>
              ))}
              <p className="mt-2 px-2 pt-2 text-[10px] font-semibold tracking-[0.14em] text-[#AEB7C5]/70 uppercase">
                {t("categories")}
              </p>
              {categoryLinks.map((link) => (
                <Link
                  key={link.labelKey}
                  href={link.href}
                  className="rounded-2xl px-2 py-2.5 text-sm font-medium text-[#AEB7C5] hover:bg-[#161F31] hover:text-[#D4A62A]"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t(link.labelKey)}
                </Link>
              ))}
              <p className="mt-2 px-2 pt-2 text-[10px] font-semibold tracking-[0.14em] text-[#AEB7C5]/70 uppercase">
                {t("more")}
              </p>
              {moreLinks.map((link) => (
                <Link
                  key={link.labelKey}
                  href={link.href}
                  className="rounded-2xl px-2 py-2.5 text-sm font-medium text-[#AEB7C5] hover:bg-[#161F31] hover:text-[#D4A62A]"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t(link.labelKey)}
                </Link>
              ))}
            </nav>
            <div className="mt-4 flex flex-col gap-3 border-t border-[rgba(255,255,255,.05)] pt-4">
              <RegionSwitcher />
              <HeaderAuthActions variant="mobile" />
              <Link
                href="/empresa/painel"
                className="rk-btn-gold inline-flex h-12 items-center justify-center px-5 text-sm"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t("companyPortal")}
              </Link>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
