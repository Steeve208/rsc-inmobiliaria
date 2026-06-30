"use client";

import { useTranslations } from "next-intl";
import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { SearchFilters } from "../types";

type Props = {
  filters: SearchFilters;
  onChange: (next: Partial<SearchFilters>) => void;
  onReset: () => void;
  onApply: () => void;
};

function FilterField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs text-white/60">{label}</Label>
      {children}
    </div>
  );
}

const inputClass =
  "border-white/10 bg-[#020617]/60 text-white placeholder:text-white/30";

export function SearchFiltersPanel({
  filters,
  onChange,
  onReset,
  onApply,
}: Props) {
  const t = useTranslations("search.filters");

  return (
    <aside className="rounded-xl border border-white/10 bg-[#081128]/80 p-5 backdrop-blur-sm">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-white">{t("title")}</h2>
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-1 text-xs text-white/50 hover:text-white"
        >
          <RotateCcw className="size-3" />
          {t("reset")}
        </button>
      </div>

      <div className="space-y-4">
        <FilterField label={t("country")}>
          <Input
            value={filters.country}
            onChange={(e) => onChange({ country: e.target.value })}
            placeholder={t("countryPlaceholder")}
            className={inputClass}
          />
        </FilterField>

        <FilterField label={t("state")}>
          <Input
            value={filters.state}
            onChange={(e) => onChange({ state: e.target.value })}
            placeholder={t("statePlaceholder")}
            className={inputClass}
          />
        </FilterField>

        <FilterField label={t("city")}>
          <Input
            value={filters.city}
            onChange={(e) => onChange({ city: e.target.value })}
            placeholder={t("cityPlaceholder")}
            className={inputClass}
          />
        </FilterField>

        <FilterField label={t("neighborhood")}>
          <Input
            value={filters.neighborhood}
            onChange={(e) => onChange({ neighborhood: e.target.value })}
            placeholder={t("neighborhoodPlaceholder")}
            className={inputClass}
          />
        </FilterField>

        <div className="grid grid-cols-2 gap-3">
          <FilterField label={t("priceMin")}>
            <Input
              type="number"
              value={filters.priceMin}
              onChange={(e) => onChange({ priceMin: e.target.value })}
              placeholder="0"
              className={inputClass}
            />
          </FilterField>
          <FilterField label={t("priceMax")}>
            <Input
              type="number"
              value={filters.priceMax}
              onChange={(e) => onChange({ priceMax: e.target.value })}
              placeholder="9999999"
              className={inputClass}
            />
          </FilterField>
        </div>

        <FilterField label={t("type")}>
          <select
            value={filters.type}
            onChange={(e) => onChange({ type: e.target.value })}
            className="h-8 w-full rounded-lg border border-white/10 bg-[#020617]/60 px-2.5 text-sm text-white outline-none"
          >
            <option value="">{t("typeAll")}</option>
            <option value="house">{t("types.house")}</option>
            <option value="apartment">{t("types.apartment")}</option>
            <option value="land">{t("types.land")}</option>
            <option value="car">{t("types.car")}</option>
            <option value="motorcycle">{t("types.motorcycle")}</option>
            <option value="truck">{t("types.truck")}</option>
          </select>
        </FilterField>

        <div className="grid grid-cols-2 gap-3">
          <FilterField label={t("bedrooms")}>
            <Input
              type="number"
              min={0}
              value={filters.bedrooms}
              onChange={(e) => onChange({ bedrooms: e.target.value })}
              className={inputClass}
            />
          </FilterField>
          <FilterField label={t("garage")}>
            <Input
              type="number"
              min={0}
              value={filters.garage}
              onChange={(e) => onChange({ garage: e.target.value })}
              className={inputClass}
            />
          </FilterField>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <FilterField label={t("areaMin")}>
            <Input
              type="number"
              value={filters.areaMin}
              onChange={(e) => onChange({ areaMin: e.target.value })}
              className={inputClass}
            />
          </FilterField>
          <FilterField label={t("areaMax")}>
            <Input
              type="number"
              value={filters.areaMax}
              onChange={(e) => onChange({ areaMax: e.target.value })}
              className={inputClass}
            />
          </FilterField>
        </div>

        <FilterField label={t("date")}>
          <Input
            type="date"
            value={filters.date}
            onChange={(e) => onChange({ date: e.target.value })}
            className={inputClass}
          />
        </FilterField>

        <FilterField label={t("company")}>
          <Input
            value={filters.company}
            onChange={(e) => onChange({ company: e.target.value })}
            placeholder={t("companyPlaceholder")}
            className={inputClass}
          />
        </FilterField>

        <div className="space-y-3 pt-1">
          <label className="flex items-center gap-2.5">
            <Checkbox
              checked={filters.pool}
              onCheckedChange={(checked) =>
                onChange({ pool: checked === true })
              }
            />
            <span className="text-sm text-white/80">{t("pool")}</span>
          </label>
          <label className="flex items-center gap-2.5">
            <Checkbox
              checked={filters.financing}
              onCheckedChange={(checked) =>
                onChange({ financing: checked === true })
              }
            />
            <span className="text-sm text-white/80">
              {t("financingAvailable")}
            </span>
          </label>
        </div>

        <Button
          type="button"
          onClick={onApply}
          className="mt-2 w-full bg-[#1d4ed8] hover:bg-[#1e40af]"
        >
          {t("apply")}
        </Button>
      </div>
    </aside>
  );
}
