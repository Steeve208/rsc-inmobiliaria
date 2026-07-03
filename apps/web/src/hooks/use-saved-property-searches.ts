"use client";

import { useCallback, useEffect, useState } from "react";
import type { ImoveisFilters } from "@/features/imoveis/types";
import { imoveisFiltersToParams } from "@/lib/imoveis/search-params";

export type SavedPropertySearch = {
  id: string;
  label: string;
  filters: ImoveisFilters;
  savedAt: string;
};

const STORAGE_KEY = "rsc_saved_property_searches";

function readSearches(): SavedPropertySearch[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? (JSON.parse(raw) as SavedPropertySearch[]) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeSearches(searches: SavedPropertySearch[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(searches.slice(0, 10)));
}

export function useSavedPropertySearches() {
  const [searches, setSearches] = useState<SavedPropertySearch[]>([]);

  useEffect(() => {
    setSearches(readSearches());
  }, []);

  const saveSearch = useCallback((filters: ImoveisFilters, label?: string) => {
    const params = imoveisFiltersToParams(filters);
    const autoLabel =
      label ||
      filters.locationLabel ||
      filters.city ||
      params.toString() ||
      "Busca salva";

    const entry: SavedPropertySearch = {
      id: `search_${Date.now().toString(36)}`,
      label: autoLabel,
      filters,
      savedAt: new Date().toISOString(),
    };

    const next = [entry, ...readSearches().filter((s) => s.label !== autoLabel)].slice(
      0,
      10,
    );
    writeSearches(next);
    setSearches(next);
    return entry;
  }, []);

  const removeSearch = useCallback((id: string) => {
    const next = readSearches().filter((s) => s.id !== id);
    writeSearches(next);
    setSearches(next);
  }, []);

  return { searches, saveSearch, removeSearch };
}
