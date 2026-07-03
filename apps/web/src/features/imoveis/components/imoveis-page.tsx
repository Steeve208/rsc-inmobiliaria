"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/lib/i18n/routing";
import { useSavedPropertySearches } from "@/hooks/use-saved-property-searches";
import {
  hasImoveisSearchParams,
  imoveisFiltersToParams,
  parseImoveisSearchParams,
} from "@/lib/imoveis/search-params";
import { SearchHeader } from "./search-header";
import { SearchPromptSection } from "./search-prompt-section";
import { CategoriesBar } from "./categories-bar";
import { SplitMapList } from "./split-map-list";
import { ListingCarousel } from "./listing-carousel";
import { ImoveisFooter } from "./imoveis-footer";
import { useImoveisState } from "../hooks/use-imoveis-state";
import type { ImoveisFilters, PropertyListing, PropertySort } from "../types";

export function ImoveisPage() {
  const t = useTranslations("imoveis");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const appliedFromUrl = useRef(false);
  const { saveSearch } = useSavedPropertySearches();

  const {
    filters,
    view,
    highlightedId,
    hasSearched,
    results,
    setView,
    setHighlightedId,
    updateFilters,
    resetFilters,
    applySearch: applySearchState,
    selectRegionFromFooter,
    initFromUrl,
  } = useImoveisState();

  const [premium, setPremium] = useState<PropertyListing[]>([]);
  const [recommended, setRecommended] = useState<PropertyListing[]>([]);
  const [launches, setLaunches] = useState<PropertyListing[]>([]);

  const syncUrl = useCallback(
    (next: ImoveisFilters, nextView = view) => {
      const params = imoveisFiltersToParams(next, nextView);
      const qs = params.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname);
    },
    [router, pathname, view],
  );

  const applySearch = useCallback(
    (next: ImoveisFilters) => {
      applySearchState(next);
      syncUrl(next);
    },
    [applySearchState, syncUrl],
  );

  useEffect(() => {
    Promise.all([
      fetch("/api/listings/properties?section=premium").then((r) => r.json()),
      fetch("/api/listings/properties?section=recommended").then((r) => r.json()),
      fetch("/api/listings/properties?section=launch").then((r) => r.json()),
    ]).then(([p, r, l]) => {
      setPremium(p);
      setRecommended(r);
      setLaunches(l);
    });
  }, []);

  useEffect(() => {
    if (appliedFromUrl.current || !hasImoveisSearchParams(searchParams)) return;
    appliedFromUrl.current = true;

    const { filters: fromUrl, view: urlView, searched } = parseImoveisSearchParams(
      searchParams,
    );
    initFromUrl(fromUrl, urlView, searched);
  }, [searchParams, initFromUrl]);

  const handleViewChange = useCallback(
    (nextView: typeof view) => {
      setView(nextView);
      if (hasSearched) syncUrl(filters, nextView);
    },
    [setView, hasSearched, syncUrl, filters],
  );

  const handleFilterChange = useCallback(
    (patch: Partial<ImoveisFilters>) => {
      const next = { ...filters, ...patch };
      updateFilters(patch);
      if (hasSearched) syncUrl(next);
    },
    [filters, updateFilters, hasSearched, syncUrl],
  );

  const handleSortChange = useCallback(
    (sort: PropertySort) => {
      const next = { ...filters, sort };
      updateFilters({ sort });
      if (hasSearched) syncUrl(next);
    },
    [filters, updateFilters, hasSearched, syncUrl],
  );

  const handleSaveSearch = useCallback(() => {
    saveSearch(filters);
  }, [saveSearch, filters]);

  const handleTransactionChange = useCallback(
    (transaction: ImoveisFilters["transaction"]) => {
      const next = { ...filters, transaction };
      updateFilters({ transaction });
      applySearch(next);
    },
    [filters, updateFilters, applySearch],
  );

  const handleCategorySelect = useCallback(
    (selection: { type: string; launchOnly: boolean }) => {
      const next = {
        ...filters,
        type: selection.type,
        launchOnly: selection.launchOnly,
      };
      updateFilters({ type: selection.type, launchOnly: selection.launchOnly });
      applySearch(next);
    },
    [filters, updateFilters, applySearch],
  );

  const handleReset = useCallback(() => {
    resetFilters();
    router.replace(pathname);
  }, [resetFilters, router, pathname]);

  return (
    <>
      <div className="relative isolate overflow-hidden">
        <div className="pointer-events-none absolute inset-x-0 top-[-180px] h-[380px] bg-[radial-gradient(circle_at_top,rgba(29,78,216,0.18),transparent_65%)]" />
        <div className="pointer-events-none absolute right-[-160px] top-[340px] h-[360px] w-[360px] rounded-full bg-[#1d4ed8]/10 blur-3xl" />

        <SearchHeader
          filters={filters}
          showTags={hasSearched}
          onChange={handleFilterChange}
          onSearch={applySearch}
          onReset={handleReset}
          onTransactionChange={handleTransactionChange}
        />

        <CategoriesBar
          activeType={filters.type}
          launchOnly={filters.launchOnly}
          onSelect={handleCategorySelect}
        />

        {!hasSearched && <SearchPromptSection />}

        <ListingCarousel
          title={t("sections.premium")}
          items={premium}
          badge={t("sections.premiumBadge")}
        />

        <ListingCarousel
          title={t("sections.recommended")}
          subtitle={t("sections.recommendedSubtitle")}
          items={recommended}
          badge={t("sections.verifiedBadge")}
        />

        <SplitMapList
          results={results}
          filters={filters}
          view={view}
          highlightedId={highlightedId}
          hasSearched={hasSearched}
          onViewChange={handleViewChange}
          onHighlight={setHighlightedId}
          onSortChange={handleSortChange}
          onSaveSearch={hasSearched ? handleSaveSearch : undefined}
        />

        <ListingCarousel
          title={t("sections.launches")}
          subtitle={t("sections.launchesSubtitle")}
          items={launches}
          badge={t("sections.new")}
        />
      </div>

      <ImoveisFooter
        onSelectRegion={(region) => {
          const next = selectRegionFromFooter(region);
          if (next) syncUrl(next);
        }}
      />
    </>
  );
}
