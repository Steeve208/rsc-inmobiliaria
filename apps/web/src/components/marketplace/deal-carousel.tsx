"use client";

import { DealCard } from "@/components/marketplace/deal-card";
import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/routing";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { MarketplaceListing } from "@/lib/marketplace/types";

type Props = {
  items: MarketplaceListing[];
  href?: string;
};

export function DealCarousel({ items, href = "/imoveis" }: Props) {
  const t = useTranslations("marketplace");
  if (items.length === 0) return null;

  const [featured, ...rest] = items;
  const side = rest.slice(0, 4);

  return (
    <section className="flex h-full flex-col">
      <div className="mb-2 flex h-8 items-center justify-between gap-3">
        <h2 className="rk-display text-base font-bold tracking-tight text-[#0B1220]">
          {t("deals")}
        </h2>
        <div className="flex items-center gap-2">
          <Link
            href={href}
            className="hidden text-[13px] font-semibold text-[#2563EB] hover:text-[#1D4ED8] sm:inline"
          >
            {t("seeAll")}
          </Link>
          <button
            type="button"
            className="hidden size-7 items-center justify-center rounded-full border border-[#E5E7EB] bg-white text-[#374151] transition hover:border-[#EBAD5B] hover:text-[#D49A3F] md:inline-flex"
            aria-label="Previous"
          >
            <ChevronLeft className="size-3.5" />
          </button>
          <button
            type="button"
            className="hidden size-7 items-center justify-center rounded-full border border-[#E5E7EB] bg-white text-[#374151] transition hover:border-[#EBAD5B] hover:text-[#D49A3F] md:inline-flex"
            aria-label="Next"
          >
            <ChevronRight className="size-3.5" />
          </button>
        </div>
      </div>
      <div className="grid flex-1 grid-cols-2 items-stretch gap-2 sm:grid-cols-3 lg:grid-cols-[minmax(0,1.2fr)_repeat(4,minmax(0,1fr))]">
        <div className="col-span-2 min-h-0 sm:col-span-1">
          <DealCard item={featured} featured />
        </div>
        {side.map((item) => (
          <DealCard key={`${item.kind}-${item.id}`} item={item} />
        ))}
      </div>
    </section>
  );
}
