"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  defaultVeiculosFilters,
  type RegionItem,
  type VeiculosFilters,
  type VeiculosView,
  type VehicleListing,
} from "../types";
import { parseAiQuery } from "../mock-data";
import { filterVehicles } from "@/lib/listings/filters";
import { brazilStates, worldRegions } from "@/lib/listings/regions";
import { haversineKm } from "@/lib/geocoding/geo-utils";

export function useVeiculosState() {
  const [filters, setFilters] = useState<VeiculosFilters>(defaultVeiculosFilters);
  const [view, setView] = useState<VeiculosView>("list");
  const [highlightedId, setHighlightedId] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [catalog, setCatalog] = useState<VehicleListing[]>([]);

  useEffect(() => {
    fetch("/api/listings/vehicles")
      .then((r) => r.json())
      .then((data: VehicleListing[]) => setCatalog(data))
      .catch(() => setCatalog([]));
  }, []);

  const results = useMemo(() => {
    if (!hasSearched) return [];
    let list = filterVehicles(catalog, filters);
    if (filters.lat != null && filters.lng != null) {
      list = [...list].sort(
        (a, b) =>
          haversineKm(filters.lat!, filters.lng!, a.lat, a.lng) -
          haversineKm(filters.lat!, filters.lng!, b.lat, b.lng),
      );
    }
    return list;
  }, [filters, hasSearched, catalog]);

  const updateFilters = useCallback((next: Partial<VeiculosFilters>) => {
    setFilters((prev) => ({ ...prev, ...next }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(defaultVeiculosFilters);
  }, []);

  const applySearch = useCallback((next: VeiculosFilters) => {
    setFilters(next);
    setHasSearched(true);
  }, []);

  const selectRegionFromFooter = useCallback((region: RegionItem) => {
    const isState = brazilStates.some((s) => s.id === region.id);
    const isCountry = worldRegions.some((r) => r.id === region.id);

    if (isState) {
      const next = { ...defaultVeiculosFilters, state: region.id };
      setFilters(next);
      setHasSearched(true);
    } else if (isCountry) {
      const next = { ...defaultVeiculosFilters };
      setFilters(next);
      setHasSearched(true);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const runAiSearch = useCallback(async (query: string) => {
    setAiLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    const parsed = parseAiQuery(query);
    const next: VeiculosFilters = {
      ...defaultVeiculosFilters,
      ...parsed,
      state: "RS",
      city: "Porto Alegre",
      locationLabel: "Porto Alegre, RS, Brasil",
      lat: -30.0346,
      lng: -51.2177,
    };
    setFilters(next);
    setHasSearched(true);
    setAiLoading(false);
  }, []);

  return {
    filters,
    view,
    highlightedId,
    aiLoading,
    hasSearched,
    results,
    setView,
    setHighlightedId,
    updateFilters,
    resetFilters,
    applySearch,
    selectRegionFromFooter,
    runAiSearch,
  };
}
