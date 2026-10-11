"use client";

import { useTranslations } from "next-intl";
import {
  Briefcase,
  Building2,
  Car,
  Home,
  Menu,
  Smartphone,
  Tag,
  Users,
  Wrench,
  X,
} from "lucide-react";
import { Logo } from "@/components/layout/logo";
import { GlobalSearch } from "@/components/layout/global-search";
import { RegionSwitcher } from "@/components/layout/region-switcher";
import { LocaleSwitcher } from "@/components/layout/locale-switcher";
import { MarketDetectionBanner } from "@/components/layout/market-detection-banner";
import { Link, usePathname } from "@/lib/i18n/routing";
import { useUiStore } from "@/hooks/use-ui-store";
import { SECONDARY_NAV } from "@/lib/marketplace/catalog";

const navIcons = {
  home: Home,
  properties: Building2,
  vehicles: Car,
  businesses: Briefcase,
  services: Wrench,
  deals: Tag,
  brokers: Users,
} as const;

export function Header() {
  const t = useTranslations("marketplace.header");
  const tNav = useTranslations("nav");
  const { isMobileMenuOpen, setMobileMenuOpen, toggleMobileMenu } =
    useUiStore();
  const pathname = usePathname();

  if (pathname === "/" || pathname === "/destinos" || pathname === "/revistas") return null;

  return (
    <>
      <MarketDetectionBanner />
      <header className="sticky top-0 z-50 pt-[env(safe-area-inset-top)]">
        <div className="bg-[#0B0F19]">
          <div className="rk-container flex h-14 min-w-0 items-center gap-2 sm:gap-3">
            <Logo
              className="min-w-0 shrink gap-2"
              compact
              wordmarkClassName="max-[379px]:hidden"
            />

            <GlobalSearch
              key="desktop-search"
              className="hidden min-w-0 flex-1 md:block"
            />

            <div className="ms-auto flex shrink-0 items-center gap-1 sm:gap-2">
              <LocaleSwitcher key="header-locale" size="lg" />

              <button
                type="button"
                className="inline-flex size-11 items-center justify-center rounded-md text-white lg:hidden"
                onClick={toggleMobileMenu}
                aria-expanded={isMobileMenuOpen}
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

        <nav className="hidden bg-[#111827] lg:block">
          <div className="rk-container flex h-9 items-center gap-5 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {SECONDARY_NAV.map((link) => {
              const Icon = navIcons[link.icon];
              const active =
                (link.labelKey === "home" && pathname === "/") ||
                (link.labelKey === "properties" &&
                  (pathname === "/imoveis" || pathname.startsWith("/imoveis/"))) ||
                (link.labelKey === "vehicles" &&
                  (pathname === "/veiculos" || pathname.startsWith("/veiculos/"))) ||
                (link.labelKey === "businesses" &&
                  (pathname === "/negocios" || pathname.startsWith("/negocios/"))) ||
                (link.labelKey === "services" &&
                  (pathname === "/services" || pathname.startsWith("/services/"))) ||
                (link.labelKey === "brokers" &&
                  (pathname === "/corredores" || pathname.startsWith("/corredores/")));
              return (
                <Link
                  key={link.labelKey}
                  href={link.href}
                  className={
                    active
                      ? "inline-flex shrink-0 items-center gap-1.5 border-b-2 border-[#EBAD5B] text-[13px] font-medium text-[#EBAD5B]"
                      : "inline-flex shrink-0 items-center gap-1.5 text-[13px] font-medium text-white/85 hover:text-[#EBAD5B]"
                  }
                >
                  <Icon className="size-3.5 opacity-80" strokeWidth={1.8} />
                  {link.labelKey === "home"
                    ? tNav("home")
                    : t(`nav.${link.labelKey}`)}
                </Link>
              );
            })}
            <Link
              href="/help"
              className="ms-auto hidden shrink-0 items-center gap-1.5 text-[13px] font-medium text-white/85 hover:text-[#EBAD5B] lg:inline-flex"
            >
              <Smartphone className="size-3.5" strokeWidth={1.8} />
              {t("downloadApp")}
            </Link>
          </div>
        </nav>

        {isMobileMenuOpen ? (
          <div className="max-h-[min(70vh,32rem)] overflow-y-auto border-t border-white/10 bg-[#0B0F19] px-5 py-4 lg:hidden">
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
                    className="inline-flex min-h-11 items-center gap-2 rounded-xl px-2 text-sm font-medium text-[#AEB7C5] hover:bg-[#161F31] hover:text-[#EBAD5B]"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Icon className="size-4" />
                    {link.labelKey === "home"
                      ? tNav("home")
                      : t(`nav.${link.labelKey}`)}
                  </Link>
                );
              })}
            </nav>
          </div>
        ) : null}
      </header>
    </>
  );
}
