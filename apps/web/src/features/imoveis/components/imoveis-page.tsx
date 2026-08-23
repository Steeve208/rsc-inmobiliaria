"use client";

import { useCallback, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { usePathname, useRouter } from "@/lib/i18n/routing";
import { PropertiesListing } from "@/components/marketplace/properties/properties-listing";
import {
  hasImoveisSearchParams,
  imoveisFiltersToParams,
  parseImoveisSearchParams,
} from "@/lib/imoveis/search-params";
import { useImoveisState } from "../hooks/use-imoveis-state";
import type { ImoveisFilters, ImoveisView } from "../types";

export function ImoveisPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const {
    filters,
    view,
    highlightedId,
    catalog,
    results,
    setView,
    setHighlightedId,
    updateFilters,
    resetFilters,
    applySearch,
    initFromUrl,
  } = useImoveisState();

  const syncUrl = useCallback(
    (next: ImoveisFilters, nextView = view) => {
      const params = imoveisFiltersToParams(next, nextView);
      const qs = params.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname);
    },
    [router, pathname, view],
  );

  useEffect(() => {
    if (!hasImoveisSearchParams(searchParams) && !searchParams.get("view")) return;
    const { filters: fromUrl, view: urlView } = parseImoveisSearchParams(searchParams);
    initFromUrl(fromUrl, urlView, true);
  }, [searchParams, initFromUrl]);

  const handleFilterChange = useCallback(
    (patch: Partial<ImoveisFilters>) => {
      const next = { ...filters, ...patch };
      updateFilters(patch);
      applySearch(next);
      syncUrl(next);
    },
    [filters, updateFilters, applySearch, syncUrl],
  );

  const handleViewChange = useCallback(
    (nextView: ImoveisView) => {
      setView(nextView);
      syncUrl(filters, nextView);
    },
    [setView, syncUrl, filters],
  );

  const handleReset = useCallback(() => {
    resetFilters();
    router.replace(pathname);
  }, [resetFilters, router, pathname]);

  return (
    <PropertiesListing
      results={results}
      catalog={catalog}
      filters={filters}
      view={view}
      highlightedId={highlightedId}
      onChange={handleFilterChange}
      onViewChange={handleViewChange}
      onHighlight={setHighlightedId}
      onReset={handleReset}
    />
  );
}
