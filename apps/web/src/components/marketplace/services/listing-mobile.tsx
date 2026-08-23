"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { ArrowLeft, ChevronDown, Map as MapIcon, SlidersHorizontal, X } from "lucide-react";
import { useTranslations } from "next-intl";
import type { ServiceListing, ServiceSort, ServicesFilters } from "@/features/services/types";
import { ListingFilters } from "./listing-filters";
import { ListingServiceCard } from "./listing-card";
import { POPULAR_SERVICE_TYPES } from "./listing-utils";
import { cn } from "@/lib/utils";

const ServiceMap = dynamic(
  () =>
    import("@/features/services/components/service-map").then((mod) => mod.ServiceMap),
  { ssr: false, loading: () => <div className="h-full animate-pulse bg-[#E5E7EB]" /> },
);

const SORTS: ServiceSort[] = ["recommended", "newest", "price_asc"];

export function ListingMobileBar({
  filters,
  resultCount,
  onChange,
  onOpenFilters,
  onOpenMap,
}: {
  filters: ServicesFilters;
  resultCount: number;
  onChange: (patch: Partial<ServicesFilters>) => void;
  onOpenFilters: () => void;
  onOpenMap: () => void;
}) {
  const t = useTranslations("marketplace.services");
  const [sortOpen, setSortOpen] = useState(false);

  return (
    <div className="space-y-3 lg:hidden">
      <div className="grid grid-cols-3 gap-2">
        <button
          type="button"
          onClick={onOpenFilters}
          className="inline-flex h-10 items-center justify-center gap-1.5 rounded-full bg-white text-sm font-semibold ring-1 ring-[#E5E7EB]"
        >
          <SlidersHorizontal className="size-4" />
          {t("filters")}
        </button>
        <button
          type="button"
          onClick={onOpenMap}
          className="inline-flex h-10 items-center justify-center gap-1.5 rounded-full bg-white text-sm font-semibold ring-1 ring-[#E5E7EB]"
        >
          <MapIcon className="size-4" />
          {t("views.map")}
        </button>
        <div className="relative">
          <button
            type="button"
            onClick={() => setSortOpen((open) => !open)}
            className="inline-flex h-10 w-full items-center justify-center gap-1.5 rounded-full bg-white text-sm font-semibold ring-1 ring-[#E5E7EB]"
          >
            {t("sortLabel")}
            <ChevronDown className="size-4" />
          </button>
          {sortOpen ? (
            <div className="absolute right-0 top-full z-30 mt-1 w-44 rounded-lg bg-white py-1 shadow-lg ring-1 ring-black/5">
              {SORTS.map((sort) => (
                <button
                  key={sort}
                  type="button"
                  onClick={() => {
                    onChange({ sort });
                    setSortOpen(false);
                  }}
                  className={cn(
                    "block w-full px-3 py-2 text-left text-sm",
                    filters.sort === sort ? "font-semibold" : "text-[#4B5563]",
                  )}
                >
                  {t(`sort.${sort}`)}
                </button>
              ))}
            </div>
          ) : null}
        </div>
      </div>
      <div className="flex gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <button
          type="button"
          onClick={() => onChange({ type: "", cycle: "" })}
          className={cn(
            "shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold",
            !filters.type ? "bg-[#0B1220] text-white" : "bg-white text-[#4B5563] ring-1 ring-[#E5E7EB]",
          )}
        >
          {t("types.all")}
        </button>
        {POPULAR_SERVICE_TYPES.map((type) => (
          <button
            key={type}
            type="button"
            onClick={() => onChange({ type, cycle: "" })}
            className={cn(
              "shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold",
              filters.type === type
                ? "bg-[#0B1220] text-white"
                : "bg-white text-[#4B5563] ring-1 ring-[#E5E7EB]",
            )}
          >
            {t(`types.${type}`)}
          </button>
        ))}
      </div>
      <p className="sr-only">{resultCount}</p>
    </div>
  );
}

export function ListingMobileFilters({
  filters,
  catalog,
  resultCount,
  onChange,
  onReset,
  onClose,
}: {
  filters: ServicesFilters;
  catalog: ServiceListing[];
  resultCount: number;
  onChange: (patch: Partial<ServicesFilters>) => void;
  onReset: () => void;
  onClose: () => void;
}) {
  const t = useTranslations("marketplace.services");
  return (
    <div className="fixed inset-0 z-[70] flex flex-col bg-white lg:hidden">
      <div className="flex items-center justify-between border-b border-[#EFECE4] px-4 py-3">
        <button type="button" onClick={onClose} aria-label={t("close")}>
          <X className="size-5" />
        </button>
        <h2 className="text-base font-bold">{t("filters")}</h2>
        <button type="button" onClick={onReset} className="text-sm font-semibold text-[#E8A84A]">
          {t("reset")}
        </button>
      </div>
      <div className="flex-1 overflow-y-auto px-4">
        <ListingFilters filters={filters} catalog={catalog} onChange={onChange} />
      </div>
      <div className="border-t border-[#EFECE4] p-4">
        <button
          type="button"
          onClick={onClose}
          className="flex h-12 w-full items-center justify-center rounded-xl bg-[#E8A84A] text-sm font-bold text-[#070B14]"
        >
          {t("showResults", { count: resultCount })}
        </button>
      </div>
    </div>
  );
}

export function ListingMobileMap({
  results,
  highlightedId,
  filters,
  onHighlight,
  onChange,
  onClose,
}: {
  results: ServiceListing[];
  highlightedId: string | null;
  filters: ServicesFilters;
  onHighlight: (id: string | null) => void;
  onChange: (patch: Partial<ServicesFilters>) => void;
  onClose: () => void;
}) {
  const t = useTranslations("marketplace.services");
  return (
    <div className="fixed inset-0 z-[70] bg-[#F4F4F5] lg:hidden">
      <div className="absolute inset-x-0 top-0 z-10 flex items-center justify-between bg-white px-4 py-3 shadow-sm">
        <button type="button" onClick={onClose} aria-label={t("back")}>
          <ArrowLeft className="size-5" />
        </button>
        <h2 className="text-base font-bold">{t("views.map")}</h2>
        <button type="button" onClick={onClose} className="text-sm font-semibold text-[#E8A84A]">
          {t("views.list")}
        </button>
      </div>
      <ServiceMap
        items={results}
        highlightedId={highlightedId}
        onHighlight={onHighlight}
        theme="light"
        pricePins
        className="h-full min-h-screen"
      />
      <div className="absolute inset-x-0 bottom-0 max-h-[46vh] overflow-y-auto rounded-t-2xl bg-white px-4 pb-6 pt-3 shadow-[0_-8px_30px_rgba(15,23,42,.12)]">
        <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-[#E5E7EB]" />
        <div className="mb-3 flex items-center justify-between">
          <p className="text-sm font-bold">{t("count", { count: results.length })}</p>
          <select
            value={filters.sort}
            onChange={(event) => onChange({ sort: event.target.value as ServiceSort })}
            className="rounded-md bg-[#F3F4F6] px-2 py-1 text-xs font-semibold"
          >
            {SORTS.map((sort) => (
              <option key={sort} value={sort}>
                {t(`sort.${sort}`)}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          {results.slice(0, 8).map((item) => (
            <ListingServiceCard
              key={item.id}
              item={item}
              variant="compact"
              highlighted={highlightedId === item.id}
              onHover={() => onHighlight(item.id)}
              onLeave={() => onHighlight(null)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
