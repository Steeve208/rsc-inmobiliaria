import { filterProperties, filterVehicles } from "@/lib/listings/filters";
import {
  listSavedSearchesWithAlertsEnabled,
  markSavedSearchAlertSent,
  type SavedSearchAlertCandidate,
} from "@/lib/listings/saved-search-repository";
import { listActivePropertiesForAlerts } from "@/lib/listings/property-repository";
import { listActiveVehiclesForAlerts } from "@/lib/listings/vehicle-repository";
import { imoveisFiltersToParams } from "@/lib/imoveis/search-params";
import { veiculosFiltersToParams } from "@/lib/veiculos/search-params";
import type { PropertyListing } from "@/features/imoveis/types";
import type { VehicleListing } from "@/features/veiculos/types";
import { buildNavFromFilters } from "./build-nav-from-filters";
import { shouldSendAlertForFrequency } from "./frequency";
import { sendSavedSearchAlertEmail } from "./send-alert-email";

export type ProcessSavedSearchAlertsResult = {
  processed: number;
  emailsSent: number;
  emailsSkipped: number;
  listingsNotified: number;
  errors: number;
};

function findNewMatchingProperties(
  search: SavedSearchAlertCandidate,
  catalog: PropertyListing[],
): PropertyListing[] {
  if (search.vertical !== "property") return [];
  const notified = new Set(search.notifiedListingIds);
  const nav = buildNavFromFilters(search.filters);
  const matching = filterProperties(catalog, search.filters, nav);
  return matching.filter((listing) => !notified.has(listing.id));
}

function findNewMatchingVehicles(
  search: SavedSearchAlertCandidate,
  catalog: VehicleListing[],
): VehicleListing[] {
  if (search.vertical !== "vehicle") return [];
  const notified = new Set(search.notifiedListingIds);
  const matching = filterVehicles(catalog, search.filters);
  return matching.filter((listing) => !notified.has(listing.id));
}

export async function processSavedSearchAlerts(): Promise<ProcessSavedSearchAlertsResult> {
  const now = new Date();
  const [propertyCatalog, vehicleCatalog, searches] = await Promise.all([
    listActivePropertiesForAlerts(),
    listActiveVehiclesForAlerts(),
    listSavedSearchesWithAlertsEnabled(),
  ]);

  const result: ProcessSavedSearchAlertsResult = {
    processed: 0,
    emailsSent: 0,
    emailsSkipped: 0,
    listingsNotified: 0,
    errors: 0,
  };

  for (const search of searches) {
    result.processed += 1;

    const lastAlertAt = search.lastAlertAt ? new Date(search.lastAlertAt) : null;
    if (!shouldSendAlertForFrequency(search.alertFrequency, lastAlertAt, now)) {
      continue;
    }

    const newListings =
      search.vertical === "vehicle"
        ? findNewMatchingVehicles(search, vehicleCatalog)
        : findNewMatchingProperties(search, propertyCatalog);

    if (newListings.length === 0) {
      continue;
    }

    try {
      const searchQuery =
        search.vertical === "vehicle"
          ? veiculosFiltersToParams(search.filters).toString()
          : imoveisFiltersToParams(search.filters).toString();

      const emailResult = await sendSavedSearchAlertEmail({
        to: search.userEmail,
        userName: search.userName,
        searchLabel: search.label,
        vertical: search.vertical,
        listings: newListings,
        searchQuery,
        locale: search.alertLocale,
      });

      const shouldMarkSent =
        emailResult.sent || emailResult.reason === "resend_not_configured";

      if (!shouldMarkSent) {
        result.errors += 1;
        continue;
      }

      await markSavedSearchAlertSent(
        search.id,
        newListings.map((listing) => listing.id),
      );

      result.listingsNotified += newListings.length;
      if (emailResult.sent) {
        result.emailsSent += 1;
      } else {
        result.emailsSkipped += 1;
      }
    } catch (error) {
      console.error("[process-saved-search-alerts]", search.id, error);
      result.errors += 1;
    }
  }

  return result;
}
