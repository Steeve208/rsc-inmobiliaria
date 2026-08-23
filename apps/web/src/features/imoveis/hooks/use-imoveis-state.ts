"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  defaultImoveisFilters,
  type ImoveisFilters,
  type ImoveisView,
  type MapNavigation,
  type PropertyListing,
} from "../types";
import { parsePropertyAiQuery } from "@/lib/listings/parse-ai-query";
import { resolveSearchLocationFromQuery } from "@/lib/geocoding/resolve-search-location";
import { filterProperties } from "@/lib/listings/filters";
import { sortProperties } from "@/lib/listings/sort-properties";
import { brazilStates, worldRegions } from "@/lib/listings/regions";
import { getDefaultCountryFilters } from "@/lib/markets/config";
import { useMarket } from "@/lib/providers/market-provider";
import type { MarketId } from "@/lib/markets/types";
import { propertyListings } from "../mock-data";
import { mergePropertyCatalog } from "@/lib/marketplace/home-property-mocks";

function createDefaultNav(marketId: MarketId): MapNavigation {
  const { country, countryCode } = getDefaultCountryFilters(marketId);
  return {
    level: "properties",
    country,
    countryCode,
  };
}

function createDefaultFilters(_marketId: MarketId): ImoveisFilters {
  return {
    ...defaultImoveisFilters,
    country: "",
  };
}

export function useImoveisState() {
  const { market, marketId } = useMarket();
  const [nav, setNav] = useState<MapNavigation>(() => createDefaultNav(marketId));
  const [filters, setFilters] = useState<ImoveisFilters>(() =>
    createDefaultFilters(marketId),
  );
  const [view, setView] = useState<ImoveisView>("grid");
  const [highlightedId, setHighlightedId] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [catalog, setCatalog] = useState<PropertyListing[]>([]);

  useEffect(() => {
    fetch("/api/listings/properties")
      .then((r) => r.json())
      .then((data: PropertyListing[]) => {
        const live = Array.isArray(data) ? data : [];
        setCatalog(mergePropertyCatalog(live, propertyListings));
        setHasSearched(true);
      })
      .catch(() => {
        setCatalog(mergePropertyCatalog([], propertyListings));
        setHasSearched(true);
      });
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
    const list = filterProperties(catalog, filters, nav);
    return sortProperties(list, filters.sort, filters);
  }, [filters, nav, catalog]);

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
        country: next.country || undefined,
        countryCode: next.country ? market.countryCode : undefined,
        state: next.state || undefined,
        city: next.city || undefined,
        neighborhood: next.neighborhood || undefined,
      });
    },
    [market.countryCode],
  );

  const initFromUrl = useCallback(
    (next: ImoveisFilters, nextView: ImoveisView, searched: boolean) => {
      setFilters(next);
      setView(nextView);
      setHasSearched(searched);
      if (searched) {
        setNav({
          level: "properties",
          country: next.country || undefined,
          countryCode: next.country ? market.countryCode : undefined,
          state: next.state || undefined,
          city: next.city || undefined,
          neighborhood: next.neighborhood || undefined,
        });
      }
    },
    [market.countryCode],
  );

  const selectRegionFromFooter = useCallback(
    (region: { id: string; name: string }): ImoveisFilters | null => {
      const isState = brazilStates.some((s) => s.id === region.id);
      const isCountry = worldRegions.some((r) => r.id === region.id);

      if (isState) {
        return {
          ...marketDefaults,
          state: region.id,
          city: "",
          neighborhood: "",
          locationLabel: `${region.name}, ${region.id}`,
          lat: null,
          lng: null,
          query: "",
        };
      }

      if (isCountry) {
        return {
          ...marketDefaults,
          country: region.name,
          state: "",
          city: "",
          neighborhood: "",
          locationLabel: region.name,
          lat: null,
          lng: null,
          query: "",
        };
      }

      return null;
    },
    [marketDefaults],
  );

  const runAiSearch = useCallback(async (query: string) => {
    setAiLoading(true);
    try {
      const [parsed, locationPatch] = await Promise.all([
        Promise.resolve(parsePropertyAiQuery(query)),
        resolveSearchLocationFromQuery(query),
      ]);
      const next: ImoveisFilters = {
        ...createDefaultFilters(marketId),
        ...parsed,
        ...locationPatch,
      };
      setFilters(next);
      setNav({
        level: "properties",
        country: next.country || undefined,
        countryCode: next.country ? market.countryCode : undefined,
        state: next.state || undefined,
        city: next.city || undefined,
        neighborhood: next.neighborhood || undefined,
      });
      setHasSearched(true);
    } finally {
      setAiLoading(false);
    }
  }, [market.countryCode, marketId]);

  return {
    nav,
    filters,
    view,
    highlightedId,
    aiLoading,
    hasSearched,
    catalog,
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
