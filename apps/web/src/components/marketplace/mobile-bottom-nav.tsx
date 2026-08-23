"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Heart, Home, Search, User, Plus } from "lucide-react";
import { Link, usePathname } from "@/lib/i18n/routing";
import { LIST_ACTIONS } from "@/lib/marketplace/catalog";
import { cn } from "@/lib/utils";

export function MobileBottomNav() {
  const t = useTranslations("marketplace.mobileNav");
  const pathname = usePathname();
  const [listOpen, setListOpen] = useState(false);
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
    pathname.startsWith("/services/");

  return (
    <>
      {listOpen ? (
        <div className="fixed inset-0 z-[60] md:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/40"
            aria-label={t("close")}
            onClick={() => setListOpen(false)}
          />
          <div className="absolute inset-x-0 bottom-16 rounded-t-2xl bg-white p-4 shadow-2xl">
            <p className="mb-3 text-sm font-bold text-[#0B1220]">{t("listTitle")}</p>
            <div className="grid gap-2">
              {LIST_ACTIONS.map((action) => (
                <Link
                  key={action.id}
                  href={action.href}
                  onClick={() => setListOpen(false)}
                  className="rounded-xl border border-[#EDE8DC] px-4 py-3 text-sm font-semibold text-[#0B1220] hover:border-[#D4A62A]"
                >
                  {t(`listActions.${action.id}`)}
                </Link>
              ))}
            </div>
          </div>
        </div>
      ) : null}

      <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-[#E5E7EB] bg-white pb-[env(safe-area-inset-bottom)] md:hidden">
        <div className="grid grid-cols-5 items-end">
          <Link
            href="/"
            className={cn(
              "flex flex-col items-center gap-0.5 py-2 text-[10px] font-semibold",
              isHome ? "text-[#D4A62A]" : "text-[#6B7285]",
            )}
          >
            <Home className="size-5" />
            {t("home")}
          </Link>
          <Link
            href="/imoveis"
            className={cn(
              "flex flex-col items-center gap-0.5 py-2 text-[10px] font-semibold",
              isExplore ? "text-[#D4A62A]" : "text-[#6B7285]",
            )}
          >
            <Search className="size-5" />
            {t("explore")}
          </Link>
          <button
            type="button"
            onClick={() => setListOpen((open) => !open)}
            className="-mt-4 flex flex-col items-center gap-0.5 text-[10px] font-bold text-[#070B14]"
          >
            <span className="inline-flex size-12 items-center justify-center rounded-full bg-[#D4A62A] shadow-lg">
              <Plus className="size-6" />
            </span>
            {t("list")}
          </button>
          <Link
            href="/favoritos"
            className="flex flex-col items-center gap-0.5 py-2 text-[10px] font-semibold text-[#6B7285]"
          >
            <Heart className="size-5" />
            {t("saved")}
          </Link>
          <Link
            href="/dashboard"
            className="flex flex-col items-center gap-0.5 py-2 text-[10px] font-semibold text-[#6B7285]"
          >
            <User className="size-5" />
            {t("account")}
          </Link>
        </div>
      </nav>
    </>
  );
}
