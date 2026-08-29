"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  defaultProjetosFilters,
  type ProjetosFilters,
  type ProjetosView,
  type ProjectListing,
} from "../types";
import { filterProjects, sortProjects } from "@/lib/listings/filters";

export function useProjetosState() {
  const [filters, setFilters] = useState<ProjetosFilters>(defaultProjetosFilters);
  const [view, setView] = useState<ProjetosView>("grid");
  const [highlightedId, setHighlightedId] = useState<string | null>(null);
  const [catalog, setCatalog] = useState<ProjectListing[]>([]);

  useEffect(() => {
    fetch("/api/listings/projects")
      .then((r) => r.json())
      .then((data: ProjectListing[]) => {
        setCatalog(Array.isArray(data) ? data : []);
      })
      .catch(() => {
        setCatalog([]);
      });
  }, []);

  const results = useMemo(() => {
    return sortProjects(filterProjects(catalog, filters), filters.sort);
  }, [filters, catalog]);

  const updateFilters = useCallback((next: Partial<ProjetosFilters>) => {
    setFilters((prev) => ({ ...prev, ...next }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(defaultProjetosFilters);
  }, []);

  const applySearch = useCallback((next: ProjetosFilters) => {
    setFilters(next);
  }, []);

  const initFromUrl = useCallback(
    (next: ProjetosFilters, nextView: ProjetosView) => {
      setFilters(next);
      setView(nextView);
    },
    [],
  );

  return {
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
  };
}
