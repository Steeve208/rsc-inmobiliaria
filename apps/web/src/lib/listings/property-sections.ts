import type { PropertyListing } from "@/features/imoveis/types";

const DEFAULT_SECTION_LIMIT = 8;

function isPresentable(item: PropertyListing): boolean {
  if (!item.image?.trim()) return false;
  if (!item.title?.trim()) return false;
  return Boolean(item.city?.trim() || item.neighborhood?.trim());
}

function takeUnique(
  source: PropertyListing[],
  limit: number,
  requirePresentable = false,
): PropertyListing[] {
  if (limit <= 0) return [];

  const seen = new Set<string>();
  const unique: PropertyListing[] = [];

  for (const item of source) {
    if (seen.has(item.id)) continue;
    if (requirePresentable && !isPresentable(item)) continue;
    seen.add(item.id);
    unique.push(item);
    if (unique.length >= limit) break;
  }

  return unique;
}

function byNewest(a: PropertyListing, b: PropertyListing) {
  return (
    new Date(b.publishedAt || 0).getTime() -
    new Date(a.publishedAt || 0).getTime()
  );
}

function pickFeaturedFallback(
  catalog: PropertyListing[],
  limit: number,
): PropertyListing[] {
  const ordered = [
    ...catalog.filter((item) => item.launch),
    ...catalog.filter((item) => item.verified),
    ...catalog,
  ];
  const presentable = takeUnique(ordered, limit, true);
  return presentable.length > 0 ? presentable : takeUnique(catalog, limit);
}

/** Premium/featured first; if none are flagged, highlight launch/verified listings. */
export function pickPremiumProperties(
  catalog: PropertyListing[],
  limit = DEFAULT_SECTION_LIMIT,
): PropertyListing[] {
  const flagged = catalog.filter((item) => item.premium || item.featured);
  if (flagged.length > 0) {
    return takeUnique(flagged, limit);
  }
  return pickFeaturedFallback(catalog, limit);
}

/** Launches first, then remaining listings by published date. */
export function pickNewProperties(
  catalog: PropertyListing[],
  limit = DEFAULT_SECTION_LIMIT,
): PropertyListing[] {
  const launches = catalog.filter((item) => item.launch).sort(byNewest);
  const rest = catalog.filter((item) => !item.launch).sort(byNewest);
  const presentable = takeUnique([...launches, ...rest], limit, true);
  return presentable.length > 0
    ? presentable
    : takeUnique([...launches, ...rest], limit);
}
