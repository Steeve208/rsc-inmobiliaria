"use client";

import { ListingImage } from "@/components/listing-image";
import { Gauge, Heart } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/routing";
import { useFavoriteButton } from "@/hooks/use-favorites";
import { ListingCodeBadge } from "@/components/marketplace/listing-code-badge";
import { CountryFlag } from "@/components/marketplace/country-flag";
import {
  formatMarketplacePrice,
  formatMileage,
} from "@/lib/marketplace/format";
import type { MarketplaceListing } from "@/lib/marketplace/types";
import { cn } from "@/lib/utils";

type Props = {
  item: MarketplaceListing;
  compact?: boolean;
  fill?: boolean;
};

export function MarketplaceVehicleCard({
  item,
  compact = false,
  fill = false,
}: Props) {
  const t = useTranslations("marketplace");
  const { active, handleClick } = useFavoriteButton("vehicle", item.id);

  return (
    <article
      className={cn(
        "group overflow-hidden rounded-lg bg-white transition hover:-translate-y-0.5",
        fill
          ? "w-full min-w-0 shadow-none ring-0"
          : "shrink-0 shadow-[0_2px_10px_rgba(15,23,42,.05)] ring-1 ring-black/[0.04]",
        !fill && (compact ? "w-[60vw] sm:w-[160px]" : "w-[72vw] sm:w-[200px]"),
      )}
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-transparent">
        <Link href={item.href} className="absolute inset-0 block">
          <ListingImage
            src={item.image}
            alt={item.title}
            fill
            variant="card"
            className="object-contain object-center transition-transform duration-500 group-hover:scale-105"
            sizes="160px"
          />
        </Link>
        {item.badge && !fill ? (
          <span className="absolute left-2 top-2 rounded bg-[#0B1220]/85 px-1.5 py-0.5 text-[10px] font-bold text-white uppercase">
            {t(`badges.${item.badge}`)}
          </span>
        ) : null}
        {!fill ? (
          <>
            <ListingCodeBadge
              id={item.id}
              code={item.code}
              kind="vehicle"
              className="absolute bottom-2 left-2"
            />
            <CountryFlag
              country={item.country ?? item.location}
              className="absolute bottom-2 right-2 text-[14px] drop-shadow-[0_1px_2px_rgba(0,0,0,.7)]"
            />
          </>
        ) : null}
        <button
          type="button"
          onClick={handleClick}
          className={cn(
            "absolute right-1 top-1 inline-flex size-6 items-center justify-center rounded-full backdrop-blur-md transition",
            active
              ? "bg-[#EBAD5B] text-[#1A1205]"
              : "bg-white/90 text-[#1A1F2B] hover:bg-white",
          )}
          aria-label={t("save")}
        >
          <Heart className={cn("size-3", active && "fill-current")} />
        </button>
      </div>
      <Link href={item.href} className={cn("block", fill ? "px-0.5 py-1.5 text-center" : "p-2")}>
        <h3
          className={cn(
            "line-clamp-1 font-semibold text-[#0B1220]",
            fill ? "text-[11px]" : "text-[12px]",
          )}
        >
          {item.title}
        </h3>
        <p
          className={cn(
            "mt-0.5 flex items-center gap-1 text-[#6B7285]",
            fill ? "justify-center text-[9px]" : "text-[10px]",
          )}
        >
          {!fill ? <Gauge className="size-3 text-[#EBAD5B]" /> : null}
          {[item.year, item.mileage ? formatMileage(item.mileage, "pt-BR") : null]
            .filter(Boolean)
            .join(" · ")}
        </p>
        <p
          className={cn(
            "mt-1 font-bold text-[#0B1220]",
            fill ? "text-[12px]" : "text-[13px]",
          )}
        >
          {formatMarketplacePrice(item.price, item.currency)}
        </p>
        {item.company && !fill ? (
          <p className="mt-0.5 line-clamp-1 text-[10px] text-[#8C97A8]">{item.company}</p>
        ) : null}
      </Link>
    </article>
  );
}
