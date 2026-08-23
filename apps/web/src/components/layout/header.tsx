"use client";

import { useTranslations } from "next-intl";
import {
  Briefcase,
  Building2,
  Car,
  Clock,
  Crown,
  Heart,
  Menu,
  ShoppingCart,
  Smartphone,
  Sparkles,
  Tag,
  Wrench,
  X,
} from "lucide-react";
import { Logo } from "@/components/layout/logo";
import { GlobalSearch } from "@/components/layout/global-search";
import { RegionSwitcher } from "@/components/layout/region-switcher";
import { LocaleSwitcher } from "@/components/layout/locale-switcher";
import { MarketDetectionBanner } from "@/components/layout/market-detection-banner";
import { HeaderAuthActions } from "@/features/auth";
import { Link, usePathname } from "@/lib/i18n/routing";
import { useUiStore } from "@/hooks/use-ui-store";
import { useFavorites } from "@/hooks/use-favorites";
import { SECONDARY_NAV } from "@/lib/marketplace/catalog";

const navIcons = {
  properties: Building2,
  vehicles: Car,
  projects: Sparkles,
  businesses: Briefcase,
  services: Wrench,
  deals: Tag,
  newListings: Clock,
  premium: Crown,
} as const;

export function Header() {
  const t = useTranslations("marketplace.header");
  const tNav = useTranslations("nav");
  const { count, isLoggedIn } = useFavorites();
  const { isMobileMenuOpen, setMobileMenuOpen, toggleMobileMenu } =
    useUiStore();
  const pathname = usePathname();

  return (
    <>
      <MarketDetectionBanner />
      <header className="sticky top-0 z-50">
        <div className="bg-[#0B0F19]">
          <div className="rk-container flex h-16 items-center gap-3">
            <Logo className="shrink-0" compact />

            <GlobalSearch
              key="desktop-search"
              className="hidden min-w-0 flex-1 md:block"
            />

            <div className="ms-auto flex shrink-0 items-center gap-1 sm:gap-2">
              <LocaleSwitcher key="header-locale" />

              <Link
                href={isLoggedIn ? "/dashboard" : "/favoritos"}
                className="relative inline-flex items-center gap-1.5 rounded-md px-2 py-1.5 text-xs font-semibold text-white/90 hover:text-[#E8A84A]"
              >
                <Heart className="size-4" />
                <span className="hidden lg:inline">{t("saved")}</span>
                {count > 0 ? (
                  <span className="absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full bg-[#E8A84A] text-[10px] font-bold text-[#070B14]">
                    {count > 9 ? "9+" : count}
                  </span>
                ) : null}
              </Link>

              <HeaderAuthActions variant="compact" />

              <Link
                href="/para-empresas"
                className="hidden h-9 items-center rounded-md bg-[#E8A84A] px-3.5 text-xs font-bold text-[#070B14] hover:bg-[#F0B85A] lg:inline-flex"
              >
                {t("listCta")}
              </Link>

              <Link
                href="/favoritos"
                className="hidden size-9 items-center justify-center rounded-md text-white/90 hover:text-[#E8A84A] lg:inline-flex"
                aria-label={t("cart")}
              >
                <ShoppingCart className="size-5" />
              </Link>

              <button
                type="button"
                className="inline-flex rounded-md p-2 text-white xl:hidden"
                onClick={toggleMobileMenu}
                aria-label={tNav("toggleMenu")}
              >
                {isMobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
              </button>
            </div>
          </div>

          <div className="rk-container pb-3 md:hidden">
            <GlobalSearch key="mobile-search" />
          </div>
        </div>

        <nav className="bg-[#111827]">
          <div className="rk-container flex h-11 items-center gap-5 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {SECONDARY_NAV.map((link) => {
              const Icon = navIcons[link.icon];
              const active =
                (link.labelKey === "properties" &&
                  (pathname === "/imoveis" || pathname.startsWith("/imoveis/"))) ||
                (link.labelKey === "vehicles" &&
                  (pathname === "/veiculos" || pathname.startsWith("/veiculos/"))) ||
                (link.labelKey === "projects" &&
                  (pathname === "/projetos" || pathname.startsWith("/projetos/"))) ||
                (link.labelKey === "businesses" &&
                  (pathname === "/negocios" || pathname.startsWith("/negocios/"))) ||
                (link.labelKey === "services" &&
                  (pathname === "/services" || pathname.startsWith("/services/")));
              return (
                <Link
                  key={link.labelKey}
                  href={link.href}
                  className={
                    active
                      ? "inline-flex shrink-0 items-center gap-1.5 border-b-2 border-[#E8A84A] text-[13px] font-medium text-[#E8A84A]"
                      : "inline-flex shrink-0 items-center gap-1.5 text-[13px] font-medium text-white/85 hover:text-[#E8A84A]"
                  }
                >
                  <Icon className="size-3.5 opacity-80" strokeWidth={1.8} />
                  {t(`nav.${link.labelKey}`)}
                </Link>
              );
            })}
            <Link
              href="/help"
              className="ms-auto hidden shrink-0 items-center gap-1.5 text-[13px] font-medium text-white/85 hover:text-[#E8A84A] lg:inline-flex"
            >
              <Smartphone className="size-3.5" strokeWidth={1.8} />
              {t("downloadApp")}
            </Link>
          </div>
        </nav>

        {isMobileMenuOpen ? (
          <div className="border-t border-white/10 bg-[#0B0F19] px-5 py-4 xl:hidden">
            <div className="mb-4 flex flex-col gap-3 border-b border-white/10 pb-4">
              <RegionSwitcher key="mobile-region" />
              <LocaleSwitcher key="mobile-locale" />
            </div>
            <nav className="flex flex-col gap-1">
              {SECONDARY_NAV.map((link) => {
                const Icon = navIcons[link.icon];
                return (
                  <Link
                    key={link.labelKey}
                    href={link.href}
                    className="inline-flex items-center gap-2 rounded-xl px-2 py-2.5 text-sm font-medium text-[#AEB7C5] hover:bg-[#161F31] hover:text-[#E8A84A]"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Icon className="size-4" />
                    {t(`nav.${link.labelKey}`)}
                  </Link>
                );
              })}
            </nav>
            <div className="mt-4 flex flex-col gap-3 border-t border-white/10 pt-4">
              <Link
                href="/para-empresas"
                className="inline-flex h-12 items-center justify-center rounded-2xl bg-[#E8A84A] text-sm font-bold text-[#070B14]"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t("listCta")}
              </Link>
              <HeaderAuthActions variant="mobile" />
            </div>
          </div>
        ) : null}
      </header>
    </>
  );
}
