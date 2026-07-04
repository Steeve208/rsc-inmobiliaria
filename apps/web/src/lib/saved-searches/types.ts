import type { ImoveisFilters } from "@/features/imoveis/types";
import type { VeiculosFilters } from "@/features/veiculos/types";

export type SavedSearchAlertFrequency = "daily" | "weekly" | "instant";

export type SavedSearchVertical = "property" | "vehicle";

export type SavedPropertySearch = {
  id: string;
  label: string;
  vertical: "property";
  filters: ImoveisFilters;
  savedAt: string;
  alertsEnabled: boolean;
  alertFrequency: SavedSearchAlertFrequency;
  alertLocale: string;
  lastAlertAt?: string;
  notifiedListingIds: string[];
};

export type SavedVehicleSearch = {
  id: string;
  label: string;
  vertical: "vehicle";
  filters: VeiculosFilters;
  savedAt: string;
  alertsEnabled: boolean;
  alertFrequency: SavedSearchAlertFrequency;
  alertLocale: string;
  lastAlertAt?: string;
  notifiedListingIds: string[];
};

export type SavedSearch = SavedPropertySearch | SavedVehicleSearch;

export type CreateSavedSearchInput = {
  label: string;
  vertical: SavedSearchVertical;
  filters: ImoveisFilters | VeiculosFilters;
  alertsEnabled?: boolean;
  alertFrequency?: SavedSearchAlertFrequency;
  alertLocale?: string;
};

export type UpdateSavedSearchAlertsInput = {
  alertsEnabled?: boolean;
  alertFrequency?: SavedSearchAlertFrequency;
  alertLocale?: string;
};

export const MAX_SAVED_SEARCHES = 10;

export const SAVED_SEARCH_ALERT_FREQUENCIES: SavedSearchAlertFrequency[] = [
  "daily",
  "weekly",
  "instant",
];
