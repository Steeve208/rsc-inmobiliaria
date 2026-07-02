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
import { LocationAutocomplete } from "./location-autocomplete";
import { FilterMenuPanel } from "./filter-menu-panel";
import { ActiveFilterTags } from "./active-filter-tags";
import { countActiveFilters } from "../utils/filter-tags";
import { defaultVeiculosFilters, type VeiculosFilters } from "../types";
import { useMarket } from "@/lib/providers/market-provider";

type Props = {
  filters: VeiculosFilters;
  showTags?: boolean;
  onChange: (next: Partial<VeiculosFilters>) => void;
  onSearch: (filters: VeiculosFilters) => void;
  onReset: () => void;
};

export function SearchHeader({
  filters,
  showTags = false,
  onChange,
  onSearch,
  onReset,
}: Props) {
  const t = useTranslations("veiculos.search");
  const tMarkets = useTranslations("markets");
  const { market } = useMarket();
  const tf = useTranslations("veiculos.filters");
  const tc = useTranslations("veiculos.categories");
  const [menuOpen, setMenuOpen] = useState(false);
  const [draft, setDraft] = useState<VeiculosFilters>(filters);
  const [locationText, setLocationText] = useState(
    filters.locationLabel || filters.city,
  );
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLocationText(filters.locationLabel || filters.city);
  }, [filters.locationLabel, filters.city]);

  useEffect(() => {
    if (menuOpen) setDraft({ ...filters, locationLabel: locationText });
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
    car: tc("car"),
    suv: tc("suv"),
    sports: tc("sports"),
    van: tc("van"),
    truck: tc("truck"),
    motorcycle: tc("motorcycle"),
    machinery: tc("machinery"),
    electric: tc("electric"),
    hybrid: tc("hybrid"),
    yearFrom: tf("yearMin"),
    yearTo: tf("yearMax"),
    priceUpTo: t("priceUpTo"),
    priceFrom: t("priceFrom"),
    mileageUpTo: tf("mileageMax"),
    financing: tf("financing"),
  };

  const activeCount = countActiveFilters(filters);

  const handlePlaceResolved = (location: ResolvedLocation) => {
    const patch = resolvedLocationToFilters(location);
    setDraft((prev) => ({
      ...prev,
      city: patch.city ?? prev.city,
      state: patch.state ?? prev.state,
      locationLabel: patch.locationLabel ?? prev.locationLabel,
      lat: patch.lat ?? prev.lat,
      lng: patch.lng ?? prev.lng,
    }));
    onChange({
      city: patch.city ?? "",
      state: patch.state ?? "",
      locationLabel: patch.locationLabel ?? "",
      lat: patch.lat ?? null,
      lng: patch.lng ?? null,
    });
  };

  const handleLocationCleared = () => {
    const patch = clearLocationFilters();
    setDraft((prev) => ({ ...prev, ...patch, city: "", state: "" }));
    onChange({ ...patch, city: "", state: "" });
  };

  const handleSearch = () => {
    const next: VeiculosFilters = {
      ...draft,
      locationLabel: draft.lat != null ? draft.locationLabel : locationText,
      city: draft.city || locationText,
    };
    onChange(next);
    onSearch(next);
    setMenuOpen(false);
  };

  const updateDraft = (next: Partial<VeiculosFilters>) => {
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
                      ? "bg-[#22c55e]/10 text-[#86efac]"
                      : "bg-white/[0.03] text-white/80 hover:bg-white/[0.06]",
                  )}
                >
                  <SlidersHorizontal className="size-4" strokeWidth={1.75} />
                  {t("filters")}
                  {activeCount > 0 && (
                    <span className="flex size-5 items-center justify-center rounded-full bg-[#22c55e] text-[10px] font-bold text-[#041008]">
                      {activeCount}
                    </span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleSearch}
                  className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-[#22c55e] px-5 text-sm font-semibold text-[#041008] shadow-lg shadow-[#22c55e]/20 transition-all hover:bg-[#16a34a] sm:flex-none sm:px-6"
                >
                  <Search className="size-4" strokeWidth={2} />
                  {t("submit")}
                </button>
              </div>
            </div>

            {menuOpen && (
              <div className="mt-2 rounded-xl bg-white/[0.97] p-4 shadow-xl shadow-black/20">
                <FilterMenuPanel
                  draft={draft}
                  onChange={updateDraft}
                  onReset={() => {
                    setLocationText("");
                    setDraft(defaultVeiculosFilters);
                  }}
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
