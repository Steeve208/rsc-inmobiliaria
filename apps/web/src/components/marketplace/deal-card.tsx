"use client";

import { ListingImage } from "@/components/listing-image";
import { Heart } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/routing";
import { useFavoriteButton } from "@/hooks/use-favorites";
import { formatMarketplacePrice } from "@/lib/marketplace/format";
import type { MarketplaceListing } from "@/lib/marketplace/types";
import { cn } from "@/lib/utils";

type Props = {
  item: MarketplaceListing;
  featured?: boolean;
};

function listingKind(item: MarketplaceListing): "property" | "vehicle" {
  return item.kind === "vehicle" ? "vehicle" : "property";
}

export function DealCard({ item, featured = false }: Props) {
  const t = useTranslations("marketplace");
  const { active, handleClick } = useFavoriteButton(listingKind(item), item.id);
  const categoryKey =
    item.kind === "vehicle"
      ? `types.vehicle.${item.type}`
      : `types.property.${item.type}`;
  const knownTypes = [
    "house",
    "apartment",
    "land",
    "commercial",
    "car",
    "suv",
    "motorcycle",
    "truck",
    "van",
    "electric",
    "hybrid",
  ];
  const categoryLabel = knownTypes.includes(item.type)
    ? t(categoryKey)
    : item.type;

  return (
    <article
      className={cn(
        "group shrink-0 overflow-hidden rounded-lg bg-white shadow-[0_6px_18px_rgba(15,23,42,.06)] ring-1 ring-black/[0.04] transition hover:-translate-y-0.5 hover:shadow-[0_14px_28px_rgba(15,23,42,.1)]",
        featured ? "w-[82vw] sm:w-[320px]" : "w-[70vw] sm:w-[200px]",
      )}
    >
      <div className={cn("relative overflow-hidden", featured ? "aspect-[4/3]" : "aspect-[4/3]")}>
        <Link href={item.href} className="absolute inset-0 block">
          <ListingImage
            src={item.image}
            alt={item.title}
            fill
            variant="card"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes={featured ? "320px" : "200px"}
          />
        </Link>
        {item.discountPercent ? (
          <span className="absolute left-2 top-2 rounded bg-[#E11D2E] px-1.5 py-0.5 text-[10px] font-bold tracking-wide text-white">
            -{item.discountPercent}%
          </span>
        ) : item.badge ? (
          <span className="absolute left-2 top-2 rounded bg-[#E8A84A] px-1.5 py-0.5 text-[10px] font-bold tracking-wide text-[#070B14] uppercase">
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
        <p className="text-[10px] font-bold tracking-[0.14em] text-[#8C97A8] uppercase">
          {categoryLabel}
        </p>
        <h3
          className={cn(
            "mt-1 line-clamp-2 font-semibold text-[#0B1220]",
            featured ? "min-h-[2.6rem] text-[15px]" : "min-h-[2.5rem] text-sm",
          )}
        >
          {item.title}
        </h3>
        <p className="mt-1 line-clamp-1 text-xs text-[#6B7285]">{item.location}</p>
        <p className="mt-2 flex items-baseline gap-2">
          <span className={cn("font-bold text-[#E8A84A]", featured ? "text-lg" : "text-base")}>
            {formatMarketplacePrice(item.price, item.currency)}
          </span>
          {item.originalPrice ? (
            <span className="text-xs text-[#9CA3AF] line-through">
              {formatMarketplacePrice(item.originalPrice, item.currency)}
            </span>
          ) : null}
        </p>
      </Link>
    </article>
  );
}
