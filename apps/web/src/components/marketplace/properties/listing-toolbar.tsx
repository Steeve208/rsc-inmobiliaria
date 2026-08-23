"use client";

import { useState } from "react";
import {
  ChevronDown,
  LayoutGrid,
  List,
  Map,
  SlidersHorizontal,
} from "lucide-react";
import { useTranslations } from "next-intl";
import type { ImoveisFilters, ImoveisView, PropertySort } from "@/features/imoveis/types";
import { cn } from "@/lib/utils";
import { PROPERTY_TYPE_OPTIONS, ROOM_OPTIONS } from "./listing-utils";

type Props = {
  filters: ImoveisFilters;
  view: ImoveisView;
  onChange: (patch: Partial<ImoveisFilters>) => void;
  onViewChange: (view: ImoveisView) => void;
  onOpenMore?: () => void;
};

const SORTS: PropertySort[] = [
  "newest",
  "relevance",
  "price_asc",
  "price_desc",
  "area_desc",
];

export function ListingToolbar({
  filters,
  view,
  onChange,
  onViewChange,
  onOpenMore,
}: Props) {
  const t = useTranslations("marketplace.listing");

  return (
    <div className="space-y-3">
      <div className="hidden flex-wrap items-center gap-2 lg:flex">
        <FilterSelect
          label={t("propertyType")}
          value={filters.type}
          onChange={(type) => onChange({ type })}
          options={[
            { value: "", label: t("any") },
            ...PROPERTY_TYPE_OPTIONS.map((type) => ({
              value: type,
              label: t(`types.${type}`),
            })),
          ]}
        />
        <FilterSelect
          label={t("bedrooms")}
          value={filters.bedrooms}
          onChange={(bedrooms) => onChange({ bedrooms })}
          options={[
            { value: "", label: t("any") },
            ...ROOM_OPTIONS.map((value) => ({
              value,
              label: t("roomsPlus", { count: value }),
            })),
          ]}
        />
        <FilterSelect
          label={t("bathrooms")}
          value={filters.bathrooms}
          onChange={(bathrooms) => onChange({ bathrooms })}
          options={[
            { value: "", label: t("any") },
            ...ROOM_OPTIONS.map((value) => ({
              value,
              label: t("roomsPlus", { count: value }),
            })),
          ]}
        />
        <button
          type="button"
          onClick={onOpenMore}
          className="inline-flex h-9 items-center gap-1.5 rounded-md border border-[#E5E7EB] bg-white px-3 text-sm font-medium text-[#0B1220] hover:border-[#E8A84A] lg:hidden"
        >
          <SlidersHorizontal className="size-3.5" />
          {t("moreFilters")}
        </button>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex min-w-0 flex-1 gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {(
            [
              ["verifiedOnly", "verified"],
              ["withPhotos", "photos"],
              ["withVirtualTour", "tour"],
              ["priceReduced", "reduced"],
              ["newThisWeek", "newWeek"],
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
                  : "bg-white text-[#4B5563] ring-1 ring-[#E5E7EB] hover:ring-[#E8A84A]",
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
              onChange={(event) =>
                onChange({ sort: event.target.value as PropertySort })
              }
              className="rounded-md border border-[#E5E7EB] bg-white px-2 py-1.5 text-sm font-medium text-[#0B1220] outline-none"
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
                  view === id
                    ? "bg-[#0B1220] text-white"
                    : "text-[#6B7285] hover:text-[#0B1220]",
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
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Array<{ value: string; label: string }>;
}) {
  const [open, setOpen] = useState(false);
  const current = options.find((option) => option.value === value)?.label ?? label;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((state) => !state)}
        className={cn(
          "inline-flex h-9 items-center gap-1.5 rounded-md border bg-white px-3 text-sm font-medium",
          value
            ? "border-[#E8A84A] text-[#0B1220]"
            : "border-[#E5E7EB] text-[#0B1220]",
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
                  option.value === value
                    ? "font-semibold text-[#0B1220]"
                    : "text-[#4B5563]",
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
