"use client";

import dynamic from "next/dynamic";
import { Maximize2 } from "lucide-react";
import { useTranslations } from "next-intl";
import type { BusinessListing, NegociosFilters } from "@/features/negocios/types";
import { formatMarketplacePrice } from "@/lib/marketplace/format";
import { BUSINESS_CATEGORIES, averagePrice, averageRevenue } from "./listing-utils";

const BusinessMap = dynamic(
  () =>
    import("@/features/negocios/components/business-map").then((mod) => mod.BusinessMap),
  {
    ssr: false,
    loading: () => <div className="h-[220px] animate-pulse rounded-lg bg-[#E5E7EB]" />,
  },
);

type Props = {
  results: BusinessListing[];
  catalog: BusinessListing[];
  highlightedId: string | null;
  onHighlight: (id: string | null) => void;
  onSelectType: (type: NegociosFilters["type"]) => void;
  onExpandMap: () => void;
};

export function ListingAside({
  results,
  catalog,
  highlightedId,
  onHighlight,
  onSelectType,
  onExpandMap,
}: Props) {
  const t = useTranslations("marketplace.businesses");
  const source = results.length > 0 ? results : catalog;
  const avgPrice = averagePrice(source);
  const avgRevenue = averageRevenue(source);
  const currency = source[0]?.currency ?? "USD";

  return (
    <aside className="space-y-4">
      <div className="overflow-hidden rounded-xl bg-white ring-1 ring-black/[0.05]">
        <div className="relative">
          <BusinessMap
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
      </div>

      <div className="rounded-xl bg-white p-4 ring-1 ring-black/[0.05]">
        <h3 className="text-sm font-bold text-[#0B1220]">{t("popularCategories")}</h3>
        <div className="mt-3 flex flex-wrap gap-2">
          {BUSINESS_CATEGORIES.map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => onSelectType(type)}
              className="rounded-full bg-[#F3F4F6] px-3 py-1.5 text-xs font-semibold text-[#0B1220] hover:bg-[#2BB8A8]/20"
            >
              {t(`types.${type}`)}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-xl bg-white p-4 ring-1 ring-black/[0.05]">
        <h3 className="text-sm font-bold text-[#0B1220]">{t("insights")}</h3>
        <p className="mt-3 text-xs text-[#6B7285]">{t("activeListings")}</p>
        <div className="mt-1 flex items-end justify-between">
          <p className="text-lg font-bold">{results.length || catalog.length}</p>
          <span className="text-xs font-semibold text-[#059669]">+14.2%</span>
        </div>
        <p className="mt-3 text-xs text-[#6B7285]">{t("avgPrice")}</p>
        <div className="mt-1 flex items-end justify-between">
          <p className="text-lg font-bold">
            {avgPrice > 0 ? formatMarketplacePrice(avgPrice, currency) : "—"}
          </p>
          <span className="text-xs font-semibold text-[#059669]">+8.7%</span>
        </div>
        <p className="mt-3 text-xs text-[#6B7285]">{t("avgRevenue")}</p>
        <div className="mt-1 flex items-end justify-between">
          <p className="text-lg font-bold">
            {avgRevenue > 0 ? formatMarketplacePrice(avgRevenue, currency) : "—"}
          </p>
          <span className="text-xs font-semibold text-[#059669]">+11.3%</span>
        </div>
      </div>
    </aside>
  );
}
