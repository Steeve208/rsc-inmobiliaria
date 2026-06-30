"use client";

import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import { marketplace } from "@/lib/layout/marketplace";
import type { ImoveisFilters, ImoveisView, PropertyListing } from "../types";
import { PropertyCard } from "./property-card";
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
};

export function SplitMapList({
  results,
  view,
  highlightedId,
  hasSearched,
  onViewChange,
  onHighlight,
}: Props) {
  const t = useTranslations("imoveis.results");

  const showGallery = view === "gallery";
  const showSatellite = view === "satellite";

  if (!hasSearched) return null;

  return (
    <section className="market-section">
      <div className="market-container">
        <div className={`${marketplace.headerGap} flex flex-wrap items-center justify-between gap-4`}>
          <div>
            <h2 className={marketplace.title}>{t("title")}</h2>
            <p className={marketplace.subtitle}>{t("count", { count: results.length })}</p>
          </div>
          <ViewSwitcher view={view} onChange={onViewChange} />
        </div>

        {results.length === 0 ? (
          <div className="rounded-xl bg-[#081128]/40 px-6 py-16 text-center">
            <p className="text-white/70">{t("empty")}</p>
            <p className="mt-2 text-sm text-white/40">{t("emptyHint")}</p>
          </div>
        ) : showGallery ? (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {results.map((item) => (
              <PropertyCard key={item.id} item={item} variant="gallery" />
            ))}
          </div>
        ) : showSatellite || view === "map" ? (
          <PropertyMap
            items={results}
            highlightedId={highlightedId}
            onHighlight={onHighlight}
            satellite={showSatellite}
            className="min-h-[600px]"
          />
        ) : (
          <div className="grid gap-5 lg:grid-cols-2">
            <div className="max-h-[640px] space-y-3 overflow-y-auto pr-1">
              {results.map((item) => (
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
