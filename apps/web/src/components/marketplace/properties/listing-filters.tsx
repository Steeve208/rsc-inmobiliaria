"use client";

import { useTranslations } from "next-intl";
import {
  clearLocationFilters,
  resolvedLocationToFilters,
} from "@/lib/geocoding/types";
import { LocationAutocomplete } from "@/components/search/location-autocomplete";
import { FilterFold, FilterSection } from "@/components/marketplace/filter-section";
import type { ImoveisFilters, PropertyListing } from "@/features/imoveis/types";
import { cn } from "@/lib/utils";
import {
  POPULAR_PROPERTY_CITIES,
  PROPERTY_TYPE_OPTIONS,
  ROOM_OPTIONS,
  countByCity,
  countByTransaction,
  countByType,
} from "./listing-utils";

type Props = {
  filters: ImoveisFilters;
  catalog: PropertyListing[];
  onChange: (patch: Partial<ImoveisFilters>) => void;
};

export function ListingFilters({ filters, catalog, onChange }: Props) {
  const t = useTranslations("marketplace.listing");

  return (
    <div>
      <FilterSection title={t("status")}>
        <div className="space-y-2">
          {(
            [
              ["", "all"],
              ["buy", "sale"],
              ["rent", "rent"],
            ] as const
          ).map(([value, key]) => (
            <label
              key={key}
              className="flex cursor-pointer items-center justify-between gap-3 text-sm text-[#374151]"
            >
              <span className="inline-flex items-center gap-2">
                <input
                  type="radio"
                  name="property-status"
                  checked={filters.transaction === value}
                  onChange={() => onChange({ transaction: value })}
                  className="size-4 accent-[#2BB8A8]"
                />
                {t(`statusOptions.${key}`)}
              </span>
              <span className="text-xs text-[#9CA3AF]">
                {countByTransaction(catalog, value).toLocaleString()}
              </span>
            </label>
          ))}
        </div>
      </FilterSection>

      <FilterSection title={t("propertyType")}>
        <div className="space-y-2">
          {PROPERTY_TYPE_OPTIONS.map((type) => {
            const count = countByType(catalog, type);
            return (
              <label
                key={type}
                className="flex cursor-pointer items-center justify-between gap-3 text-sm text-[#374151]"
              >
                <span className="inline-flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={filters.type === type}
                    onChange={() =>
                      onChange({ type: filters.type === type ? "" : type })
                    }
                    className="size-4 accent-[#2BB8A8]"
                  />
                  {t(`types.${type}`)}
                </span>
                <span className="text-xs text-[#9CA3AF]">{count}</span>
              </label>
            );
          })}
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
            className="h-10 rounded-md border border-[#E5E7EB] px-3 text-sm text-[#0B1220] outline-none focus:border-[#2BB8A8]"
          />
          <input
            type="number"
            inputMode="numeric"
            value={filters.priceMax}
            onChange={(event) => onChange({ priceMax: event.target.value })}
            placeholder={t("maxPrice")}
            className="h-10 rounded-md border border-[#E5E7EB] px-3 text-sm text-[#0B1220] outline-none focus:border-[#2BB8A8]"
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
            onChange(resolvedLocationToFilters(location))
          }
          onLocationCleared={() =>
            onChange({
              city: "",
              state: "",
              neighborhood: "",
              country: "",
              lat: null,
              lng: null,
            })
          }
          className="rounded-md border border-[#E5E7EB] bg-white px-2"
        />
        <div className="mt-3 space-y-2">
          {POPULAR_PROPERTY_CITIES.map((place) => (
            <label
              key={place.city}
              className="flex cursor-pointer items-center justify-between gap-3 text-sm text-[#374151]"
            >
              <span className="inline-flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={filters.city.toLowerCase() === place.city.toLowerCase()}
                  onChange={() => {
                    const active =
                      filters.city.toLowerCase() === place.city.toLowerCase();
                    onChange(
                      active
                        ? clearLocationFilters()
                        : {
                            city: place.city,
                            country: place.country,
                            state: place.state,
                            neighborhood: "",
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
              <span className="text-xs text-[#9CA3AF]">
                {countByCity(catalog, place.city)}
              </span>
            </label>
          ))}
        </div>
      </FilterFold>

      <FilterFold title={t("bedrooms")}>
        <select
          value={filters.bedrooms}
          onChange={(event) => onChange({ bedrooms: event.target.value })}
          className="h-10 w-full rounded-md border border-[#E5E7EB] bg-white px-3 text-sm text-[#0B1220] outline-none focus:border-[#2BB8A8]"
        >
          <option value="">{t("any")}</option>
          {ROOM_OPTIONS.map((value) => (
            <option key={value} value={value}>
              {t("roomsPlus", { count: value })}
            </option>
          ))}
        </select>
      </FilterFold>

      <FilterFold title={t("bathrooms")}>
        <div className="flex flex-wrap gap-1.5">
          <Chip
            active={!filters.bathrooms}
            label={t("any")}
            onClick={() => onChange({ bathrooms: "" })}
          />
          {ROOM_OPTIONS.map((value) => (
            <Chip
              key={value}
              active={filters.bathrooms === value}
              label={t("roomsPlus", { count: value })}
              onClick={() =>
                onChange({ bathrooms: filters.bathrooms === value ? "" : value })
              }
            />
          ))}
        </div>
      </FilterFold>

      <FilterFold title={t("moreFilters")}>
        <div className="space-y-3">
          {(
            [
              ["verifiedOnly", "verified"],
              ["withPhotos", "photos"],
              ["withVirtualTour", "tour"],
              ["newThisWeek", "newWeek"],
              ["priceReduced", "reduced"],
            ] as const
          ).map(([field, key]) => (
            <label
              key={field}
              className="flex items-center justify-between gap-3 text-sm text-[#374151]"
            >
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

function Chip({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full px-3 py-1.5 text-xs font-semibold",
        active
          ? "bg-[#0B1220] text-white"
          : "bg-[#F3F4F6] text-[#4B5563] hover:bg-[#E5E7EB]",
      )}
    >
      {label}
    </button>
  );
}
