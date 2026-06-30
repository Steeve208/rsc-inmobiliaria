"use client";

import { useCallback, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter, usePathname } from "@/lib/i18n/routing";
import {
  defaultFilters,
  type SearchCategory,
  type SearchFilters,
  type SearchView,
} from "../types";

function parseFilters(params: URLSearchParams): SearchFilters {
  const category =
    (params.get("category") as SearchCategory) || defaultFilters.category;

  return {
    category,
    query: params.get("q") ?? "",
    country: params.get("country") ?? "",
    state: params.get("state") ?? "",
    city: params.get("city") ?? "",
    neighborhood: params.get("neighborhood") ?? "",
    priceMin: params.get("priceMin") ?? "",
    priceMax: params.get("priceMax") ?? "",
    type: params.get("type") ?? "",
    bedrooms: params.get("bedrooms") ?? "",
    garage: params.get("garage") ?? "",
    pool: params.get("pool") === "1",
    areaMin: params.get("areaMin") ?? "",
    areaMax: params.get("areaMax") ?? "",
    date: params.get("date") ?? "",
    company: params.get("company") ?? "",
    financing: params.get("financing") === "1",
  };
}

function filtersToParams(filters: SearchFilters, view: SearchView): string {
  const params = new URLSearchParams();
  params.set("category", filters.category);
  params.set("view", view);

  const entries: [string, string][] = [
    ["q", filters.query],
    ["country", filters.country],
    ["state", filters.state],
    ["city", filters.city],
    ["neighborhood", filters.neighborhood],
    ["priceMin", filters.priceMin],
    ["priceMax", filters.priceMax],
    ["type", filters.type],
    ["bedrooms", filters.bedrooms],
    ["garage", filters.garage],
    ["pool", filters.pool ? "1" : ""],
    ["areaMin", filters.areaMin],
    ["areaMax", filters.areaMax],
    ["date", filters.date],
    ["company", filters.company],
    ["financing", filters.financing ? "1" : ""],
  ];

  for (const [key, value] of entries) {
    if (value) params.set(key, value);
  }

  return params.toString();
}

export function useSearchState() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const filters = useMemo(
    () => parseFilters(searchParams),
    [searchParams],
  );

  const view = (searchParams.get("view") as SearchView) || "list";

  const applyFilters = useCallback(
    (next: SearchFilters, nextView: SearchView = view) => {
      router.replace(`${pathname}?${filtersToParams(next, nextView)}`);
    },
    [router, pathname, view],
  );

  const setView = useCallback(
    (nextView: SearchView) => {
      applyFilters(filters, nextView);
    },
    [applyFilters, filters],
  );

  const resetFilters = useCallback(() => {
    applyFilters({ ...defaultFilters, category: filters.category }, view);
  }, [applyFilters, filters.category, view]);

  return { filters, view, applyFilters, setView, resetFilters };
}
