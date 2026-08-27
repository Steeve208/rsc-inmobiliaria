"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import { LocationAutocomplete } from "@/components/search/location-autocomplete";
import { FilterFold, FilterSection } from "@/components/marketplace/filter-section";
import type { VeiculosFilters, VehicleListing } from "@/features/veiculos/types";
import { cn } from "@/lib/utils";
import {
  FUELS,
  KM_OPTIONS,
  POPULAR_VEHICLE_CITIES,
  TRANSMISSIONS,
  VEHICLE_TYPE_CHIPS,
  countByCity,
  countByType,
  uniqueMakes,
  uniqueModels,
  yearOptions,
} from "./listing-utils";

type Props = {
  filters: VeiculosFilters;
  catalog: VehicleListing[];
  onChange: (patch: Partial<VeiculosFilters>) => void;
};

function clearVehicleLocation(): Partial<VeiculosFilters> {
  return {
    city: "",
    state: "",
    country: "",
    locationLabel: "",
    lat: null,
    lng: null,
  };
}

export function ListingFilters({ filters, catalog, onChange }: Props) {
  const t = useTranslations("marketplace.vehicles");
  const makes = useMemo(() => uniqueMakes(catalog), [catalog]);
  const models = useMemo(
    () => uniqueModels(catalog, filters.make),
    [catalog, filters.make],
  );
  const years = useMemo(() => yearOptions(), []);

  return (
    <div>
      <FilterSection title={t("vehicleType")}>
        <div className="space-y-2">
          <label className="flex cursor-pointer items-center justify-between gap-3 text-sm text-[#374151]">
            <span className="inline-flex items-center gap-2">
              <input
                type="radio"
                name="vehicle-type"
                checked={!filters.type}
                onChange={() => onChange({ type: "" })}
                className="size-4 accent-[#2BB8A8]"
              />
              {t("types.all")}
            </span>
            <span className="text-xs text-[#9CA3AF]">
              {catalog.length.toLocaleString()}
            </span>
          </label>
          {VEHICLE_TYPE_CHIPS.map((type) => (
            <label
              key={type}
              className="flex cursor-pointer items-center justify-between gap-3 text-sm text-[#374151]"
            >
              <span className="inline-flex items-center gap-2">
                <input
                  type="radio"
                  name="vehicle-type"
                  checked={filters.type === type}
                  onChange={() => onChange({ type })}
                  className="size-4 accent-[#2BB8A8]"
                />
                {t(`types.${type}`)}
              </span>
              <span className="text-xs text-[#9CA3AF]">
                {countByType(catalog, type)}
              </span>
            </label>
          ))}
        </div>
      </FilterSection>

      <FilterSection title={t("make")}>
        <select
          value={filters.make}
          onChange={(event) =>
            onChange({ make: event.target.value, model: "" })
          }
          className="h-10 w-full rounded-md border border-[#E5E7EB] bg-white px-3 text-sm text-[#0B1220] outline-none focus:border-[#2BB8A8]"
        >
          <option value="">{t("any")}</option>
          {makes.map((make) => (
            <option key={make} value={make}>
              {make}
            </option>
          ))}
        </select>
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
            onChange({
              city: location.city,
              state: location.state,
              country: location.country,
              locationLabel: location.label,
              lat: location.lat,
              lng: location.lng,
            })
          }
          onLocationCleared={() => onChange(clearVehicleLocation())}
          className="rounded-md border border-[#E5E7EB] bg-white px-2"
        />
        <div className="mt-3 space-y-2">
          {POPULAR_VEHICLE_CITIES.map((place) => (
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
                        ? clearVehicleLocation()
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
              <span className="text-xs text-[#9CA3AF]">
                {countByCity(catalog, place.city)}
              </span>
            </label>
          ))}
        </div>
      </FilterFold>

      <FilterFold title={t("model")}>
        <select
          value={filters.model}
          onChange={(event) => onChange({ model: event.target.value })}
          className="h-10 w-full rounded-md border border-[#E5E7EB] bg-white px-3 text-sm text-[#0B1220] outline-none focus:border-[#2BB8A8]"
        >
          <option value="">{t("any")}</option>
          {models.map((model) => (
            <option key={model} value={model}>
              {model}
            </option>
          ))}
        </select>
      </FilterFold>

      <FilterFold title={t("year")}>
        <div className="grid grid-cols-2 gap-2">
          <select
            value={filters.yearMin}
            onChange={(event) => onChange({ yearMin: event.target.value })}
            className="h-10 rounded-md border border-[#E5E7EB] bg-white px-3 text-sm text-[#0B1220] outline-none focus:border-[#2BB8A8]"
          >
            <option value="">{t("min")}</option>
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
          <select
            value={filters.yearMax}
            onChange={(event) => onChange({ yearMax: event.target.value })}
            className="h-10 rounded-md border border-[#E5E7EB] bg-white px-3 text-sm text-[#0B1220] outline-none focus:border-[#2BB8A8]"
          >
            <option value="">{t("max")}</option>
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
      </FilterFold>

      <FilterFold title={t("kilometers")}>
        <div className="grid grid-cols-2 gap-2">
          <select
            value={filters.mileageMin}
            onChange={(event) => onChange({ mileageMin: event.target.value })}
            className="h-10 rounded-md border border-[#E5E7EB] bg-white px-3 text-sm text-[#0B1220] outline-none focus:border-[#2BB8A8]"
          >
            <option value="">{t("min")}</option>
            {KM_OPTIONS.map((value) => (
              <option key={value} value={value}>
                {Number(value).toLocaleString()}
              </option>
            ))}
          </select>
          <select
            value={filters.mileageMax}
            onChange={(event) => onChange({ mileageMax: event.target.value })}
            className="h-10 rounded-md border border-[#E5E7EB] bg-white px-3 text-sm text-[#0B1220] outline-none focus:border-[#2BB8A8]"
          >
            <option value="">{t("max")}</option>
            {KM_OPTIONS.map((value) => (
              <option key={value} value={value}>
                {Number(value).toLocaleString()}
              </option>
            ))}
          </select>
        </div>
      </FilterFold>

      <FilterFold title={t("transmission")}>
        <div className="space-y-2">
          {TRANSMISSIONS.map((value) => (
            <label
              key={value}
              className="flex cursor-pointer items-center justify-between gap-3 text-sm text-[#374151]"
            >
              <span className="inline-flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={filters.transmission === value}
                  onChange={() =>
                    onChange({
                      transmission: filters.transmission === value ? "" : value,
                    })
                  }
                  className="size-4 accent-[#2BB8A8]"
                />
                {t(`transmissions.${value}`)}
              </span>
            </label>
          ))}
        </div>
      </FilterFold>

      <FilterFold title={t("fuel")}>
        <div className="space-y-2">
          {FUELS.map((value) => (
            <label
              key={value}
              className="flex cursor-pointer items-center justify-between gap-3 text-sm text-[#374151]"
            >
              <span className="inline-flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={filters.fuel === value}
                  onChange={() =>
                    onChange({ fuel: filters.fuel === value ? "" : value })
                  }
                  className="size-4 accent-[#2BB8A8]"
                />
                {t(`fuels.${value}`)}
              </span>
            </label>
          ))}
        </div>
      </FilterFold>

      <FilterFold title={t("moreFilters")}>
        <div className="space-y-3">
          {(
            [
              ["verifiedOnly", "verified"],
              ["withPhotos", "photos"],
              ["lowMileage", "lowKm"],
              ["priceReduced", "reduced"],
              ["newThisWeek", "newWeek"],
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
