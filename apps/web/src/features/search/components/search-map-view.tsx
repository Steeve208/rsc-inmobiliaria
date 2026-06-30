"use client";

import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import { MapPin } from "lucide-react";
import type { ListingItem } from "../types";

const MapboxMap = dynamic(
  () =>
    import("@/components/home/mapbox-map").then((mod) => mod.MapboxMap),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-[480px] animate-pulse rounded-xl border border-white/10 bg-[#081128]/60" />
    ),
  },
);

type Props = {
  items: ListingItem[];
};

export function SearchMapView({ items }: Props) {
  const t = useTranslations("search");

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-white/10 bg-[#081128]/60 p-4">
        <p className="text-sm text-white/60">
          {t("results.mapHint", { count: items.length })}
        </p>
      </div>
      <MapboxMap className="min-h-[480px]" />
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {items.slice(0, 6).map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-2 rounded-lg border border-white/10 bg-[#081128]/40 px-3 py-2 text-sm text-white/70"
          >
            <MapPin className="size-3.5 shrink-0 text-[#60a5fa]" />
            <span className="truncate">
              {item.title} — {item.city}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
