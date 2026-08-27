"use client";

import { ListingImage } from "@/components/listing-image";
import { Bath, BedDouble, Heart, MapPin, ShieldCheck } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/routing";
import { useFavoriteButton } from "@/hooks/use-favorites";
import { ListingCodeBadge } from "@/components/marketplace/listing-code-badge";
import { CountryFlag } from "@/components/marketplace/country-flag";
import { listingCodeKindFrom } from "@/lib/listings/listing-code";
import { formatMarketplacePrice } from "@/lib/marketplace/format";
import type { MarketplaceListing } from "@/lib/marketplace/types";
import { cn } from "@/lib/utils";

type Props = {
  item: MarketplaceListing;
  /** Fill grid cell (equal-width desktop layout) */
  fill?: boolean;
};

function initials(name?: string) {
  if (!name) return "RK";
  const parts = name.trim().split(/\s+/).slice(0, 2);
  return parts.map((part) => part[0]?.toUpperCase() ?? "").join("");
}

export function MarketplacePropertyCard({ item, fill = false }: Props) {
  const t = useTranslations("marketplace");
  const { active, handleClick } = useFavoriteButton("property", item.id);

  return (
    <article
      className={cn(
        "group overflow-hidden rounded-lg bg-white shadow-[0_2px_10px_rgba(15,23,42,.05)] ring-1 ring-black/[0.04] transition hover:-translate-y-0.5 hover:shadow-[0_8px_18px_rgba(15,23,42,.08)]",
        fill ? "w-full min-w-0" : "w-[80vw] shrink-0 sm:w-[200px]",
      )}
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <Link href={item.href} className="absolute inset-0 block">
          <ListingImage
            src={item.image}
            alt={item.title}
            fill
            variant="card"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="280px"
          />
        </Link>
        <div className="absolute left-2.5 top-2.5 flex flex-wrap gap-1.5">
          {item.badge ? (
            <span
              className={cn(
                "rounded px-2 py-0.5 text-[10px] font-bold uppercase",
                item.badge === "premium"
                  ? "bg-[#EBAD5B] text-[#1A1205]"
                  : item.badge === "new"
                    ? "bg-[#0B1220] text-white"
                    : "bg-[#2563EB] text-white",
              )}
            >
              {t(`badges.${item.badge}`)}
            </span>
          ) : null}
        </div>
        {!fill ? (
          <ListingCodeBadge
            id={item.id}
            code={item.code}
            kind={listingCodeKindFrom(item.kind) ?? "property"}
            className="absolute bottom-2 left-2"
          />
        ) : null}
        {!fill ? (
          <CountryFlag
            country={item.country ?? item.location}
            className="absolute bottom-2 right-2 text-[15px] drop-shadow-[0_1px_2px_rgba(0,0,0,.7)]"
          />
        ) : null}
        <button
          type="button"
          onClick={handleClick}
          className={cn(
            "absolute right-2.5 top-2.5 inline-flex size-8 items-center justify-center rounded-full backdrop-blur-md transition",
            active
              ? "bg-[#EBAD5B] text-[#1A1205]"
              : "bg-white/90 text-[#1A1F2B] hover:bg-white",
          )}
          aria-label={t("save")}
        >
          <Heart className={cn("size-4", active && "fill-current")} />
        </button>
      </div>
      <Link href={item.href} className={cn("block", fill ? "p-2" : "p-2.5")}>
        <h3 className="rk-display line-clamp-1 text-[13px] font-semibold text-[#0B1220]">
          {item.title}
        </h3>
        <p className="mt-0.5 flex items-center gap-1 text-[11px] text-[#6B7285]">
          {!fill ? (
            <CountryFlag country={item.country ?? item.location} className="text-[12px]" />
          ) : null}
          <MapPin className="size-3 shrink-0 text-[#EBAD5B]" />
          <span className="line-clamp-1">{item.location}</span>
        </p>
        <p className="mt-1.5 text-[15px] font-bold text-[#0B1220]">
          {formatMarketplacePrice(item.price, item.currency)}
        </p>
        <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-[10px] text-[#6B7285]">
          {item.bedrooms ? (
            <span className="inline-flex items-center gap-0.5">
              <BedDouble className="size-3" />
              {t("specs.beds", { count: item.bedrooms })}
            </span>
          ) : null}
          {item.bathrooms ? (
            <span className="inline-flex items-center gap-0.5">
              <Bath className="size-3" />
              {t("specs.baths", { count: item.bathrooms })}
            </span>
          ) : null}
          {item.area ? <span>{t("specs.area", { area: item.area })}</span> : null}
        </p>
        {item.company ? (
          <p className="mt-1.5 flex items-center gap-1.5 border-t border-[#E8EEF4] pt-1.5 text-[10px] text-[#4B5563]">
            <span className="inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-[#0B1220] text-[7px] font-bold tracking-wide text-[#EBAD5B]">
              {initials(item.company)}
            </span>
            {item.verified ? (
              <ShieldCheck className="size-3 shrink-0 text-[#2563EB]" />
            ) : null}
            <span className="line-clamp-1 font-medium">{item.company}</span>
          </p>
        ) : null}
      </Link>
    </article>
  );
}
