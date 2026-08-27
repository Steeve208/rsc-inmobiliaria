"use client";

import { Bath, BedDouble, Heart, MapPin, ShieldCheck } from "lucide-react";
import { useTranslations } from "next-intl";
import { ListingImage } from "@/components/listing-image";
import { useFavoriteButton } from "@/hooks/use-favorites";
import { Link } from "@/lib/i18n/routing";
import {
  formatCompactMoney,
  formatMarketplacePrice,
  listingLocation,
} from "@/lib/marketplace/format";
import { cn } from "@/lib/utils";
import { ListingCodeBadge } from "@/components/marketplace/listing-code-badge";
import { CountryFlag } from "@/components/marketplace/country-flag";
import type { PropertyListing } from "@/features/imoveis/types";
import { initials, listingTypeLabel } from "./listing-utils";

type Variant = "grid" | "list" | "compact";

type Props = {
  item: PropertyListing;
  variant?: Variant;
  highlighted?: boolean;
  onHover?: () => void;
  onLeave?: () => void;
};

function badges(item: PropertyListing) {
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
      className: "bg-[#2BB8A8] text-[#070B14]",
    });
  } else if (item.featured) {
    list.push({
      id: "featured",
      label: "featured",
      className: "bg-[#0B1220] text-white",
    });
  }
  if (item.launch) {
    list.push({
      id: "new",
      label: "new",
      className: "bg-[#2563EB] text-white",
    });
  }
  return list;
}

export function ListingPropertyCard({
  item,
  variant = "grid",
  highlighted,
  onHover,
  onLeave,
}: Props) {
  const t = useTranslations("marketplace.listing");
  const tBadges = useTranslations("marketplace.badges");
  const { active, handleClick } = useFavoriteButton("property", item.id);
  const typeLabel = listingTypeLabel(item, t);
  const transactionLabel =
    item.transaction === "rent" ? t("forRent") : t("forSale");
  const location = listingLocation([
    item.neighborhood,
    item.city,
    item.state,
    item.country,
  ]);
  const compact = variant === "compact";

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
      <ListingCodeBadge
        id={item.id}
        code={item.code}
        kind="property"
        className="absolute bottom-2 left-2"
      />
      <CountryFlag
        country={item.country}
        className={cn(
          "absolute bottom-2 right-2 drop-shadow-[0_1px_2px_rgba(0,0,0,.7)]",
          compact ? "text-[12px]" : "text-[15px]",
        )}
      />
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
          active ? "bg-[#2BB8A8] text-[#070B14]" : "bg-white/90 text-[#1A1F2B]",
        )}
        aria-label={t("save")}
      >
        <Heart className={cn(compact ? "size-3.5" : "size-4", active && "fill-current")} />
      </button>
    </div>
  );

  const body = (
    <div className={cn("min-w-0 flex-1", compact ? "p-2.5" : "p-3.5")}>
      <p className="text-[11px] font-medium text-[#6B7285]">
        {typeLabel} {transactionLabel}
      </p>
      <h3
        className={cn(
          "rk-display font-semibold text-[#0B1220]",
          compact ? "mt-0.5 line-clamp-1 text-sm" : "mt-1 line-clamp-2 text-[15px]",
        )}
      >
        {item.title}
      </h3>
      <p className="mt-1 flex items-center gap-1 text-xs text-[#6B7285]">
        <CountryFlag country={item.country} className="text-[13px]" />
        <MapPin className="size-3 shrink-0 text-[#2BB8A8]" />
        <span className="line-clamp-1">{location}</span>
      </p>
      <p className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#6B7285]">
        {item.bedrooms > 0 ? (
          <span className="inline-flex items-center gap-1">
            <BedDouble className="size-3.5" />
            {item.bedrooms}
          </span>
        ) : null}
        {(item.bathrooms ?? 0) > 0 ? (
          <span className="inline-flex items-center gap-1">
            <Bath className="size-3.5" />
            {item.bathrooms}
          </span>
        ) : null}
        {item.area > 0 ? <span>{item.area} m²</span> : null}
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
          {item.transaction === "rent"
            ? t("priceMonth", {
                price: formatMarketplacePrice(item.price, item.currency),
              })
            : formatMarketplacePrice(item.price, item.currency)}
        </p>
      </div>
      {item.company ? (
        <p className="mt-3 flex items-center gap-2 border-t border-[#F0EBE0] pt-2.5 text-xs text-[#4B5563]">
          <span className="inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-[#0B1220] text-[9px] font-bold text-[#2BB8A8]">
            {initials(item.company)}
          </span>
          <span className="line-clamp-1 font-medium">{item.company}</span>
          {item.verified ? (
            <ShieldCheck className="size-3.5 shrink-0 text-[#2563EB]" />
          ) : null}
        </p>
      ) : null}
    </div>
  );

  return (
    <Link href={`/imoveis/${item.id}`} className="block h-full">
      <article
        className={cn(
          "group h-full overflow-hidden bg-white ring-1 ring-black/[0.05] transition hover:-translate-y-0.5 hover:shadow-[0_16px_32px_rgba(15,23,42,.1)]",
          compact ? "flex rounded-xl" : "rounded-lg",
          variant === "list" && "flex flex-col sm:flex-row",
          highlighted && "ring-2 ring-[#2BB8A8]",
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
