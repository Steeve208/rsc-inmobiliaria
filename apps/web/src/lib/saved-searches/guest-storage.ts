import type { ImoveisFilters } from "@/features/imoveis/types";
import type { VeiculosFilters } from "@/features/veiculos/types";
import type {
  CreateSavedSearchInput,
  SavedPropertySearch,
  SavedSearchVertical,
  SavedVehicleSearch,
} from "./types";
import { MAX_SAVED_SEARCHES } from "./types";

const STORAGE_KEYS: Record<SavedSearchVertical, string> = {
  property: "rsc_saved_property_searches",
  vehicle: "rsc_saved_vehicle_searches",
};

function canUseStorage() {
  return typeof window !== "undefined";
}

function normalizeGuestSearch<T extends SavedPropertySearch | SavedVehicleSearch>(
  item: T,
): T {
  return {
    ...item,
    id: item.id || `search_${Date.now().toString(36)}`,
    savedAt: item.savedAt || new Date().toISOString(),
    alertsEnabled: Boolean(item.alertsEnabled),
    alertFrequency: item.alertFrequency || "daily",
    alertLocale: item.alertLocale || "pt",
    notifiedListingIds: Array.isArray(item.notifiedListingIds) ? item.notifiedListingIds : [],
  };
}

export function readGuestSavedSearches(
  vertical: SavedSearchVertical,
): SavedPropertySearch[] | SavedVehicleSearch[] {
  if (!canUseStorage()) return [];

  try {
    const raw = localStorage.getItem(STORAGE_KEYS[vertical]);
    const parsed = raw ? (JSON.parse(raw) as Array<SavedPropertySearch | SavedVehicleSearch>) : [];
    if (!Array.isArray(parsed)) return [];

    return parsed
      .filter((item) => item && typeof item.label === "string" && item.filters)
      .slice(0, MAX_SAVED_SEARCHES)
      .map((item) =>
        normalizeGuestSearch({
          ...item,
          vertical,
        } as SavedPropertySearch | SavedVehicleSearch),
      ) as SavedPropertySearch[] | SavedVehicleSearch[];
  } catch {
    return [];
  }
}

function writeGuestSavedSearches(
  vertical: SavedSearchVertical,
  searches: SavedPropertySearch[] | SavedVehicleSearch[],
) {
  if (!canUseStorage()) return;
  localStorage.setItem(
    STORAGE_KEYS[vertical],
    JSON.stringify(searches.slice(0, MAX_SAVED_SEARCHES)),
  );
}

export function clearGuestSavedSearches(vertical: SavedSearchVertical) {
  if (!canUseStorage()) return;
  localStorage.removeItem(STORAGE_KEYS[vertical]);
}

export function clearAllGuestSavedSearches() {
  clearGuestSavedSearches("property");
  clearGuestSavedSearches("vehicle");
}

export function saveGuestPropertySearch(
  filters: ImoveisFilters,
  label: string,
): SavedPropertySearch {
  const entry: SavedPropertySearch = {
    id: `search_${Date.now().toString(36)}`,
    label,
    vertical: "property",
    filters,
    savedAt: new Date().toISOString(),
    alertsEnabled: false,
    alertFrequency: "daily",
    alertLocale: "pt",
    notifiedListingIds: [],
  };

  const next = [
    entry,
    ...readGuestSavedSearches("property").filter((search) => search.label !== label),
  ].slice(0, MAX_SAVED_SEARCHES) as SavedPropertySearch[];

  writeGuestSavedSearches("property", next);
  return entry;
}

export function saveGuestVehicleSearch(
  filters: VeiculosFilters,
  label: string,
): SavedVehicleSearch {
  const entry: SavedVehicleSearch = {
    id: `search_${Date.now().toString(36)}`,
    label,
    vertical: "vehicle",
    filters,
    savedAt: new Date().toISOString(),
    alertsEnabled: false,
    alertFrequency: "daily",
    alertLocale: "pt",
    notifiedListingIds: [],
  };

  const next = [
    entry,
    ...readGuestSavedSearches("vehicle").filter((search) => search.label !== label),
  ].slice(0, MAX_SAVED_SEARCHES) as SavedVehicleSearch[];

  writeGuestSavedSearches("vehicle", next);
  return entry;
}

export function removeGuestSavedSearch(
  vertical: "property",
  id: string,
): SavedPropertySearch[];
export function removeGuestSavedSearch(
  vertical: "vehicle",
  id: string,
): SavedVehicleSearch[];
export function removeGuestSavedSearch(vertical: SavedSearchVertical, id: string) {
  if (vertical === "vehicle") {
    const next = (readGuestSavedSearches("vehicle") as SavedVehicleSearch[]).filter(
      (search) => search.id !== id,
    );
    writeGuestSavedSearches("vehicle", next);
    return next;
  }

  const next = (readGuestSavedSearches("property") as SavedPropertySearch[]).filter(
    (search) => search.id !== id,
  );
  writeGuestSavedSearches("property", next);
  return next;
}

export function guestSavedSearchInputs(): CreateSavedSearchInput[] {
  const property = readGuestSavedSearches("property").map((search) => ({
    label: search.label,
    vertical: "property" as const,
    filters: search.filters,
    alertsEnabled: search.alertsEnabled,
    alertFrequency: search.alertFrequency,
  }));

  const vehicle = readGuestSavedSearches("vehicle").map((search) => ({
    label: search.label,
    vertical: "vehicle" as const,
    filters: search.filters,
    alertsEnabled: search.alertsEnabled,
    alertFrequency: search.alertFrequency,
  }));

  return [...property, ...vehicle];
}

// Backward-compatible aliases
export const saveGuestSearch = saveGuestPropertySearch;
