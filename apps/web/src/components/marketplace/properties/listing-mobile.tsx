"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { ArrowLeft, ChevronDown, Map as MapIcon, SlidersHorizontal, X } from "lucide-react";
import { useTranslations } from "next-intl";
import type { ImoveisFilters, PropertyListing, PropertySort } from "@/features/imoveis/types";
import { ListingFilters } from "./listing-filters";
import { ListingPropertyCard } from "./listing-card";
import { cn } from "@/lib/utils";

const PropertyMap = dynamic(
  () =>
    import("@/features/imoveis/components/property-map").then((mod) => mod.PropertyMap),
  {
    ssr: false,
    loading: () => <div className="h-full animate-pulse bg-[#E5E7EB]" />,
  },
);

type Props = {
  filters: ImoveisFilters;
  catalog: PropertyListing[];
  results: PropertyListing[];
  highlightedId: string | null;
  resultCount: number;
  mapOpen: boolean;
  filtersOpen: boolean;
  onChange: (patch: Partial<ImoveisFilters>) => void;
  onReset: () => void;
  onHighlight: (id: string | null) => void;
  onOpenFilters: () => void;
  onCloseFilters: () => void;
  onOpenMap: () => void;
  onCloseMap: () => void;
};

const SORTS: PropertySort[] = [
  "newest",
  "relevance",
  "price_asc",
  "price_desc",
  "area_desc",
];

export function ListingMobileBar({
  filters,
  resultCount,
  onChange,
  onOpenFilters,
  onOpenMap,
}: Pick<
  Props,
  "filters" | "resultCount" | "onChange" | "onOpenFilters" | "onOpenMap"
>) {
  const t = useTranslations("marketplace.listing");
  const [sortOpen, setSortOpen] = useState(false);

  return (
    <div className="space-y-3 lg:hidden">
      <div className="grid grid-cols-3 gap-2">
        <button
          type="button"
          onClick={onOpenFilters}
          className="inline-flex h-10 items-center justify-center gap-1.5 rounded-full bg-white text-sm font-semibold text-[#0B1220] ring-1 ring-[#E5E7EB]"
        >
          <SlidersHorizontal className="size-4" />
          {t("filters")}
        </button>
        <button
          type="button"
          onClick={onOpenMap}
          className="inline-flex h-10 items-center justify-center gap-1.5 rounded-full bg-white text-sm font-semibold text-[#0B1220] ring-1 ring-[#E5E7EB]"
        >
          <MapIcon className="size-4" />
          {t("views.map")}
        </button>
        <div className="relative">
          <button
            type="button"
            onClick={() => setSortOpen((open) => !open)}
            className="inline-flex h-10 w-full items-center justify-center gap-1.5 rounded-full bg-white text-sm font-semibold text-[#0B1220] ring-1 ring-[#E5E7EB]"
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
                    filters.sort === sort
                      ? "font-semibold text-[#0B1220]"
                      : "text-[#4B5563]",
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
        {(
          [
            ["", "all"],
            ["buy", "sale"],
            ["rent", "rent"],
          ] as const
        ).map(([value, key]) => (
          <button
            key={key}
            type="button"
            onClick={() => onChange({ transaction: value })}
            className={cn(
              "shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold",
              filters.transaction === value
                ? "bg-[#0B1220] text-white"
                : "bg-white text-[#4B5563] ring-1 ring-[#E5E7EB]",
            )}
          >
            {t(`statusOptions.${key}`)}
          </button>
        ))}
        <button
          type="button"
          onClick={() => onChange({ verifiedOnly: !filters.verifiedOnly })}
          className={cn(
            "shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold",
            filters.verifiedOnly
              ? "bg-[#0B1220] text-white"
              : "bg-white text-[#4B5563] ring-1 ring-[#E5E7EB]",
          )}
        >
          {t("pills.verified")}
        </button>
        <button
          type="button"
          onClick={() => onChange({ withPhotos: !filters.withPhotos })}
          className={cn(
            "shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold",
            filters.withPhotos
              ? "bg-[#0B1220] text-white"
              : "bg-white text-[#4B5563] ring-1 ring-[#E5E7EB]",
          )}
        >
          {t("pills.photos")}
        </button>
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
}: Pick<
  Props,
  "filters" | "catalog" | "resultCount" | "onChange" | "onReset"
> & { onClose: () => void }) {
  const t = useTranslations("marketplace.listing");

  return (
    <div className="fixed inset-0 z-[70] flex flex-col bg-white lg:hidden">
      <div className="flex items-center justify-between border-b border-[#EFECE4] px-4 py-3">
        <button type="button" onClick={onClose} aria-label={t("close")}>
          <X className="size-5 text-[#0B1220]" />
        </button>
        <h2 className="text-base font-bold text-[#0B1220]">{t("filters")}</h2>
        <button
          type="button"
          onClick={onReset}
          className="text-sm font-semibold text-[#E8A84A]"
        >
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
  onHighlight,
  onClose,
  onChange,
  filters,
}: Pick<
  Props,
  "results" | "highlightedId" | "onHighlight" | "onChange" | "filters"
> & { onClose: () => void }) {
  const t = useTranslations("marketplace.listing");

  return (
    <div className="fixed inset-0 z-[70] bg-[#F4F4F5] lg:hidden">
      <div className="absolute inset-x-0 top-0 z-10 flex items-center justify-between bg-white px-4 py-3 shadow-sm">
        <button type="button" onClick={onClose} aria-label={t("back")}>
          <ArrowLeft className="size-5 text-[#0B1220]" />
        </button>
        <h2 className="text-base font-bold text-[#0B1220]">{t("views.map")}</h2>
        <button
          type="button"
          onClick={onClose}
          className="text-sm font-semibold text-[#E8A84A]"
        >
          {t("views.list")}
        </button>
      </div>
      <PropertyMap
        items={results}
        highlightedId={highlightedId}
        onHighlight={onHighlight}
        theme="light"
        pricePins
        className="h-full min-h-screen"
      />
      <div className="absolute inset-x-0 bottom-0 max-h-[46vh] overflow-y-auto rounded-t-2xl bg-white px-4 pb-6 pt-3 shadow-[0_-8px_30px_rgba(15,23,42,.12)]">
        <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-[#E5E7EB]" />
        <div className="mb-3 flex items-center justify-between gap-2">
          <p className="text-sm font-bold text-[#0B1220]">
            {t("count", { count: results.length })}
          </p>
          <select
            value={filters.sort}
            onChange={(event) =>
              onChange({ sort: event.target.value as PropertySort })
            }
            className="rounded-md bg-[#F3F4F6] px-2 py-1 text-xs font-semibold text-[#0B1220]"
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
            <ListingPropertyCard
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
