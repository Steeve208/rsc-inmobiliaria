"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import { marketplace } from "@/lib/layout/marketplace";
import { PROPERTY_PAGE_SIZE } from "@/lib/listings/sort-properties";
import type { ImoveisFilters, ImoveisView, PropertyListing, PropertySort } from "../types";
import { PropertyCard } from "./property-card";
import { ResultsToolbar } from "./results-toolbar";
import { ViewSwitcher } from "./view-switcher";

const PropertyMap = dynamic(
  () => import("./property-map").then((m) => m.PropertyMap),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-[520px] animate-pulse rounded-xl bg-[#081128]/60" />
    ),
  },
);

type Props = {
  results: PropertyListing[];
  filters: ImoveisFilters;
  view: ImoveisView;
  highlightedId: string | null;
  hasSearched: boolean;
  onViewChange: (view: ImoveisView) => void;
  onHighlight: (id: string | null) => void;
  onSortChange: (sort: PropertySort) => void;
  onSaveSearch?: () => void;
};

export function SplitMapList({
  results,
  filters,
  view,
  highlightedId,
  hasSearched,
  onViewChange,
  onHighlight,
  onSortChange,
  onSaveSearch,
}: Props) {
  const t = useTranslations("imoveis.results");
  const [visibleCount, setVisibleCount] = useState(PROPERTY_PAGE_SIZE);

  useEffect(() => {
    setVisibleCount(PROPERTY_PAGE_SIZE);
  }, [results, filters.sort]);

  const showGallery = view === "gallery";
  const showSatellite = view === "satellite";
  const visibleResults = results.slice(0, visibleCount);
  const hasMore = visibleCount < results.length;

  if (!hasSearched) return null;

  return (
    <section className="market-section">
      <div className="market-container">
        <div className={`${marketplace.headerGap} flex flex-wrap items-center justify-between gap-4`}>
          <div>
            <h2 className={marketplace.title}>{t("title")}</h2>
          </div>
          <ViewSwitcher view={view} onChange={onViewChange} />
        </div>

        <ResultsToolbar
          sort={filters.sort}
          totalCount={results.length}
          visibleCount={visibleResults.length}
          onSortChange={onSortChange}
          onSaveSearch={onSaveSearch}
        />

        {results.length === 0 ? (
          <div className="mt-6 rounded-xl bg-[#081128]/40 px-6 py-16 text-center">
            <p className="text-white/70">{t("empty")}</p>
            <p className="mt-2 text-sm text-white/40">{t("emptyHint")}</p>
          </div>
        ) : showGallery ? (
          <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {visibleResults.map((item) => (
              <PropertyCard key={item.id} item={item} variant="gallery" />
            ))}
          </div>
        ) : showSatellite || view === "map" ? (
          <div className="mt-6">
            <PropertyMap
              items={results}
              highlightedId={highlightedId}
              onHighlight={onHighlight}
              satellite={showSatellite}
              className="min-h-[600px]"
            />
          </div>
        ) : (
          <div className="mt-6 grid gap-5 lg:grid-cols-2">
            <div className="max-h-[640px] space-y-3 overflow-y-auto pr-1">
              {visibleResults.map((item) => (
                <PropertyCard
                  key={item.id}
                  item={item}
                  variant="compact"
                  highlighted={highlightedId === item.id}
                  onHover={() => onHighlight(item.id)}
                  onLeave={() => onHighlight(null)}
                />
              ))}
            </div>
            <div className="sticky top-24 hidden lg:block">
              <PropertyMap
                items={results}
                highlightedId={highlightedId}
                onHighlight={onHighlight}
                className="min-h-[640px]"
              />
            </div>
          </div>
        )}

        {hasMore && view !== "map" && view !== "satellite" && (
          <div className="mt-8 text-center">
            <button
              type="button"
              onClick={() => setVisibleCount((c) => c + PROPERTY_PAGE_SIZE)}
              className="rounded-xl bg-white/10 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-white/15"
            >
              {t("loadMore", { remaining: results.length - visibleCount })}
            </button>
          </div>
        )}

        {view === "list" && results.length > 0 && (
          <div className="mt-4 lg:hidden">
            <PropertyMap
              items={results}
              highlightedId={highlightedId}
              onHighlight={onHighlight}
              className="min-h-[360px]"
            />
          </div>
        )}
      </div>
    </section>
  );
}
