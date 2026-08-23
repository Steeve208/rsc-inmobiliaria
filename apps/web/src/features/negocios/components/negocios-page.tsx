"use client";

import { useCallback, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { usePathname, useRouter } from "@/lib/i18n/routing";
import { BusinessesListing } from "@/components/marketplace/businesses/businesses-listing";
import {
  hasNegociosSearchParams,
  negociosFiltersToParams,
  parseNegociosSearchParams,
} from "@/lib/negocios/search-params";
import { useNegociosState } from "../hooks/use-negocios-state";
import type { NegociosFilters, NegociosView } from "../types";

export function NegociosPage() {
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
  } = useNegociosState();

  const syncUrl = useCallback(
    (next: NegociosFilters, nextView = view) => {
      const params = negociosFiltersToParams(next, nextView);
      const qs = params.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname);
    },
    [router, pathname, view],
  );

  useEffect(() => {
    if (!hasNegociosSearchParams(searchParams) && !searchParams.get("view")) return;
    const { filters: fromUrl, view: urlView } = parseNegociosSearchParams(searchParams);
    initFromUrl(fromUrl, urlView);
  }, [searchParams, initFromUrl]);

  const handleFilterChange = useCallback(
    (patch: Partial<NegociosFilters>) => {
      const next = { ...filters, ...patch };
      updateFilters(patch);
      applySearch(next);
      syncUrl(next);
    },
    [filters, updateFilters, applySearch, syncUrl],
  );

  const handleViewChange = useCallback(
    (nextView: NegociosView) => {
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
    <BusinessesListing
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
