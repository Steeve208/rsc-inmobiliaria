"use client";

import { Bookmark, Check } from "lucide-react";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import { marketplace } from "@/lib/layout/marketplace";
import { VEHICLE_PAGE_SIZE } from "@/lib/listings/listing-page-size";
import type { VeiculosFilters, VeiculosView, VehicleListing } from "../types";
import { VehicleCard } from "./vehicle-card";
import { ViewSwitcher } from "./view-switcher";

const VehicleMap = dynamic(
  () => import("./vehicle-map").then((m) => m.VehicleMap),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-[520px] animate-pulse rounded-xl bg-[#081128]/60" />
    ),
  },
);

type Props = {
  results: VehicleListing[];
  filters: VeiculosFilters;
  view: VeiculosView;
  highlightedId: string | null;
  hasSearched: boolean;
  onViewChange: (view: VeiculosView) => void;
  onHighlight: (id: string | null) => void;
  onSaveSearch?: () => void;
};

export function SplitMapList({
  results,
  view,
  highlightedId,
  hasSearched,
  onViewChange,
  onHighlight,
  onSaveSearch,
}: Props) {
  const t = useTranslations("veiculos.results");
  const [savedFlash, setSavedFlash] = useState(false);
  const [visibleCount, setVisibleCount] = useState(VEHICLE_PAGE_SIZE);

  useEffect(() => {
    setVisibleCount(VEHICLE_PAGE_SIZE);
  }, [results]);

  function handleSave() {
    onSaveSearch?.();
    setSavedFlash(true);
    setTimeout(() => setSavedFlash(false), 2000);
  }

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
            <p className={marketplace.subtitle}>
              {visibleResults.length < results.length
                ? t("showingCount", {
                    visible: visibleResults.length,
                    total: results.length,
                  })
                : t("count", { count: results.length })}
            </p>
          </div>
          <ViewSwitcher view={view} onChange={onViewChange} />
        </div>

        {onSaveSearch ? (
          <div className="mt-4 flex justify-end">
            <button
              type="button"
              onClick={handleSave}
              className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white/75 transition-colors hover:bg-white/[0.08]"
            >
              {savedFlash ? (
                <Check className="size-4 text-emerald-400" />
              ) : (
                <Bookmark className="size-4" />
              )}
              {savedFlash ? t("searchSaved") : t("saveSearch")}
            </button>
          </div>
        ) : null}

        {results.length === 0 ? (
          <div className="rounded-xl bg-[#081128]/40 px-6 py-16 text-center">
            <p className="text-white/70">{t("empty")}</p>
            <p className="mt-2 text-sm text-white/40">{t("emptyHint")}</p>
          </div>
        ) : showGallery ? (
          <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {visibleResults.map((item) => (
              <VehicleCard key={item.id} item={item} variant="gallery" />
            ))}
          </div>
        ) : showSatellite || view === "map" ? (
          <div className="mt-6">
            <VehicleMap
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
                <VehicleCard
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
              <VehicleMap
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
              onClick={() => setVisibleCount((c) => c + VEHICLE_PAGE_SIZE)}
              className="rounded-xl bg-white/10 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-white/15"
            >
              {t("loadMore", { remaining: results.length - visibleCount })}
            </button>
          </div>
        )}

        {view === "list" && results.length > 0 && (
          <div className="mt-4 lg:hidden">
            <VehicleMap
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
