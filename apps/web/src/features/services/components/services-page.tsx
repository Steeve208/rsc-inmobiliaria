"use client";

import { useCallback, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { usePathname, useRouter } from "@/lib/i18n/routing";
import { ServicesListing } from "@/components/marketplace/services/services-listing";
import {
  hasServicesSearchParams,
  parseServicesSearchParams,
  servicesFiltersToParams,
} from "@/lib/servicos/search-params";
import { useServicesState } from "../hooks/use-services-state";
import type { ServicesFilters, ServicesView } from "../types";

export function ServicesPage() {
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
  } = useServicesState();

  const syncUrl = useCallback(
    (next: ServicesFilters, nextView = view) => {
      const params = servicesFiltersToParams(next, nextView);
      const qs = params.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname);
    },
    [router, pathname, view],
  );

  useEffect(() => {
    if (!hasServicesSearchParams(searchParams) && !searchParams.get("view")) return;
    const { filters: fromUrl, view: urlView } = parseServicesSearchParams(searchParams);
    initFromUrl(fromUrl, urlView);
  }, [searchParams, initFromUrl]);

  const handleFilterChange = useCallback(
    (patch: Partial<ServicesFilters>) => {
      const next = { ...filters, ...patch };
      updateFilters(patch);
      applySearch(next);
      syncUrl(next);
    },
    [filters, updateFilters, applySearch, syncUrl],
  );

  const handleViewChange = useCallback(
    (nextView: ServicesView) => {
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
    <ServicesListing
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
