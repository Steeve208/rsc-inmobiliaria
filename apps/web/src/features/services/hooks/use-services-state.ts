"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  defaultServicesFilters,
  type ServiceListing,
  type ServicesFilters,
  type ServicesView,
} from "../types";
import { filterServices, sortServices } from "@/lib/listings/filters";

export function useServicesState() {
  const [filters, setFilters] = useState<ServicesFilters>(defaultServicesFilters);
  const [view, setView] = useState<ServicesView>("grid");
  const [highlightedId, setHighlightedId] = useState<string | null>(null);
  const [catalog, setCatalog] = useState<ServiceListing[]>([]);

  useEffect(() => {
    fetch("/api/listings/services")
      .then((r) => r.json())
      .then((data: ServiceListing[]) => {
        setCatalog(Array.isArray(data) ? data : []);
      })
      .catch(() => {
        setCatalog([]);
      });
  }, []);

  const results = useMemo(
    () => sortServices(filterServices(catalog, filters), filters.sort),
    [filters, catalog],
  );

  const updateFilters = useCallback((next: Partial<ServicesFilters>) => {
    setFilters((prev) => ({ ...prev, ...next }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(defaultServicesFilters);
  }, []);

  const applySearch = useCallback((next: ServicesFilters) => {
    setFilters(next);
  }, []);

  const initFromUrl = useCallback((next: ServicesFilters, nextView: ServicesView) => {
    setFilters(next);
    setView(nextView);
  }, []);

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
