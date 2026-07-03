"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  hasLocationSearchParams,
  parseLocationSearchParams,
} from "@/lib/geocoding/url-params";
import { SearchHeader } from "./search-header";
import { CategoriesBar } from "./categories-bar";
import { FeaturedSection } from "./featured-section";
import { SplitMapList } from "./split-map-list";
import { PremiumDealersSection } from "./premium-dealers-section";
import { ListingCarousel } from "./listing-carousel";
import { VeiculosFooter } from "./veiculos-footer";
import { useVeiculosState } from "../hooks/use-veiculos-state";
import { defaultVeiculosFilters, type VehicleCategory, type VehicleListing } from "../types";

export function VeiculosPage() {
  const t = useTranslations("veiculos");
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
    applySearch,
    selectRegionFromFooter,
  } = useVeiculosState();

  const searchParams = useSearchParams();
  const appliedFromUrl = useRef(false);
  const [premium, setPremium] = useState<VehicleListing[]>([]);
  const [recommended, setRecommended] = useState<VehicleListing[]>([]);

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
    if (appliedFromUrl.current || !hasLocationSearchParams(searchParams)) return;
    appliedFromUrl.current = true;

    const fromUrl = parseLocationSearchParams(searchParams);
    applySearch({
      ...defaultVeiculosFilters,
      city: fromUrl.city,
      state: fromUrl.state,
      locationLabel: fromUrl.locationLabel,
      lat: fromUrl.lat,
      lng: fromUrl.lng,
      query: fromUrl.query,
      type: (fromUrl.type || "") as VehicleCategory | "",
    });
  }, [searchParams, applySearch]);

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
          onReset={resetFilters}
        />

        <CategoriesBar
          activeType={filters.type}
          onSelect={(type) => {
            const next = { ...filters, type: type as VehicleCategory | "" };
            updateFilters({ type: next.type });
            applySearch(next);
          }}
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

      <VeiculosFooter onSelectRegion={selectRegionFromFooter} />
    </>
  );
}
