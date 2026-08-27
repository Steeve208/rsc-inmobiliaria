"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import { FilterFold, FilterSection } from "@/components/marketplace/filter-section";
import type { ServiceListing, ServicesFilters } from "@/features/services/types";
import { cn } from "@/lib/utils";
import {
  SERVICE_CATEGORIES,
  countByType,
  serviceLocationCities,
  serviceLocationCountries,
  serviceLocationPatch,
  serviceLocationRegions,
} from "./listing-utils";

type Props = {
  filters: ServicesFilters;
  catalog: ServiceListing[];
  onChange: (patch: Partial<ServicesFilters>) => void;
};

function FilterSelect({
  value,
  disabled,
  placeholder,
  options,
  onChange,
}: {
  value: string;
  disabled?: boolean;
  placeholder: string;
  options: Array<{ value: string; label: string }>;
  onChange: (value: string) => void;
}) {
  return (
    <select
      value={value}
      disabled={disabled}
      onChange={(event) => onChange(event.target.value)}
      className="h-10 w-full rounded-md border border-[#E5E7EB] bg-white px-3 text-sm text-[#0B1220] outline-none focus:border-[#2BB8A8] disabled:cursor-not-allowed disabled:bg-[#F3F4F6] disabled:text-[#9CA3AF]"
    >
      <option value="">{placeholder}</option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

export function ListingFilters({ filters, catalog, onChange }: Props) {
  const t = useTranslations("marketplace.services");
  const countries = useMemo(() => serviceLocationCountries(catalog), [catalog]);
  const regions = useMemo(
    () => serviceLocationRegions(catalog, filters.country),
    [catalog, filters.country],
  );
  const cities = useMemo(
    () => serviceLocationCities(catalog, filters.country, filters.state),
    [catalog, filters.country, filters.state],
  );

  return (
    <div>
      <FilterSection title={t("category")}>
        <div className="space-y-2">
          <label className="flex cursor-pointer items-center justify-between gap-3 text-sm text-[#374151]">
            <span className="inline-flex items-center gap-2">
              <input
                type="radio"
                name="service-type"
                checked={!filters.type}
                onChange={() => onChange({ type: "", cycle: "" })}
                className="size-4 accent-[#2BB8A8]"
              />
              {t("types.all")}
            </span>
            <span className="text-xs text-[#9CA3AF]">{catalog.length}</span>
          </label>
          {SERVICE_CATEGORIES.map((type) => (
            <label
              key={type}
              className="flex cursor-pointer items-center justify-between gap-3 text-sm text-[#374151]"
            >
              <span className="inline-flex items-center gap-2">
                <input
                  type="radio"
                  name="service-type"
                  checked={filters.type === type}
                  onChange={() => onChange({ type, cycle: "" })}
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
        <div className="space-y-2">
          <FilterSelect
            value={filters.country}
            placeholder={t("selectCountry")}
            options={countries}
            onChange={(country) => onChange(serviceLocationPatch({ country }))}
          />
          <FilterSelect
            value={filters.state}
            disabled={!filters.country}
            placeholder={t("selectRegion")}
            options={regions}
            onChange={(state) =>
              onChange(serviceLocationPatch({ country: filters.country, state }))
            }
          />
          <FilterSelect
            value={filters.city}
            disabled={!filters.country || !filters.state}
            placeholder={t("selectCity")}
            options={cities}
            onChange={(city) =>
              onChange(
                serviceLocationPatch({
                  country: filters.country,
                  state: filters.state,
                  city,
                }),
              )
            }
          />
        </div>
      </FilterFold>

      <FilterFold title={t("availability")}>
        <div className="space-y-3">
          {(
            [
              ["availableToday", "today"],
              ["availableWeek", "week"],
              ["online", "online"],
              ["verifiedOnly", "verified"],
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
