"use client";

import { useCallback, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { usePathname, useRouter } from "@/lib/i18n/routing";
import { VehiclesListing } from "@/components/marketplace/vehicles/vehicles-listing";
import {
  hasVeiculosSearchParams,
  parseVeiculosSearchParams,
  veiculosFiltersToParams,
} from "@/lib/veiculos/search-params";
import { useVeiculosState } from "../hooks/use-veiculos-state";
import type { VeiculosFilters, VeiculosView } from "../types";

export function VeiculosPage() {
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
  } = useVeiculosState();

  const syncUrl = useCallback(
    (next: VeiculosFilters, nextView = view) => {
      const params = veiculosFiltersToParams(next, nextView);
      const qs = params.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname);
    },
    [router, pathname, view],
  );

  useEffect(() => {
    if (!hasVeiculosSearchParams(searchParams) && !searchParams.get("view")) return;
    const { filters: fromUrl, view: urlView } = parseVeiculosSearchParams(searchParams);
    initFromUrl(fromUrl, urlView, true);
  }, [searchParams, initFromUrl]);

  const handleFilterChange = useCallback(
    (patch: Partial<VeiculosFilters>) => {
      const next = { ...filters, ...patch };
      updateFilters(patch);
      applySearch(next);
      syncUrl(next);
    },
    [filters, updateFilters, applySearch, syncUrl],
  );

  const handleViewChange = useCallback(
    (nextView: VeiculosView) => {
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
    <VehiclesListing
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
