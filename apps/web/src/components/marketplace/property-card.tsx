"use client";

import { ListingImage } from "@/components/listing-image";
import { Bath, BedDouble, Heart, MapPin, ShieldCheck } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/routing";
import { useFavoriteButton } from "@/hooks/use-favorites";
import { formatMarketplacePrice } from "@/lib/marketplace/format";
import type { MarketplaceListing } from "@/lib/marketplace/types";
import { cn } from "@/lib/utils";

type Props = {
  item: MarketplaceListing;
};

function initials(name?: string) {
  if (!name) return "RK";
  const parts = name.trim().split(/\s+/).slice(0, 2);
  return parts.map((part) => part[0]?.toUpperCase() ?? "").join("");
}

export function MarketplacePropertyCard({ item }: Props) {
  const t = useTranslations("marketplace");
  const { active, handleClick } = useFavoriteButton("property", item.id);
  const typeKey = `types.property.${item.type}`;
  const knownPropertyTypes = ["house", "apartment", "land", "commercial"];
  const typeLabel = knownPropertyTypes.includes(item.type)
    ? t(typeKey)
    : item.type;

  return (
    <article className="group w-[80vw] shrink-0 overflow-hidden rounded-lg bg-white shadow-[0_8px_22px_rgba(15,23,42,.07)] ring-1 ring-black/[0.04] transition hover:-translate-y-0.5 hover:shadow-[0_16px_32px_rgba(15,23,42,.12)] sm:w-[280px]">
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
            <span className="rounded bg-[#0B1220]/85 px-2 py-0.5 text-[10px] font-bold text-white uppercase">
              {t(`badges.${item.badge}`)}
            </span>
          ) : null}
          <span className="rounded bg-white/90 px-2 py-0.5 text-[10px] font-bold text-[#0B1220] uppercase">
            {typeLabel}
          </span>
        </div>
        <button
          type="button"
          onClick={handleClick}
          className={cn(
            "absolute right-2.5 top-2.5 inline-flex size-8 items-center justify-center rounded-full backdrop-blur-md transition",
            active
              ? "bg-[#E8A84A] text-[#070B14]"
              : "bg-white/90 text-[#1A1F2B] hover:bg-white",
          )}
          aria-label={t("save")}
        >
          <Heart className={cn("size-4", active && "fill-current")} />
        </button>
      </div>
      <Link href={item.href} className="block p-4">
        <h3 className="rk-display line-clamp-1 text-[15px] font-semibold text-[#0B1220]">
          {item.title}
        </h3>
        <p className="mt-1 flex items-center gap-1 text-xs text-[#6B7285]">
          <MapPin className="size-3 shrink-0 text-[#E8A84A]" />
          <span className="line-clamp-1">{item.location}</span>
        </p>
        <p className="mt-2.5 text-lg font-bold text-[#E8A84A]">
          {formatMarketplacePrice(item.price, item.currency)}
        </p>
        <p className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#6B7285]">
          {item.bedrooms ? (
            <span className="inline-flex items-center gap-1">
              <BedDouble className="size-3.5" />
              {t("specs.beds", { count: item.bedrooms })}
            </span>
          ) : null}
          {item.bathrooms ? (
            <span className="inline-flex items-center gap-1">
              <Bath className="size-3.5" />
              {t("specs.baths", { count: item.bathrooms })}
            </span>
          ) : null}
          {item.area ? <span>{t("specs.area", { area: item.area })}</span> : null}
        </p>
        {item.company ? (
          <p className="mt-3 flex items-center gap-2 border-t border-[#F0EBE0] pt-3 text-xs text-[#4B5563]">
            <span className="inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-[#0B1220] text-[9px] font-bold tracking-wide text-[#E8A84A]">
              {initials(item.company)}
            </span>
            {item.verified ? (
              <ShieldCheck className="size-3.5 shrink-0 text-[#2563EB]" />
            ) : null}
            <span className="line-clamp-1 font-medium">{item.company}</span>
          </p>
        ) : null}
      </Link>
    </article>
  );
}
