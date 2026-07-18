"use client";

import { useTranslations } from "next-intl";
import { Heart, Menu, X } from "lucide-react";
import { Logo } from "@/components/layout/logo";
import { RegionSwitcher } from "@/components/layout/region-switcher";
import { MarketDetectionBanner } from "@/components/layout/market-detection-banner";
import { HeaderAuthActions } from "@/features/auth";
import { Link } from "@/lib/i18n/routing";
import { useUiStore } from "@/hooks/use-ui-store";
import { useFavorites } from "@/hooks/use-favorites";

const navLinkClass =
  "text-sm font-medium text-[#C8D0DD] transition-colors duration-300 hover:text-[#D4A62A] whitespace-nowrap";

const landingNav = [
  { href: "/", labelKey: "home" as const },
  { href: "/imoveis", labelKey: "properties" as const },
  { href: "/veiculos", labelKey: "vehicles" as const },
  { href: "/financing", labelKey: "financing" as const },
  { href: "/para-empresas", labelKey: "companies" as const },
] as const;

export function Header() {
  const t = useTranslations("nav");
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
          </nav>

          <div className="ml-auto flex shrink-0 items-center gap-3">
            <div className="hidden sm:block">
              <RegionSwitcher />
            </div>

            <Link
              href="/favoritos"
              className="relative inline-flex rounded-[14px] p-2 text-[#C8D0DD] transition-colors duration-300 hover:text-[#D4A62A]"
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
                  className="rounded-[14px] px-2 py-2.5 text-sm font-medium text-[#C8D0DD] hover:bg-[#161F31] hover:text-[#D4A62A]"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t(link.labelKey)}
                </Link>
              ))}
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
