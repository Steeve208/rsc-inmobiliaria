"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  defaultNegociosFilters,
  type BusinessListing,
  type NegociosFilters,
  type NegociosView,
} from "../types";
import { filterBusinesses, sortBusinesses } from "@/lib/listings/filters";

export function useNegociosState() {
  const [filters, setFilters] = useState<NegociosFilters>(defaultNegociosFilters);
  const [view, setView] = useState<NegociosView>("grid");
  const [highlightedId, setHighlightedId] = useState<string | null>(null);
  const [catalog, setCatalog] = useState<BusinessListing[]>([]);

  useEffect(() => {
    fetch("/api/listings/businesses")
      .then((r) => r.json())
      .then((data: BusinessListing[]) => {
        setCatalog(Array.isArray(data) ? data : []);
      })
      .catch(() => {
        setCatalog([]);
      });
  }, []);

  const results = useMemo(() => {
    return sortBusinesses(filterBusinesses(catalog, filters), filters.sort);
  }, [filters, catalog]);

  const updateFilters = useCallback((next: Partial<NegociosFilters>) => {
    setFilters((prev) => ({ ...prev, ...next }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(defaultNegociosFilters);
  }, []);

  const applySearch = useCallback((next: NegociosFilters) => {
    setFilters(next);
  }, []);

  const initFromUrl = useCallback((next: NegociosFilters, nextView: NegociosView) => {
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
