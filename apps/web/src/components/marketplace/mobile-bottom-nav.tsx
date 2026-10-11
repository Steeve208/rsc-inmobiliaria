"use client";

import { useTranslations } from "next-intl";
import { Home, Search } from "lucide-react";
import { Link, usePathname } from "@/lib/i18n/routing";
import { cn } from "@/lib/utils";

export function MobileBottomNav() {
  const t = useTranslations("marketplace.mobileNav");
  const pathname = usePathname();
  const isHome = pathname === "/";
  const isExplore =
    pathname === "/imoveis" ||
    pathname.startsWith("/imoveis/") ||
    pathname === "/veiculos" ||
    pathname.startsWith("/veiculos/") ||
    pathname === "/projetos" ||
    pathname.startsWith("/projetos/") ||
    pathname === "/negocios" ||
    pathname.startsWith("/negocios/") ||
    pathname === "/services" ||
    pathname.startsWith("/services/") ||
    pathname === "/corredores" ||
    pathname.startsWith("/corredores/") ||
    pathname === "/match" ||
    pathname.startsWith("/match/");
  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-[#E5E7EB] bg-white pb-[env(safe-area-inset-bottom)] md:hidden">
      <div className="grid h-[var(--rk-bottom-nav)] grid-cols-2">
        <Link
          href="/"
          className={cn(
            "flex flex-col items-center justify-center gap-0.5 text-[11px] font-semibold",
            isHome ? "text-[#D49A3F]" : "text-[#6B7285]",
          )}
        >
          <Home className="size-5" />
          {t("home")}
        </Link>
        <Link
          href="/imoveis"
          className={cn(
            "flex flex-col items-center justify-center gap-0.5 text-[11px] font-semibold",
            isExplore ? "text-[#D49A3F]" : "text-[#6B7285]",
          )}
        >
          <Search className="size-5" />
          {t("explore")}
        </Link>
      </div>
    </nav>
  );
}
