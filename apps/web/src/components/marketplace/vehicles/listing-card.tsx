"use client";

import { Heart, MapPin, ShieldCheck, Star } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { ListingImage } from "@/components/listing-image";
import { useFavoriteButton } from "@/hooks/use-favorites";
import { Link } from "@/lib/i18n/routing";
import {
  formatCompactMoney,
  formatMarketplacePrice,
  formatMileage,
  listingLocation,
} from "@/lib/marketplace/format";
import { cn } from "@/lib/utils";
import type { VehicleListing } from "@/features/veiculos/types";
import { initials } from "./listing-utils";

type Variant = "grid" | "list" | "compact";

type Props = {
  item: VehicleListing;
  variant?: Variant;
  highlighted?: boolean;
  onHover?: () => void;
  onLeave?: () => void;
};

function isNewListing(item: VehicleListing) {
  if (!item.publishedAt) return false;
  const published = new Date(item.publishedAt).getTime();
  return published >= Date.now() - 14 * 24 * 60 * 60 * 1000;
}

function badges(item: VehicleListing) {
  const list: Array<{ id: string; label: string; className: string }> = [];
  if (item.discountPercent) {
    list.push({
      id: "discount",
      label: `-${item.discountPercent}%`,
      className: "bg-[#DC2626] text-white",
    });
  }
  if (item.premium) {
    list.push({
      id: "premium",
      label: "premium",
      className: "bg-[#E8A84A] text-[#070B14]",
    });
  } else if (item.featured) {
    list.push({
      id: "featured",
      label: "featured",
      className: "bg-[#0B1220] text-white",
    });
  }
  if (isNewListing(item)) {
    list.push({
      id: "new",
      label: "new",
      className: "bg-[#2563EB] text-white",
    });
  }
  return list;
}

export function ListingVehicleCard({
  item,
  variant = "grid",
  highlighted,
  onHover,
  onLeave,
}: Props) {
  const t = useTranslations("marketplace.vehicles");
  const tBadges = useTranslations("marketplace.badges");
  const locale = useLocale();
  const { active, handleClick } = useFavoriteButton("vehicle", item.id);
  const location = listingLocation([item.city, item.state, item.country]);
  const compact = variant === "compact";
  const specs = [
    item.year ? String(item.year) : "",
    item.mileage ? formatMileage(item.mileage, locale) : "",
    item.transmission ? t(`transmissions.${item.transmission}`) : "",
    item.fuel ? t(`fuels.${item.fuel}`) : "",
  ].filter(Boolean);

  const image = (
    <div
      className={cn(
        "relative overflow-hidden",
        variant === "list" && "h-44 w-full shrink-0 sm:h-auto sm:w-[240px]",
        variant === "grid" && "aspect-[4/3]",
        compact && "h-full w-[112px] shrink-0",
      )}
    >
      <ListingImage
        src={item.image}
        alt={item.title}
        fill
        variant={compact ? "thumb" : "card"}
        className="object-cover transition-transform duration-500 group-hover:scale-105"
        sizes={compact ? "112px" : variant === "list" ? "240px" : "280px"}
      />
      <div className="absolute left-2 top-2 flex flex-wrap gap-1">
        {badges(item).map((badge) => (
          <span
            key={badge.id}
            className={cn(
              "rounded px-1.5 py-0.5 text-[10px] font-bold uppercase",
              badge.className,
            )}
          >
            {badge.id === "discount" ? badge.label : tBadges(badge.label)}
          </span>
        ))}
      </div>
      <button
        type="button"
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          handleClick(event);
        }}
        className={cn(
          "absolute right-2 top-2 inline-flex items-center justify-center rounded-full backdrop-blur-md",
          compact ? "size-7" : "size-8",
          active ? "bg-[#E8A84A] text-[#070B14]" : "bg-white/90 text-[#1A1F2B]",
        )}
        aria-label={t("save")}
      >
        <Heart className={cn(compact ? "size-3.5" : "size-4", active && "fill-current")} />
      </button>
    </div>
  );

  const body = (
    <div className={cn("min-w-0 flex-1", compact ? "p-2.5" : "p-3.5")}>
      <h3
        className={cn(
          "rk-display font-semibold text-[#0B1220]",
          compact ? "line-clamp-1 text-sm" : "line-clamp-2 text-[15px]",
        )}
      >
        {item.title}
      </h3>
      {specs.length > 0 ? (
        <p className="mt-1 line-clamp-1 text-xs text-[#6B7285]">{specs.join(" • ")}</p>
      ) : null}
      <p className="mt-1 flex items-center gap-1 text-xs text-[#6B7285]">
        <MapPin className="size-3 shrink-0 text-[#E8A84A]" />
        <span className="line-clamp-1">{location}</span>
      </p>
      <div className="mt-2 flex flex-wrap items-baseline gap-2">
        {item.originalPrice && item.originalPrice > item.price ? (
          <span className="text-xs text-[#9CA3AF] line-through">
            {compact
              ? formatCompactMoney(item.originalPrice, item.currency)
              : formatMarketplacePrice(item.originalPrice, item.currency)}
          </span>
        ) : null}
        <p
          className={cn(
            "font-bold",
            item.originalPrice && item.originalPrice > item.price
              ? "text-[#EA580C]"
              : "text-[#0B1220]",
            compact ? "text-sm" : "text-base",
          )}
        >
          {formatMarketplacePrice(item.price, item.currency)}
        </p>
      </div>
      {item.company ? (
        <p className="mt-3 flex items-center gap-2 border-t border-[#F0EBE0] pt-2.5 text-xs text-[#4B5563]">
          <span className="inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-[#0B1220] text-[9px] font-bold text-[#E8A84A]">
            {initials(item.company)}
          </span>
          <span className="line-clamp-1 font-medium">{item.company}</span>
          {item.verified ? (
            <ShieldCheck className="size-3.5 shrink-0 text-[#2563EB]" />
          ) : null}
          {item.rating ? (
            <span className="ms-auto inline-flex items-center gap-1 text-[#6B7285]">
              <Star className="size-3 fill-[#E8A84A] text-[#E8A84A]" />
              {item.rating.toFixed(1)}
              {item.reviews ? (
                <span className="text-[#9CA3AF]">({item.reviews})</span>
              ) : null}
            </span>
          ) : null}
        </p>
      ) : null}
    </div>
  );

  return (
    <Link href={`/veiculos/${item.id}`} className="block h-full">
      <article
        className={cn(
          "group h-full overflow-hidden bg-white ring-1 ring-black/[0.05] transition hover:-translate-y-0.5 hover:shadow-[0_16px_32px_rgba(15,23,42,.1)]",
          compact ? "flex rounded-xl" : "rounded-lg",
          variant === "list" && "flex flex-col sm:flex-row",
          highlighted && "ring-2 ring-[#E8A84A]",
        )}
        onMouseEnter={onHover}
        onMouseLeave={onLeave}
      >
        {image}
        {body}
      </article>
    </Link>
  );
}
