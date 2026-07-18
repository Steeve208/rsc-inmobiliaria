"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/routing";
import { marketplace } from "@/lib/layout/marketplace";
import { cn } from "@/lib/utils";
import { brazilStates, worldRegions } from "@/lib/listings/regions";
import type { RegionItem, VehicleCategory } from "../types";

type Props = {
  onSelectRegion?: (region: RegionItem) => void;
  onCategorySelect?: (type: VehicleCategory | "") => void;
};

export function VeiculosFooter({ onSelectRegion, onCategorySelect }: Props) {
  const t = useTranslations("veiculos.footer");
  const tc = useTranslations("veiculos.categories");
  const tn = useTranslations("nav");
  const year = new Date().getFullYear();

  const categoryLinks = [
    { id: "car", label: tc("car") },
    { id: "suv", label: tc("suv") },
    { id: "electric", label: tc("electric") },
    { id: "hybrid", label: tc("hybrid") },
  ] as const;

  const serviceLinks = [
    { href: "/financing", label: tn("financing") },
    { href: "/services", label: tn("services") },
    { href: "/help", label: tn("help") },
  ] as const;

  const companyLinks = [
    { href: "/para-empresas", label: tn("paraEmpresas") },
    { href: "/veiculos", label: t("vehicles") },
    { href: "/imoveis", label: tn("properties") },
  ] as const;

  return (
    <footer className={cn("bg-[#000810]", marketplace.sectionFooter)}>
      <div className={marketplace.container}>
        <div className="grid gap-10 lg:grid-cols-[1.2fr_2fr] lg:gap-16">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold tracking-tight text-white">
                REESKOVA
              </span>
            </div>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-white/40">
              {t("tagline")}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            <div>
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-white/35">
                {t("vehicles")}
              </p>
              <ul className="space-y-2.5">
                {categoryLinks.map(({ id, label }) => (
                  <li key={id}>
                    {onCategorySelect ? (
                      <button
                        type="button"
                        onClick={() => onCategorySelect(id)}
                        className="text-sm text-white/50 transition-colors hover:text-[#86efac]"
                      >
                        {label}
                      </button>
                    ) : (
                      <Link
                        href={`/veiculos?type=${id}`}
                        className="text-sm text-white/50 transition-colors hover:text-[#86efac]"
                      >
                        {label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-white/35">
                {t("services")}
              </p>
              <ul className="space-y-2.5">
                {serviceLinks.map(({ href, label }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      className="text-sm text-white/50 transition-colors hover:text-[#86efac]"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="col-span-2 sm:col-span-1">
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-white/35">
                {t("company")}
              </p>
              <ul className="space-y-2.5">
                {companyLinks.map(({ href, label }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      className="text-sm text-white/50 transition-colors hover:text-[#86efac]"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-8 rounded-2xl bg-white/[0.02] px-5 py-5 sm:px-6">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-white/35">
            {t("states")}
          </p>
          <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2">
            {brazilStates.map((state) => (
              <button
                key={state.id}
                type="button"
                onClick={() => onSelectRegion?.(state)}
                className="text-sm text-white/45 transition-colors hover:text-[#86efac]"
              >
                {state.name}
              </button>
            ))}
          </div>

          <p className="mt-8 text-[11px] font-semibold uppercase tracking-wider text-white/35">
            {t("countries")}
          </p>
          <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2">
            {worldRegions.map((region) => (
              <button
                key={region.id}
                type="button"
                onClick={() => onSelectRegion?.(region)}
                className="text-sm text-white/45 transition-colors hover:text-[#86efac]"
              >
                {region.flag} {region.name}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 pt-6 text-xs text-white/30 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} Reeskova. {t("rights")}
          </p>
          <div className="flex gap-5">
            <Link href="/privacy" className="transition-colors hover:text-white/60">
              {t("privacy")}
            </Link>
            <Link href="/terms" className="transition-colors hover:text-white/60">
              {t("terms")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
