"use client";

import dynamic from "next/dynamic";
import { Maximize2 } from "lucide-react";
import { useTranslations } from "next-intl";
import type { VeiculosFilters, VehicleListing } from "@/features/veiculos/types";
import { formatMarketplacePrice } from "@/lib/marketplace/format";
import {
  EXPLORE_AREAS,
  POPULAR_SEARCHES,
  averagePrice,
  insightCity,
} from "./listing-utils";

const VehicleMap = dynamic(
  () =>
    import("@/features/veiculos/components/vehicle-map").then(
      (mod) => mod.VehicleMap,
    ),
  {
    ssr: false,
    loading: () => <div className="h-[220px] animate-pulse rounded-lg bg-[#E5E7EB]" />,
  },
);

type Props = {
  results: VehicleListing[];
  catalog: VehicleListing[];
  filters: VeiculosFilters;
  highlightedId: string | null;
  onHighlight: (id: string | null) => void;
  onSelectCity: (city: string, country: string, state: string) => void;
  onSearchChip: (query: string) => void;
  onExpandMap: () => void;
};

export function ListingAside({
  results,
  catalog,
  filters,
  highlightedId,
  onHighlight,
  onSelectCity,
  onSearchChip,
  onExpandMap,
}: Props) {
  const t = useTranslations("marketplace.vehicles");
  const city = insightCity(filters, results.length > 0 ? results : catalog);
  const cityItems = (results.length > 0 ? results : catalog).filter(
    (item) => item.city.toLowerCase() === city.toLowerCase(),
  );
  const avg = averagePrice(cityItems.length > 0 ? cityItems : results);
  const currency = cityItems[0]?.currency ?? results[0]?.currency ?? "BRL";

  return (
    <aside className="space-y-4">
      <div className="overflow-hidden rounded-xl bg-white ring-1 ring-black/[0.05]">
        <div className="relative">
          <VehicleMap
            items={results}
            highlightedId={highlightedId}
            onHighlight={onHighlight}
            theme="light"
            pricePins
            className="h-[220px]"
          />
          <button
            type="button"
            onClick={onExpandMap}
            className="absolute right-2 top-2 inline-flex size-8 items-center justify-center rounded-md bg-white text-[#0B1220] shadow"
            aria-label={t("expandMap")}
          >
            <Maximize2 className="size-4" />
          </button>
        </div>
        <label className="flex items-center gap-2 px-3 py-2.5 text-xs text-[#4B5563]">
          <input type="checkbox" className="size-3.5 accent-[#E8A84A]" />
          {t("searchAsMove")}
        </label>
      </div>

      <div className="rounded-xl bg-white p-4 ring-1 ring-black/[0.05]">
        <h3 className="text-sm font-bold text-[#0B1220]">{t("popularAreas")}</h3>
        <div className="mt-3 flex flex-wrap gap-2">
          {EXPLORE_AREAS.map((place) => (
            <button
              key={place.city}
              type="button"
              onClick={() => onSelectCity(place.city, place.country, place.state)}
              className="rounded-full bg-[#F3F4F6] px-3 py-1.5 text-xs font-semibold text-[#0B1220] hover:bg-[#E8A84A]/20"
            >
              {place.city}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-xl bg-white p-4 ring-1 ring-black/[0.05]">
        <h3 className="text-sm font-bold text-[#0B1220]">{t("insights")}</h3>
        <p className="mt-1 text-xs text-[#6B7285]">{city}</p>
        <p className="mt-3 text-xs text-[#6B7285]">{t("avgPrice")}</p>
        <div className="mt-1 flex items-end justify-between gap-3">
          <p className="text-lg font-bold text-[#0B1220]">
            {avg > 0 ? formatMarketplacePrice(avg, currency) : "—"}
          </p>
          <span className="text-xs font-semibold text-[#059669]">+6.3%</span>
        </div>
        <svg viewBox="0 0 120 36" className="mt-3 h-9 w-full" aria-hidden>
          <path
            d="M0 28 C16 26 20 18 32 20 C44 22 48 10 64 12 C80 14 84 8 96 10 C108 12 112 6 120 8"
            fill="none"
            stroke="#E8A84A"
            strokeWidth="2.5"
          />
        </svg>
      </div>

      <div className="rounded-xl bg-white p-4 ring-1 ring-black/[0.05]">
        <h3 className="text-sm font-bold text-[#0B1220]">{t("mostSearched")}</h3>
        <div className="mt-3 flex flex-wrap gap-2">
          {POPULAR_SEARCHES.map((query) => (
            <button
              key={query}
              type="button"
              onClick={() => onSearchChip(query)}
              className="rounded-full bg-[#F3F4F6] px-3 py-1.5 text-xs font-semibold text-[#0B1220] hover:bg-[#E8A84A]/20"
            >
              {query}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}
