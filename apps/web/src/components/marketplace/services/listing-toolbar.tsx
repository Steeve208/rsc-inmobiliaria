"use client";

import { useState } from "react";
import { ChevronDown, LayoutGrid, List, Map } from "lucide-react";
import { useTranslations } from "next-intl";
import type {
  ServiceCategory,
  ServiceListing,
  ServiceSort,
  ServicesFilters,
  ServicesView,
} from "@/features/services/types";
import { cn } from "@/lib/utils";
import {
  POPULAR_SERVICE_TYPES,
  serviceLocationCities,
  serviceLocationCountries,
  serviceLocationPatch,
  serviceLocationRegions,
} from "./listing-utils";

type Props = {
  filters: ServicesFilters;
  catalog: ServiceListing[];
  view: ServicesView;
  onChange: (patch: Partial<ServicesFilters>) => void;
  onViewChange: (view: ServicesView) => void;
};

const SORTS: ServiceSort[] = ["recommended", "newest", "price_asc"];

export function ListingToolbar({ filters, catalog, view, onChange, onViewChange }: Props) {
  const t = useTranslations("marketplace.services");
  const countries = serviceLocationCountries(catalog);
  const regions = serviceLocationRegions(catalog, filters.country);
  const cities = serviceLocationCities(catalog, filters.country, filters.state);

  return (
    <div className="space-y-3">
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[#6B7285]">
          {t("popular")}
        </p>
        <div className="flex gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {POPULAR_SERVICE_TYPES.map((type) => (
            <button
              key={type}
              type="button"
              onClick={() =>
                onChange({
                  type: filters.type === type ? "" : type,
                  cycle: "",
                })
              }
              className={cn(
                "shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold",
                filters.type === type
                  ? "bg-[#0B1220] text-white"
                  : "bg-white text-[#4B5563] ring-1 ring-[#E5E7EB] hover:ring-[#2BB8A8]",
              )}
            >
              {t(`types.${type}`)}
            </button>
          ))}
        </div>
      </div>

      <div className="hidden flex-wrap items-center gap-2 lg:flex">
        <FilterSelect
          label={t("country")}
          value={filters.country}
          onChange={(country) => onChange(serviceLocationPatch({ country }))}
          options={[
            { value: "", label: t("any") },
            ...countries,
          ]}
        />
        <FilterSelect
          label={t("region")}
          value={filters.state}
          disabled={!filters.country}
          onChange={(state) =>
            onChange(serviceLocationPatch({ country: filters.country, state }))
          }
          options={[
            { value: "", label: t("any") },
            ...regions,
          ]}
        />
        <FilterSelect
          label={t("city")}
          value={filters.city}
          disabled={!filters.country || !filters.state}
          onChange={(city) =>
            onChange(
              serviceLocationPatch({
                country: filters.country,
                state: filters.state,
                city,
              }),
            )
          }
          options={[
            { value: "", label: t("any") },
            ...cities,
          ]}
        />
        <FilterSelect
          label={t("category")}
          value={filters.type}
          onChange={(type) => onChange({ type: type as ServiceCategory | "", cycle: "" })}
          options={[
            { value: "", label: t("types.all") },
            ...POPULAR_SERVICE_TYPES.map((type) => ({
              value: type,
              label: t(`types.${type}`),
            })),
          ]}
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex min-w-0 flex-1 gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {(
            [
              ["availableToday", "today"],
              ["availableWeek", "week"],
              ["online", "online"],
              ["verifiedOnly", "verified"],
            ] as const
          ).map(([field, key]) => (
            <button
              key={field}
              type="button"
              onClick={() => onChange({ [field]: !filters[field] })}
              className={cn(
                "shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold",
                filters[field]
                  ? "bg-[#0B1220] text-white"
                  : "bg-white text-[#4B5563] ring-1 ring-[#E5E7EB] hover:ring-[#2BB8A8]",
              )}
            >
              {t(`pills.${key}`)}
            </button>
          ))}
        </div>
        <div className="hidden items-center gap-2 lg:flex">
          <label className="inline-flex items-center gap-2 text-sm text-[#4B5563]">
            <span>{t("sortBy")}</span>
            <select
              value={filters.sort}
              onChange={(event) => onChange({ sort: event.target.value as ServiceSort })}
              className="rounded-md border border-[#E5E7EB] bg-white px-2 py-1.5 text-sm font-medium outline-none"
            >
              {SORTS.map((sort) => (
                <option key={sort} value={sort}>
                  {t(`sort.${sort}`)}
                </option>
              ))}
            </select>
          </label>
          <div className="inline-flex rounded-md border border-[#E5E7EB] bg-white p-0.5">
            {(
              [
                ["grid", LayoutGrid],
                ["list", List],
                ["map", Map],
              ] as const
            ).map(([id, Icon]) => (
              <button
                key={id}
                type="button"
                onClick={() => onViewChange(id)}
                className={cn(
                  "inline-flex size-8 items-center justify-center rounded",
                  view === id ? "bg-[#0B1220] text-white" : "text-[#6B7285] hover:text-[#0B1220]",
                )}
                aria-label={t(`views.${id}`)}
              >
                <Icon className="size-4" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function FilterSelect({
  label,
  value,
  disabled,
  onChange,
  options,
}: {
  label: string;
  value: string;
  disabled?: boolean;
  onChange: (value: string) => void;
  options: Array<{ value: string; label: string }>;
}) {
  const [open, setOpen] = useState(false);
  const current = options.find((option) => option.value === value)?.label ?? label;

  return (
    <div className="relative">
      <button
        type="button"
        disabled={disabled}
        onClick={() => {
          if (disabled) return;
          setOpen((state) => !state);
        }}
        className={cn(
          "inline-flex h-9 items-center gap-1.5 rounded-md border bg-white px-3 text-sm font-medium",
          disabled && "cursor-not-allowed bg-[#F3F4F6] text-[#9CA3AF]",
          !disabled && value ? "border-[#2BB8A8] text-[#0B1220]" : "border-[#E5E7EB] text-[#0B1220]",
        )}
      >
        {label}
        {value ? `: ${current}` : ""}
        <ChevronDown className="size-3.5 text-[#6B7285]" />
      </button>
      {open ? (
        <>
          <button
            type="button"
            className="fixed inset-0 z-20 cursor-default"
            aria-label="Close"
            onClick={() => setOpen(false)}
          />
          <div className="absolute left-0 top-full z-30 mt-1 min-w-[180px] rounded-md border border-[#E5E7EB] bg-white py-1 shadow-lg">
            {options.map((option) => (
              <button
                key={option.value || "any"}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setOpen(false);
                }}
                className={cn(
                  "block w-full px-3 py-2 text-left text-sm hover:bg-[#F8F4EA]",
                  option.value === value ? "font-semibold text-[#0B1220]" : "text-[#4B5563]",
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
        </>
      ) : null}
    </div>
  );
}
