"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { filterListings } from "../mock-listings";
import { useSearchState } from "../hooks/use-search-state";
import type { ListingItem, SearchFilters } from "../types";
import { SearchToolbar } from "./search-toolbar";
import { SearchFiltersPanel } from "./search-filters-panel";
import { ListingCard } from "./listing-card";
import { SearchMapView } from "./search-map-view";

export function AdvancedSearch() {
  const t = useTranslations("search");
  const { filters, view, applyFilters, setView, resetFilters } = useSearchState();
  const [draft, setDraft] = useState<SearchFilters>(filters);
  const [catalog, setCatalog] = useState<ListingItem[]>([]);

  useEffect(() => {
    fetch("/api/listings/search")
      .then((r) => r.json())
      .then(setCatalog)
      .catch(() => setCatalog([]));
  }, []);

  useEffect(() => {
    setDraft(filters);
  }, [filters]);

  const results = useMemo(
    () => filterListings(catalog, filters),
    [catalog, filters],
  );

  const updateDraft = (next: Partial<SearchFilters>) => {
    setDraft((prev) => ({ ...prev, ...next }));
  };

  return (
    <div className="mx-auto max-w-[1440px] px-6 py-8 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white sm:text-3xl">
          {t("pageTitle")}
        </h1>
        <p className="mt-2 text-sm text-white/55">{t("pageSubtitle")}</p>
      </div>

      <SearchToolbar
        filters={draft}
        view={view}
        onFiltersChange={updateDraft}
        onViewChange={setView}
        onSearch={() => applyFilters(draft)}
      />

      <div className="mt-8 grid gap-8 lg:grid-cols-[300px_1fr]">
        <SearchFiltersPanel
          filters={draft}
          onChange={updateDraft}
          onReset={() => {
            resetFilters();
          }}
          onApply={() => applyFilters(draft)}
        />

        <div>
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-white/60">
              {t("results.count", { count: results.length })}
            </p>
          </div>

          {results.length === 0 ? (
            <div className="rounded-xl border border-dashed border-white/15 bg-[#081128]/40 px-6 py-16 text-center">
              <p className="text-white/70">{t("results.empty")}</p>
              <p className="mt-2 text-sm text-white/40">
                {t("results.emptyHint")}
              </p>
            </div>
          ) : view === "list" ? (
            <div className="space-y-4">
              {results.map((item) => (
                <ListingCard key={item.id} item={item} variant="list" />
              ))}
            </div>
          ) : view === "gallery" ? (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {results.map((item) => (
                <ListingCard key={item.id} item={item} variant="gallery" />
              ))}
            </div>
          ) : (
            <SearchMapView items={results} />
          )}
        </div>
      </div>
    </div>
  );
}
