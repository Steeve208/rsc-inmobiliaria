"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  defaultImoveisFilters,
  type ImoveisFilters,
  type ImoveisView,
  type MapNavigation,
  type PropertyListing,
} from "../types";
import { parseAiQuery } from "../mock-data";
import { filterProperties } from "@/lib/listings/filters";
import { brazilStates, worldRegions } from "@/lib/listings/regions";
import { haversineKm } from "@/lib/geocoding/geo-utils";
import { getDefaultCountryFilters } from "@/lib/markets/config";
import { useMarket } from "@/lib/providers/market-provider";
import type { MarketId } from "@/lib/markets/types";

function createDefaultNav(marketId: MarketId): MapNavigation {
  const { country, countryCode } = getDefaultCountryFilters(marketId);
  return {
    level: "properties",
    country,
    countryCode,
  };
}

function createDefaultFilters(marketId: MarketId): ImoveisFilters {
  const { country } = getDefaultCountryFilters(marketId);
  return {
    ...defaultImoveisFilters,
    country,
  };
}

export function useImoveisState() {
  const { market, marketId } = useMarket();
  const [nav, setNav] = useState<MapNavigation>(() => createDefaultNav(marketId));
  const [filters, setFilters] = useState<ImoveisFilters>(() =>
    createDefaultFilters(marketId),
  );
  const [view, setView] = useState<ImoveisView>("list");
  const [highlightedId, setHighlightedId] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [catalog, setCatalog] = useState<PropertyListing[]>([]);

  useEffect(() => {
    fetch("/api/listings/properties")
      .then((r) => r.json())
      .then((data: PropertyListing[]) => setCatalog(data))
      .catch(() => setCatalog([]));
  }, []);

  useEffect(() => {
    setNav(createDefaultNav(marketId));
    setFilters(createDefaultFilters(marketId));
    setHasSearched(false);
  }, [marketId]);

  const marketDefaults = useMemo(
    () => createDefaultFilters(marketId),
    [marketId],
  );

  const results = useMemo(() => {
    if (!hasSearched) return [];
    let list = filterProperties(catalog, filters, nav);
    if (filters.lat != null && filters.lng != null) {
      list = [...list].sort(
        (a, b) =>
          haversineKm(filters.lat!, filters.lng!, a.lat, a.lng) -
          haversineKm(filters.lat!, filters.lng!, b.lat, b.lng),
      );
    }
    return list;
  }, [filters, nav, hasSearched, catalog]);

  const updateFilters = useCallback((next: Partial<ImoveisFilters>) => {
    setFilters((prev) => ({ ...prev, ...next }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(marketDefaults);
  }, [marketDefaults]);

  const applySearch = useCallback(
    (next: ImoveisFilters) => {
      setFilters(next);
      setHasSearched(true);
      setNav({
        level: "properties",
        country: next.country || market.countryName,
        countryCode: market.countryCode,
        state: next.state || undefined,
        city: next.city || undefined,
        neighborhood: next.neighborhood || undefined,
      });
    },
    [market.countryCode, market.countryName],
  );

  const selectRegionFromFooter = useCallback(
    (region: { id: string; name: string }) => {
      const isState = brazilStates.some((s) => s.id === region.id);
      const isCountry = worldRegions.some((r) => r.id === region.id);

      if (isState) {
        const next = {
          ...marketDefaults,
          state: region.id,
        };
        setFilters(next);
        setNav({
          level: "properties",
          country: market.countryName,
          countryCode: market.countryCode,
          state: region.id,
        });
        setHasSearched(true);
      } else if (isCountry) {
        const next = {
          ...marketDefaults,
          country: region.name,
        };
        setFilters(next);
        setNav({
          level: region.id === market.countryCode ? "properties" : "country",
          country: region.name,
          countryCode: region.id,
        });
        setHasSearched(true);
      }
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [market.countryCode, market.countryName, marketDefaults],
  );

  const runAiSearch = useCallback(async (query: string) => {
    setAiLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    const parsed = parseAiQuery(query);
    const next: ImoveisFilters = {
      ...defaultImoveisFilters,
      ...parsed,
      state: "RS",
      city: "Bento Gonçalves",
      locationLabel: "Bento Gonçalves, RS, Brasil",
      lat: -29.1714,
      lng: -51.5192,
    };
    setFilters(next);
    setNav({
      level: "properties",
      country: "Brasil",
      countryCode: "br",
      state: "RS",
      city: "Bento Gonçalves",
    });
    setHasSearched(true);
    setAiLoading(false);
  }, []);

  return {
    nav,
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
