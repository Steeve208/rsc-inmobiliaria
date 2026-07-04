"use client";

import { useState } from "react";
import { Bell, Trash2 } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/routing";
import type { ImoveisFilters } from "@/features/imoveis/types";
import type { VeiculosFilters } from "@/features/veiculos/types";
import { useSavedPropertySearches } from "@/hooks/use-saved-property-searches";
import { useSavedVehicleSearches } from "@/hooks/use-saved-vehicle-searches";
import { imoveisFiltersToParams } from "@/lib/imoveis/search-params";
import { veiculosFiltersToParams } from "@/lib/veiculos/search-params";
import type { SavedSearchAlertFrequency, SavedSearchVertical } from "@/lib/saved-searches/types";

const frequencies: SavedSearchAlertFrequency[] = ["instant", "daily", "weekly"];

function SavedSearchAlertControls({
  searchId,
  alertsEnabled,
  alertFrequency,
  lastAlertAt,
  disabled,
  updateSearchAlerts,
}: {
  searchId: string;
  alertsEnabled: boolean;
  alertFrequency: SavedSearchAlertFrequency;
  lastAlertAt?: string;
  disabled?: boolean;
  updateSearchAlerts: ReturnType<typeof useSavedPropertySearches>["updateSearchAlerts"];
}) {
  const t = useTranslations("dashboard.savedSearches");
  const locale = useLocale();
  const [saving, setSaving] = useState(false);

  async function handleToggle() {
    if (disabled || saving) return;
    setSaving(true);
    try {
      await updateSearchAlerts(searchId, {
        alertsEnabled: !alertsEnabled,
        alertLocale: locale,
      });
    } finally {
      setSaving(false);
    }
  }

  async function handleFrequencyChange(next: SavedSearchAlertFrequency) {
    if (disabled || saving || next === alertFrequency) return;
    setSaving(true);
    try {
      await updateSearchAlerts(searchId, {
        alertFrequency: next,
        alertLocale: locale,
        ...(alertsEnabled ? {} : { alertsEnabled: true }),
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mt-3 space-y-2 border-t border-border/50 pt-3">
      <label className="flex items-center gap-2 text-sm text-muted-foreground">
        <input
          type="checkbox"
          checked={alertsEnabled}
          disabled={disabled || saving}
          onChange={() => void handleToggle()}
          className="size-4 rounded border-border"
        />
        <Bell className="size-3.5" />
        <span>{t("alertsToggle")}</span>
      </label>

      {alertsEnabled ? (
        <div className="flex flex-wrap items-center gap-2">
          <label htmlFor={`alert-frequency-${searchId}`} className="text-xs text-muted-foreground">
            {t("alertFrequencyLabel")}
          </label>
          <select
            id={`alert-frequency-${searchId}`}
            value={alertFrequency}
            disabled={disabled || saving}
            onChange={(event) =>
              void handleFrequencyChange(event.target.value as SavedSearchAlertFrequency)
            }
            className="rounded-md border border-border/60 bg-background px-2 py-1 text-xs"
          >
            {frequencies.map((frequency) => (
              <option key={frequency} value={frequency}>
                {t(`alertFrequency.${frequency}`)}
              </option>
            ))}
          </select>
        </div>
      ) : null}

      {alertsEnabled && lastAlertAt ? (
        <p className="text-xs text-muted-foreground">
          {t("lastAlertAt", {
            date: new Date(lastAlertAt).toLocaleString(locale),
          })}
        </p>
      ) : null}

      {alertsEnabled ? (
        <p className="text-xs text-[#60a5fa]">{t("alertsEnabled")}</p>
      ) : null}
    </div>
  );
}

export function SavedSearchesPanel({ vertical = "property" }: { vertical?: SavedSearchVertical }) {
  const t = useTranslations(
    vertical === "vehicle" ? "dashboard.savedVehicleSearches" : "dashboard.savedSearches",
  );
  const propertyHook = useSavedPropertySearches();
  const vehicleHook = useSavedVehicleSearches();
  const hook = vertical === "vehicle" ? vehicleHook : propertyHook;
  const { searches, removeSearch, loading, isLoggedIn, isSynced, updateSearchAlerts } = hook;
  const browseHref = vertical === "vehicle" ? "/veiculos" : "/imoveis";

  if (loading) {
    return <p className="text-muted-foreground">{t("loading")}</p>;
  }

  if (searches.length === 0) {
    return (
      <section className="rounded-lg bg-muted/30 p-12 text-center">
        <p className="font-medium">{t("emptyTitle")}</p>
        <p className="mt-1 text-sm text-muted-foreground">{t("emptyBody")}</p>
        {!isLoggedIn ? (
          <p className="mt-3 text-sm text-muted-foreground">
            {t("guestHint")}{" "}
            <Link href="/entrar" className="text-primary hover:underline">
              {t("signIn")}
            </Link>
          </p>
        ) : null}
        <Link
          href={browseHref}
          className="mt-4 inline-block text-sm font-medium text-primary hover:underline"
        >
          {t("browse")}
        </Link>
      </section>
    );
  }

  return (
    <section className="space-y-4">
      {!isLoggedIn ? (
        <p className="rounded-lg border border-[#d4a017]/25 bg-[#d4a017]/10 px-4 py-3 text-sm text-white/75">
          {t("guestSyncBanner")}{" "}
          <Link href="/entrar" className="font-medium text-[#fbbf24] hover:underline">
            {t("signIn")}
          </Link>
        </p>
      ) : null}
      {isLoggedIn && isSynced ? (
        <p className="text-sm text-muted-foreground">{t("syncedHint")}</p>
      ) : null}
      {!isLoggedIn ? (
        <p className="text-sm text-muted-foreground">{t("alertsLoginRequired")}</p>
      ) : null}

      <div className="space-y-3">
        {searches.map((search) => {
          const qs =
            vertical === "vehicle"
              ? veiculosFiltersToParams(search.filters as VeiculosFilters).toString()
              : imoveisFiltersToParams(search.filters as ImoveisFilters).toString();
          const openHref = `${browseHref}${qs ? `?${qs}` : ""}`;
          return (
            <article
              key={search.id}
              className="rounded-lg border border-border/60 bg-card p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <p className="font-medium">{search.label}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(search.savedAt).toLocaleDateString()}
                  </p>
                  <SavedSearchAlertControls
                    searchId={search.id}
                    alertsEnabled={search.alertsEnabled}
                    alertFrequency={search.alertFrequency}
                    lastAlertAt={search.lastAlertAt}
                    disabled={!isLoggedIn}
                    updateSearchAlerts={updateSearchAlerts}
                  />
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <Link
                    href={openHref}
                    className="text-sm font-medium text-primary hover:underline"
                  >
                    {t("open")}
                  </Link>
                  <button
                    type="button"
                    onClick={() => void removeSearch(search.id)}
                    className="rounded p-1 text-muted-foreground hover:text-foreground"
                    aria-label={t("remove")}
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

export function SavedSearchesHub() {
  const t = useTranslations("dashboard");

  return (
    <div className="space-y-10">
      <div>
        <h3 className="mb-4 text-base font-semibold text-white">{t("propertySearchesTitle")}</h3>
        <SavedSearchesPanel vertical="property" />
      </div>
      <div>
        <h3 className="mb-4 text-base font-semibold text-white">{t("vehicleSearchesTitle")}</h3>
        <SavedSearchesPanel vertical="vehicle" />
      </div>
    </div>
  );
}
