"use client";

import { ListingImage } from "@/components/listing-image";
import { Gauge, Heart } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/routing";
import { useFavoriteButton } from "@/hooks/use-favorites";
import {
  formatMarketplacePrice,
  formatMileage,
} from "@/lib/marketplace/format";
import type { MarketplaceListing } from "@/lib/marketplace/types";
import { cn } from "@/lib/utils";

type Props = {
  item: MarketplaceListing;
  compact?: boolean;
};

export function MarketplaceVehicleCard({ item, compact = false }: Props) {
  const t = useTranslations("marketplace");
  const { active, handleClick } = useFavoriteButton("vehicle", item.id);

  return (
    <article
      className={cn(
        "group shrink-0 overflow-hidden rounded-lg bg-white shadow-[0_6px_18px_rgba(15,23,42,.06)] ring-1 ring-black/[0.04] transition hover:-translate-y-0.5 hover:shadow-[0_14px_28px_rgba(15,23,42,.1)]",
        compact ? "w-[68vw] sm:w-[200px]" : "w-[76vw] sm:w-[220px]",
      )}
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-[#F7F7F7]">
        <Link href={item.href} className="absolute inset-0 block">
          <ListingImage
            src={item.image}
            alt={item.title}
            fill
            variant="card"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="240px"
          />
        </Link>
        {item.badge ? (
          <span className="absolute left-2 top-2 rounded bg-[#0B1220]/85 px-1.5 py-0.5 text-[10px] font-bold text-white uppercase">
            {t(`badges.${item.badge}`)}
          </span>
        ) : null}
        <button
          type="button"
          onClick={handleClick}
          className={cn(
            "absolute right-2 top-2 inline-flex size-7 items-center justify-center rounded-full backdrop-blur-md transition",
            active
              ? "bg-[#E8A84A] text-[#070B14]"
              : "bg-white/90 text-[#1A1F2B] hover:bg-white",
          )}
          aria-label={t("save")}
        >
          <Heart className={cn("size-3.5", active && "fill-current")} />
        </button>
      </div>
      <Link href={item.href} className="block p-3">
        <h3 className="line-clamp-1 text-sm font-semibold text-[#0B1220]">
          {item.title}
        </h3>
        <p className="mt-1 flex items-center gap-1 text-xs text-[#6B7285]">
          <Gauge className="size-3.5 text-[#E8A84A]" />
          {[item.year, item.mileage ? formatMileage(item.mileage, "pt-BR") : null]
            .filter(Boolean)
            .join(" · ")}
        </p>
        <p className="mt-2 text-base font-bold text-[#E8A84A]">
          {formatMarketplacePrice(item.price, item.currency)}
        </p>
        {item.company ? (
          <p className="mt-1 line-clamp-1 text-[11px] text-[#8C97A8]">{item.company}</p>
        ) : null}
      </Link>
    </article>
  );
}
