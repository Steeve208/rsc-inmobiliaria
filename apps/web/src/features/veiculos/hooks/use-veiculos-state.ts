"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  defaultVeiculosFilters,
  type RegionItem,
  type VeiculosFilters,
  type VeiculosView,
  type VehicleListing,
} from "../types";
import { parseVehicleAiQuery } from "@/lib/listings/parse-ai-query";
import { resolveSearchLocationFromQuery } from "@/lib/geocoding/resolve-search-location";
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
      .then((data: VehicleListing[]) => {
        setCatalog(data);
        if (data.length > 0) {
          setHasSearched(true);
        }
      })
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

  const initFromUrl = useCallback((next: VeiculosFilters, searched: boolean) => {
    setFilters(next);
    setHasSearched(searched);
  }, []);

  const selectRegionFromFooter = useCallback((region: RegionItem): VeiculosFilters | null => {
    const isState = brazilStates.some((s) => s.id === region.id);
    const isCountry = worldRegions.some((r) => r.id === region.id);

    if (isState) {
      return {
        ...defaultVeiculosFilters,
        state: region.id,
        city: "",
        locationLabel: `${region.name}, ${region.id}`,
        lat: null,
        lng: null,
        query: "",
      };
    }

    if (isCountry) {
      return {
        ...defaultVeiculosFilters,
        locationLabel: region.name,
        lat: null,
        lng: null,
        query: "",
      };
    }

    return null;
  }, []);

  const runAiSearch = useCallback(async (query: string) => {
    setAiLoading(true);
    try {
      const [parsed, locationPatch] = await Promise.all([
        Promise.resolve(parseVehicleAiQuery(query)),
        resolveSearchLocationFromQuery(query),
      ]);
      const next: VeiculosFilters = {
        ...defaultVeiculosFilters,
        ...parsed,
        ...locationPatch,
      };
      setFilters(next);
      setHasSearched(true);
    } finally {
      setAiLoading(false);
    }
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
    initFromUrl,
    selectRegionFromFooter,
    runAiSearch,
  };
}
