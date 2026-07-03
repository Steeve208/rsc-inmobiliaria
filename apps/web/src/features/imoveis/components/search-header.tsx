"use client";

import { useEffect, useRef, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import {
  clearLocationFilters,
  resolvedLocationToFilters,
  type ResolvedLocation,
} from "@/lib/geocoding/types";
import { FilterMenuPanel } from "./filter-menu-panel";
import { ActiveFilterTags } from "./active-filter-tags";
import { LocationAutocomplete } from "./location-autocomplete";
import { countActiveFilters } from "../utils/filter-tags";
import { defaultImoveisFilters, type ImoveisFilters } from "../types";
import { useMarket } from "@/lib/providers/market-provider";

type Props = {
  filters: ImoveisFilters;
  showTags?: boolean;
  onChange: (next: Partial<ImoveisFilters>) => void;
  onSearch: (filters: ImoveisFilters) => void;
  onReset: () => void;
};

export function SearchHeader({
  filters,
  showTags = false,
  onChange,
  onSearch,
  onReset,
}: Props) {
  const t = useTranslations("imoveis.search");
  const tMarkets = useTranslations("markets");
  const { market } = useMarket();
  const tf = useTranslations("imoveis.filters");
  const [menuOpen, setMenuOpen] = useState(false);
  const [draft, setDraft] = useState<ImoveisFilters>(filters);
  const [locationText, setLocationText] = useState(
    filters.locationLabel || filters.city,
  );
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLocationText(filters.locationLabel || filters.city);
  }, [filters.locationLabel, filters.city]);

  useEffect(() => {
    if (menuOpen) setDraft({ ...filters, locationLabel: locationText, city: filters.city });
  }, [menuOpen, filters, locationText]);

  useEffect(() => {
    if (!menuOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [menuOpen]);

  const tagLabels = {
    buy: tf("buy"),
    rent: tf("rent"),
    new: tf("new"),
    used: tf("used"),
    house: tf("house"),
    apartment: tf("apartment"),
    land: tf("land"),
    pool: tf("pool"),
    pets: tf("pets"),
    financing: tf("financing"),
    rscCredit: tf("rscCredit"),
    garage: tf("garage"),
    bedrooms: tf("bedrooms"),
    priceUpTo: t("priceUpTo"),
    priceFrom: t("priceFrom"),
    areaFrom: tf("areaMin"),
    areaTo: tf("areaMax"),
    city: tMarkets(`searchLocation.${market.defaultLocale}`),
    state: tf("state"),
  };

  const activeCount = countActiveFilters(filters);

  const handlePlaceResolved = (location: ResolvedLocation) => {
    const patch = resolvedLocationToFilters(location);
    setDraft((prev) => ({ ...prev, ...patch }));
    onChange(patch);
  };

  const handleLocationCleared = () => {
    const patch = clearLocationFilters();
    setDraft((prev) => ({ ...prev, ...patch }));
    onChange(patch);
  };

  const handleSearch = () => {
    const next: ImoveisFilters = {
      ...draft,
      locationLabel: draft.lat != null ? draft.locationLabel : locationText,
      city: draft.city || locationText,
    };
    onChange(next);
    onSearch(next);
    setMenuOpen(false);
  };

  const updateDraft = (next: Partial<ImoveisFilters>) => {
    setDraft((prev) => ({ ...prev, ...next }));
  };

  return (
    <section className="market-section-compact">
      <div className="market-container">
        <div ref={panelRef} className="relative space-y-3">
          <div className="rounded-2xl bg-[#071022]/80 p-2 shadow-xl shadow-black/25 backdrop-blur-xl">
            <div className="flex flex-col gap-2 lg:flex-row lg:items-center">
              <LocationAutocomplete
                value={locationText}
                placeholder={tMarkets(`searchLocation.${market.defaultLocale}`)}
                onValueChange={setLocationText}
                onPlaceResolved={handlePlaceResolved}
                onLocationCleared={handleLocationCleared}
                onEnter={handleSearch}
              />

              <div className="flex shrink-0 gap-2">
                <button
                  type="button"
                  onClick={() => setMenuOpen((o) => !o)}
                  className={cn(
                    "inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-xl px-4 text-sm font-medium transition-all sm:flex-none",
                    menuOpen
                      ? "bg-[#1d4ed8]/10 text-[#60a5fa]"
                      : "bg-white/[0.03] text-white/80 hover:bg-white/[0.06]",
                  )}
                >
                  <SlidersHorizontal className="size-4" strokeWidth={1.75} />
                  {t("filters")}
                  {activeCount > 0 && (
                    <span className="flex size-5 items-center justify-center rounded-full bg-[#1d4ed8] text-[10px] font-bold text-white">
                      {activeCount}
                    </span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleSearch}
                  className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-[#1d4ed8] px-5 text-sm font-semibold text-white shadow-lg shadow-[#1d4ed8]/20 transition-all hover:bg-[#1e40af] sm:flex-none sm:px-6"
                >
                  <Search className="size-4" strokeWidth={2} />
                  {t("submit")}
                </button>
              </div>
            </div>

            {menuOpen && (
              <div className="mt-2 rounded-2xl border border-white/10 bg-[#0a1428]/95 p-4 shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-5">
                <FilterMenuPanel
                  draft={draft}
                  onChange={updateDraft}
                  onReset={() => {
                    setLocationText("");
                    setDraft(defaultImoveisFilters);
                  }}
                  onApply={handleSearch}
                />
              </div>
            )}
          </div>

          {showTags && (
            <ActiveFilterTags
              filters={filters}
              labels={tagLabels}
              onRemove={(clear) => {
                onChange(clear);
                if ("locationLabel" in clear || "city" in clear) {
                  setLocationText("");
                }
              }}
              onClearAll={() => {
                setLocationText("");
                onReset();
              }}
              clearAllLabel={t("clearAll")}
            />
          )}
        </div>
      </div>
    </section>
  );
}
