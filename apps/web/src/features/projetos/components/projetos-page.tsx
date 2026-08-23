"use client";

import { useCallback, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { usePathname, useRouter } from "@/lib/i18n/routing";
import { ProjectsListing } from "@/components/marketplace/projects/projects-listing";
import {
  hasProjetosSearchParams,
  parseProjetosSearchParams,
  projetosFiltersToParams,
} from "@/lib/projetos/search-params";
import { useProjetosState } from "../hooks/use-projetos-state";
import type { ProjetosFilters, ProjetosView } from "../types";

export function ProjetosPage() {
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
  } = useProjetosState();

  const syncUrl = useCallback(
    (next: ProjetosFilters, nextView = view) => {
      const params = projetosFiltersToParams(next, nextView);
      const qs = params.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname);
    },
    [router, pathname, view],
  );

  useEffect(() => {
    if (!hasProjetosSearchParams(searchParams) && !searchParams.get("view")) return;
    const { filters: fromUrl, view: urlView } = parseProjetosSearchParams(searchParams);
    initFromUrl(fromUrl, urlView);
  }, [searchParams, initFromUrl]);

  const handleFilterChange = useCallback(
    (patch: Partial<ProjetosFilters>) => {
      const next = { ...filters, ...patch };
      updateFilters(patch);
      applySearch(next);
      syncUrl(next);
    },
    [filters, updateFilters, applySearch, syncUrl],
  );

  const handleViewChange = useCallback(
    (nextView: ProjetosView) => {
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
    <ProjectsListing
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
