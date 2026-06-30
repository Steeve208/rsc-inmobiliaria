"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { SearchHeader } from "./search-header";
import { CategoriesBar } from "./categories-bar";
import { SplitMapList } from "./split-map-list";
import { ListingCarousel } from "./listing-carousel";
import { ImoveisFooter } from "./imoveis-footer";
import { useImoveisState } from "../hooks/use-imoveis-state";
import { defaultImoveisFilters, type PropertyListing } from "../types";

export function ImoveisPage() {
  const t = useTranslations("imoveis");
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
  } = useImoveisState();

  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q");
  const appliedFromUrl = useRef(false);
  const [premium, setPremium] = useState<PropertyListing[]>([]);
  const [recommended, setRecommended] = useState<PropertyListing[]>([]);
  const [launches, setLaunches] = useState<PropertyListing[]>([]);

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
    if (!initialQuery || appliedFromUrl.current) return;
    appliedFromUrl.current = true;
    const next = { ...defaultImoveisFilters, query: initialQuery };
    updateFilters({ query: initialQuery });
    applySearch(next);
  }, [initialQuery, updateFilters, applySearch]);

  return (
    <>
      <div className="relative isolate overflow-hidden">
        <div className="pointer-events-none absolute inset-x-0 top-[-180px] h-[380px] bg-[radial-gradient(circle_at_top,rgba(29,78,216,0.18),transparent_65%)]" />
        <div className="pointer-events-none absolute right-[-160px] top-[340px] h-[360px] w-[360px] rounded-full bg-[#1d4ed8]/10 blur-3xl" />

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
            const next = { ...filters, type };
            updateFilters({ type });
            applySearch(next);
          }}
        />

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

        <SplitMapList
          results={results}
          filters={filters}
          view={view}
          highlightedId={highlightedId}
          hasSearched={hasSearched}
          onViewChange={setView}
          onHighlight={setHighlightedId}
        />

        <ListingCarousel
          title={t("sections.launches")}
          items={launches}
          badge={t("sections.new")}
        />

        <ListingCarousel
          title={t("sections.projects")}
          subtitle={t("sections.projectsSubtitle")}
          items={launches}
        />
      </div>

      <ImoveisFooter onSelectRegion={selectRegionFromFooter} />
    </>
  );
}
