import { resolvedLocationToFilters } from "./types";
import type { ResolvedLocation } from "./types";

export async function resolveSearchLocationFromQuery(query: string) {
  const trimmed = query.trim();
  if (trimmed.length < 2) return {};

  try {
    const res = await fetch(`/api/geocode/search?q=${encodeURIComponent(trimmed)}`);
    if (!res.ok) return {};

    const results = (await res.json()) as ResolvedLocation[];
    if (!results[0]) return {};

    return resolvedLocationToFilters(results[0]);
  } catch {
    return {};
  }
}
