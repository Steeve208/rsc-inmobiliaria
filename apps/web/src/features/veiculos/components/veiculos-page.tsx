"use client";

import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/lib/i18n/routing";
import {
  hasVeiculosSearchParams,
  parseVeiculosSearchParams,
  veiculosFiltersToParams,
} from "@/lib/veiculos/search-params";
import { SearchHeader } from "./search-header";
import { CategoriesBar } from "./categories-bar";
import { FeaturedSection } from "./featured-section";
import { SplitMapList } from "./split-map-list";
import { PremiumDealersSection } from "./premium-dealers-section";
import { ListingCarousel } from "./listing-carousel";
import { VeiculosFooter } from "./veiculos-footer";
import { useVeiculosState } from "../hooks/use-veiculos-state";
import { useSavedVehicleSearches } from "@/hooks/use-saved-vehicle-searches";
import type { VehicleCategory, VehicleListing } from "../types";

export function VeiculosPage() {
  const t = useTranslations("veiculos");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
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
    initFromUrl,
    selectRegionFromFooter,
  } = useVeiculosState();
  const { saveSearch } = useSavedVehicleSearches();

  const [premium, setPremium] = useState<VehicleListing[]>([]);
  const [recommended, setRecommended] = useState<VehicleListing[]>([]);

  const syncUrl = useCallback(
    (next: typeof filters, nextView = view) => {
      const params = veiculosFiltersToParams(next, nextView);
      const qs = params.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname);
    },
    [router, pathname, view],
  );

  const applySearch = useCallback(
    (next: typeof filters) => {
      applySearchState(next);
      syncUrl(next);
    },
    [applySearchState, syncUrl],
  );

  useEffect(() => {
    Promise.all([
      fetch("/api/listings/vehicles?section=premium").then((r) => r.json()),
      fetch("/api/listings/vehicles?section=recommended").then((r) => r.json()),
    ]).then(([p, r]) => {
      setPremium(p);
      setRecommended(r);
    });
  }, []);

  useEffect(() => {
    if (!hasVeiculosSearchParams(searchParams)) return;

    const { filters: fromUrl, searched } = parseVeiculosSearchParams(searchParams);
    initFromUrl(fromUrl, searched);
  }, [searchParams, initFromUrl]);

  const handleReset = useCallback(() => {
    resetFilters();
    router.replace(pathname);
  }, [resetFilters, router, pathname]);

  const handleCategorySelect = useCallback(
    (type: VehicleCategory | "") => {
      const next = { ...filters, type };
      updateFilters({ type });
      applySearch(next);
    },
    [filters, updateFilters, applySearch],
  );

  const handleSaveSearch = useCallback(() => {
    saveSearch(filters);
  }, [saveSearch, filters]);

  return (
    <>
      <div className="relative isolate overflow-hidden">
        <div className="pointer-events-none absolute inset-x-0 top-[-180px] h-[380px] bg-[radial-gradient(circle_at_top,rgba(34,197,94,0.18),transparent_65%)]" />
        <div className="pointer-events-none absolute right-[-160px] top-[340px] h-[360px] w-[360px] rounded-full bg-[#22c55e]/10 blur-3xl" />

        <SearchHeader
          filters={filters}
          showTags={hasSearched}
          onChange={updateFilters}
          onSearch={applySearch}
          onReset={handleReset}
        />

        <CategoriesBar
          activeType={filters.type}
          onSelect={handleCategorySelect}
        />

        <FeaturedSection />

        <SplitMapList
          results={results}
          filters={filters}
          view={view}
          highlightedId={highlightedId}
          hasSearched={hasSearched}
          onViewChange={setView}
          onHighlight={setHighlightedId}
          onSaveSearch={hasSearched ? handleSaveSearch : undefined}
        />

        <PremiumDealersSection />

        <ListingCarousel
          title={t("sections.premium")}
          items={premium}
          badge={t("sections.premiumBadge")}
        />

        <ListingCarousel
          title={t("sections.recommended")}
          subtitle={t("sections.recommendedSubtitle")}
          items={recommended}
          badge={t("sections.aiBadge")}
        />
      </div>

      <VeiculosFooter
        onSelectRegion={(region) => {
          const next = selectRegionFromFooter(region);
          if (!next) return;
          applySearch(next);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        onCategorySelect={handleCategorySelect}
      />
    </>
  );
}
