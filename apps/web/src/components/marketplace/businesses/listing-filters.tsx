"use client";

import { useTranslations } from "next-intl";
import { LocationAutocomplete } from "@/components/search/location-autocomplete";
import { FilterFold, FilterSection } from "@/components/marketplace/filter-section";
import type { BusinessListing, NegociosFilters } from "@/features/negocios/types";
import { cn } from "@/lib/utils";
import {
  BUSINESS_CATEGORIES,
  POPULAR_BUSINESS_CITIES,
  countByCity,
  countByType,
} from "./listing-utils";

type Props = {
  filters: NegociosFilters;
  catalog: BusinessListing[];
  onChange: (patch: Partial<NegociosFilters>) => void;
};

function clearLocation(): Partial<NegociosFilters> {
  return { city: "", state: "", country: "", locationLabel: "", lat: null, lng: null };
}

export function ListingFilters({ filters, catalog, onChange }: Props) {
  const t = useTranslations("marketplace.businesses");

  return (
    <div>
      <FilterSection title={t("category")}>
        <div className="space-y-2">
          <label className="flex cursor-pointer items-center justify-between gap-3 text-sm text-[#374151]">
            <span className="inline-flex items-center gap-2">
              <input
                type="radio"
                name="business-type"
                checked={!filters.type}
                onChange={() => onChange({ type: "" })}
                className="size-4 accent-[#2BB8A8]"
              />
              {t("types.all")}
            </span>
            <span className="text-xs text-[#9CA3AF]">{catalog.length}</span>
          </label>
          {BUSINESS_CATEGORIES.map((type) => (
            <label
              key={type}
              className="flex cursor-pointer items-center justify-between gap-3 text-sm text-[#374151]"
            >
              <span className="inline-flex items-center gap-2">
                <input
                  type="radio"
                  name="business-type"
                  checked={filters.type === type}
                  onChange={() => onChange({ type })}
                  className="size-4 accent-[#2BB8A8]"
                />
                {t(`types.${type}`)}
              </span>
              <span className="text-xs text-[#9CA3AF]">{countByType(catalog, type)}</span>
            </label>
          ))}
        </div>
      </FilterSection>

      <FilterSection title={t("priceRange")}>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            inputMode="numeric"
            value={filters.priceMin}
            onChange={(event) => onChange({ priceMin: event.target.value })}
            placeholder={t("minPrice")}
            className="h-10 rounded-md border border-[#E5E7EB] px-3 text-sm outline-none focus:border-[#2BB8A8]"
          />
          <input
            type="number"
            inputMode="numeric"
            value={filters.priceMax}
            onChange={(event) => onChange({ priceMax: event.target.value })}
            placeholder={t("maxPrice")}
            className="h-10 rounded-md border border-[#E5E7EB] px-3 text-sm outline-none focus:border-[#2BB8A8]"
          />
        </div>
      </FilterSection>

      <FilterFold title={t("location")}>
        <LocationAutocomplete
          value={filters.locationLabel || filters.city}
          placeholder={t("locationPlaceholder")}
          theme="light"
          hideGps
          onValueChange={(value) => onChange({ locationLabel: value })}
          onPlaceResolved={(location) =>
            onChange({
              city: location.city,
              state: location.state,
              country: location.country,
              locationLabel: location.label,
              lat: location.lat,
              lng: location.lng,
            })
          }
          onLocationCleared={() => onChange(clearLocation())}
          className="rounded-md border border-[#E5E7EB] bg-white px-2"
        />
        <div className="mt-3 space-y-2">
          {POPULAR_BUSINESS_CITIES.map((place) => (
            <label
              key={place.city}
              className="flex cursor-pointer items-center justify-between gap-3 text-sm text-[#374151]"
            >
              <span className="inline-flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={filters.city.toLowerCase() === place.city.toLowerCase()}
                  onChange={() => {
                    const active = filters.city.toLowerCase() === place.city.toLowerCase();
                    onChange(
                      active
                        ? clearLocation()
                        : {
                            city: place.city,
                            country: place.country,
                            state: place.state,
                            locationLabel: place.city,
                            lat: null,
                            lng: null,
                          },
                    );
                  }}
                  className="size-4 accent-[#2BB8A8]"
                />
                {place.city}
              </span>
              <span className="text-xs text-[#9CA3AF]">{countByCity(catalog, place.city)}</span>
            </label>
          ))}
        </div>
      </FilterFold>

      <FilterFold title={t("revenueRange")}>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            inputMode="numeric"
            value={filters.revenueMin}
            onChange={(event) => onChange({ revenueMin: event.target.value })}
            placeholder={t("minRevenue")}
            className="h-10 rounded-md border border-[#E5E7EB] px-3 text-sm outline-none focus:border-[#2BB8A8]"
          />
          <input
            type="number"
            inputMode="numeric"
            value={filters.revenueMax}
            onChange={(event) => onChange({ revenueMax: event.target.value })}
            placeholder={t("maxRevenue")}
            className="h-10 rounded-md border border-[#E5E7EB] px-3 text-sm outline-none focus:border-[#2BB8A8]"
          />
        </div>
      </FilterFold>

      <FilterFold title={t("moreFilters")}>
        <div className="space-y-3">
          {(
            [
              ["verifiedOnly", "verified"],
              ["profitable", "profit"],
              ["withEquipment", "equipment"],
              ["franchise", "franchise"],
              ["sellerFinancing", "financing"],
              ["priceReduced", "reduced"],
            ] as const
          ).map(([field, key]) => (
            <label key={field} className="flex items-center justify-between gap-3 text-sm text-[#374151]">
              <span>{t(`pills.${key}`)}</span>
              <button
                type="button"
                role="switch"
                aria-checked={filters[field]}
                onClick={() => onChange({ [field]: !filters[field] })}
                className={cn(
                  "relative h-6 w-11 rounded-full transition",
                  filters[field] ? "bg-[#2BB8A8]" : "bg-[#D1D5DB]",
                )}
              >
                <span
                  className={cn(
                    "absolute top-0.5 size-5 rounded-full bg-white shadow transition",
                    filters[field] ? "left-5" : "left-0.5",
                  )}
                />
              </button>
            </label>
          ))}
        </div>
      </FilterFold>
    </div>
  );
}
