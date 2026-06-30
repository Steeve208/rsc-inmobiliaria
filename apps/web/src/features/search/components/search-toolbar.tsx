"use client";

import { useTranslations } from "next-intl";
import {
  Building2,
  Car,
  ChevronDown,
  LayoutGrid,
  List,
  Map as MapIcon,
  MapPin,
  Rocket,
  Search,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { SearchCategory, SearchFilters, SearchView } from "../types";

type Props = {
  filters: SearchFilters;
  view: SearchView;
  onFiltersChange: (next: Partial<SearchFilters>) => void;
  onViewChange: (view: SearchView) => void;
  onSearch: () => void;
};

export function SearchToolbar({
  filters,
  view,
  onFiltersChange,
  onViewChange,
  onSearch,
}: Props) {
  const t = useTranslations("search");

  const tabs: { id: SearchCategory; icon: typeof Building2; label: string }[] = [
    { id: "properties", icon: Building2, label: t("tabs.properties") },
    { id: "vehicles", icon: Car, label: t("tabs.vehicles") },
    { id: "launches", icon: Rocket, label: t("tabs.launches") },
  ];

  const views: { id: SearchView; icon: typeof List; label: string }[] = [
    { id: "list", icon: List, label: t("views.list") },
    { id: "map", icon: MapIcon, label: t("views.map") },
    { id: "gallery", icon: LayoutGrid, label: t("views.gallery") },
  ];

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-t-xl bg-[#0f172a]">
        <div className="flex">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onFiltersChange({ category: tab.id })}
                className={cn(
                  "flex flex-1 items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-colors",
                  filters.category === tab.id
                    ? "bg-[#1d4ed8] text-white"
                    : "text-white/60 hover:bg-white/5 hover:text-white",
                )}
              >
                <Icon className="size-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="rounded-b-xl rounded-tr-xl bg-white p-2 shadow-xl sm:p-3">
        <div className="flex flex-col gap-2 lg:flex-row lg:items-center">
          <div className="flex flex-1 items-center gap-2 rounded-lg border border-gray-200 px-3 py-2.5">
            <MapPin className="size-4 shrink-0 text-gray-400" />
            <input
              type="text"
              value={filters.city}
              onChange={(e) => onFiltersChange({ city: e.target.value })}
              placeholder={t("quick.locationPlaceholder")}
              className="w-full bg-transparent text-sm text-gray-800 outline-none placeholder:text-gray-400"
            />
            <ChevronDown className="size-4 shrink-0 text-gray-400" />
          </div>
          <div className="flex flex-1 items-center gap-2 rounded-lg border border-gray-200 px-3 py-2.5">
            <Search className="size-4 shrink-0 text-gray-400" />
            <input
              type="text"
              value={filters.query}
              onChange={(e) => onFiltersChange({ query: e.target.value })}
              placeholder={t("quick.queryPlaceholder")}
              className="w-full bg-transparent text-sm text-gray-800 outline-none placeholder:text-gray-400"
            />
            <ChevronDown className="size-4 shrink-0 text-gray-400" />
          </div>
          <button
            type="button"
            onClick={onSearch}
            className="h-11 shrink-0 rounded-lg bg-[#1d4ed8] px-8 text-sm font-semibold text-white transition-colors hover:bg-[#1e40af]"
          >
            {t("quick.submit")}
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-white/50">{t("advancedTitle")}</p>
        <div className="flex rounded-lg border border-white/10 bg-[#081128]/80 p-1">
          {views.map((v) => {
            const Icon = v.icon;
            return (
              <button
                key={v.id}
                type="button"
                onClick={() => onViewChange(v.id)}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors sm:text-sm",
                  view === v.id
                    ? "bg-[#1d4ed8] text-white"
                    : "text-white/60 hover:text-white",
                )}
              >
                <Icon className="size-3.5" />
                {v.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
