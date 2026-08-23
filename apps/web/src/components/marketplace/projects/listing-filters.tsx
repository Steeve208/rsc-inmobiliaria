"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import { LocationAutocomplete } from "@/components/search/location-autocomplete";
import type { ProjetosFilters, ProjectListing } from "@/features/projetos/types";
import { cn } from "@/lib/utils";
import {
  POPULAR_PROJECT_CITIES,
  PROJECT_STATUS_OPTIONS,
  PROJECT_TYPE_OPTIONS,
  countByCity,
  countByStatus,
  countByType,
  deliveryYears,
  priceExtent,
  priceHistogram,
} from "./listing-utils";

type Props = {
  filters: ProjetosFilters;
  catalog: ProjectListing[];
  onChange: (patch: Partial<ProjetosFilters>) => void;
};

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-b border-[#EFECE4] py-3.5 last:border-b-0">
      <h3 className="mb-2 text-[13px] font-bold text-[#0B1220]">{title}</h3>
      {children}
    </section>
  );
}

function clearProjectLocation(): Partial<ProjetosFilters> {
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
  const t = useTranslations("marketplace.projects");
  const { min, max } = useMemo(() => priceExtent(catalog), [catalog]);
  const bars = useMemo(() => priceHistogram(catalog), [catalog]);
  const years = useMemo(() => deliveryYears(), []);
  const minValue = Number(filters.priceMin || min);
  const maxValue = Number(filters.priceMax || max);

  return (
    <div>
      <Section title={t("location")}>
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
          onLocationCleared={() => onChange(clearProjectLocation())}
          className="rounded-md border border-[#E5E7EB] bg-white px-2"
        />
        <div className="mt-3 space-y-2">
          {POPULAR_PROJECT_CITIES.map((place) => (
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
                        ? clearProjectLocation()
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
                  className="size-4 accent-[#E8A84A]"
                />
                {place.city}
              </span>
              <span className="text-xs text-[#9CA3AF]">
                {countByCity(catalog, place.city)}
              </span>
            </label>
          ))}
        </div>
      </Section>

      <Section title={t("propertyType")}>
        <div className="space-y-2">
          <label className="flex cursor-pointer items-center justify-between gap-3 text-sm text-[#374151]">
            <span className="inline-flex items-center gap-2">
              <input
                type="radio"
                name="project-type"
                checked={!filters.type}
                onChange={() => onChange({ type: "" })}
                className="size-4 accent-[#E8A84A]"
              />
              {t("types.all")}
            </span>
            <span className="text-xs text-[#9CA3AF]">{catalog.length}</span>
          </label>
          {PROJECT_TYPE_OPTIONS.map((type) => (
            <label
              key={type}
              className="flex cursor-pointer items-center justify-between gap-3 text-sm text-[#374151]"
            >
              <span className="inline-flex items-center gap-2">
                <input
                  type="radio"
                  name="project-type"
                  checked={filters.type === type}
                  onChange={() => onChange({ type })}
                  className="size-4 accent-[#E8A84A]"
                />
                {t(`types.${type}`)}
              </span>
              <span className="text-xs text-[#9CA3AF]">
                {countByType(catalog, type)}
              </span>
            </label>
          ))}
        </div>
      </Section>

      <Section title={t("status")}>
        <div className="space-y-2">
          {PROJECT_STATUS_OPTIONS.map((status) => (
            <label
              key={status}
              className="flex cursor-pointer items-center justify-between gap-3 text-sm text-[#374151]"
            >
              <span className="inline-flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={filters.status === status}
                  onChange={() =>
                    onChange({ status: filters.status === status ? "" : status })
                  }
                  className="size-4 accent-[#E8A84A]"
                />
                {t(`statuses.${status}`)}
              </span>
              <span className="text-xs text-[#9CA3AF]">
                {countByStatus(catalog, status)}
              </span>
            </label>
          ))}
        </div>
      </Section>

      <Section title={t("priceRange")}>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            inputMode="numeric"
            value={filters.priceMin}
            onChange={(event) => onChange({ priceMin: event.target.value })}
            placeholder={t("minPrice")}
            className="h-10 rounded-md border border-[#E5E7EB] px-3 text-sm text-[#0B1220] outline-none focus:border-[#E8A84A]"
          />
          <input
            type="number"
            inputMode="numeric"
            value={filters.priceMax}
            onChange={(event) => onChange({ priceMax: event.target.value })}
            placeholder={t("maxPrice")}
            className="h-10 rounded-md border border-[#E5E7EB] px-3 text-sm text-[#0B1220] outline-none focus:border-[#E8A84A]"
          />
        </div>
        <div className="mt-3 flex h-12 items-end gap-0.5">
          {bars.map((ratio, index) => (
            <div
              key={index}
              className="flex-1 rounded-t-sm bg-[#E8A84A]/70"
              style={{ height: `${Math.max(12, ratio * 100)}%` }}
            />
          ))}
        </div>
        <div className="mt-2 grid grid-cols-2 gap-2">
          <input
            type="range"
            min={min}
            max={max}
            value={minValue}
            onChange={(event) =>
              onChange({
                priceMin: String(Math.min(Number(event.target.value), maxValue)),
              })
            }
            className="col-span-2 accent-[#E8A84A]"
          />
          <input
            type="range"
            min={min}
            max={max}
            value={maxValue}
            onChange={(event) =>
              onChange({
                priceMax: String(Math.max(Number(event.target.value), minValue)),
              })
            }
            className="col-span-2 accent-[#E8A84A]"
          />
        </div>
      </Section>

      <Section title={t("deliveryDate")}>
        <div className="grid grid-cols-2 gap-2">
          <select
            value={filters.deliveryFrom}
            onChange={(event) => onChange({ deliveryFrom: event.target.value })}
            className="h-10 rounded-md border border-[#E5E7EB] bg-white px-3 text-sm text-[#0B1220] outline-none focus:border-[#E8A84A]"
          >
            <option value="">{t("from")}</option>
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
          <select
            value={filters.deliveryTo}
            onChange={(event) => onChange({ deliveryTo: event.target.value })}
            className="h-10 rounded-md border border-[#E5E7EB] bg-white px-3 text-sm text-[#0B1220] outline-none focus:border-[#E8A84A]"
          >
            <option value="">{t("to")}</option>
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
      </Section>

      <Section title={t("moreFilters")}>
        <div className="space-y-3">
          {(
            [
              ["verifiedOnly", "verified"],
              ["paymentPlan", "plan"],
              ["highRoi", "roi"],
              ["luxury", "luxury"],
              ["sustainable", "eco"],
              ["withAmenities", "amenities"],
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
                  filters[field] ? "bg-[#E8A84A]" : "bg-[#D1D5DB]",
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
      </Section>
    </div>
  );
}
