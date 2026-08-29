"use client";

import { ListingImage } from "@/components/listing-image";
import { Heart } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/routing";
import { useFavoriteButton } from "@/hooks/use-favorites";
import { CountryFlag } from "@/components/marketplace/country-flag";
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

function Badge({
  item,
  t,
  className,
}: {
  item: MarketplaceListing;
  t: (key: string) => string;
  className?: string;
}) {
  if (item.discountPercent) {
    return (
      <span
        className={cn(
          "rounded bg-[#E11D2E] px-1.5 py-0.5 text-[10px] font-bold tracking-wide text-white",
          className,
        )}
      >
        -{item.discountPercent}%
      </span>
    );
  }
  if (!item.badge) return null;
  return (
    <span
      className={cn(
        "rounded px-1.5 py-0.5 text-[10px] font-bold tracking-wide uppercase",
        item.badge === "new"
          ? "bg-[#0B1220] text-white"
          : item.badge === "featured"
            ? "bg-[#2563EB] text-white"
            : "bg-[#EBAD5B] text-[#1A1205]",
        className,
      )}
    >
      {t(`badges.${item.badge}`)}
    </span>
  );
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
  const priceAccent = Boolean(item.discountPercent || item.originalPrice);

  if (featured) {
    return (
      <article className="group relative flex h-full min-h-[200px] flex-col overflow-hidden rounded-lg bg-white shadow-[0_2px_10px_rgba(15,23,42,.05)] ring-1 ring-black/[0.04]">
        <Link href={item.href} className="absolute inset-0 block">
          <ListingImage
            src={item.image}
            alt={item.title}
            fill
            variant="card"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="320px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />
        </Link>
        <Badge item={item} t={t} className="absolute left-2.5 top-2.5 z-10" />
        <CountryFlag
          country={item.country ?? item.location}
          className="absolute bottom-2.5 right-2.5 z-10 text-[15px] drop-shadow-[0_1px_2px_rgba(0,0,0,.7)]"
        />
        <button
          type="button"
          onClick={handleClick}
          className={cn(
            "absolute right-2.5 top-2.5 z-10 inline-flex size-7 items-center justify-center rounded-full backdrop-blur-md transition",
            active
              ? "bg-[#EBAD5B] text-[#1A1205]"
              : "bg-white/90 text-[#1A1F2B] hover:bg-white",
          )}
          aria-label={t("save")}
        >
          <Heart className={cn("size-3.5", active && "fill-current")} />
        </button>
        <Link
          href={item.href}
          className="relative z-10 mt-auto flex flex-col p-3 text-white"
        >
          <p className="text-[9px] font-bold tracking-[0.14em] text-white/70 uppercase">
            {categoryLabel}
          </p>
          <h3 className="mt-0.5 line-clamp-2 text-[14px] font-semibold leading-tight">
            {item.title}
          </h3>
          <p className="mt-0.5 flex items-center gap-1 text-[11px] text-white/70">
            <CountryFlag
              country={item.country ?? item.location}
              className="text-[12px]"
            />
            <span className="line-clamp-1">{item.location}</span>
          </p>
          <p className="mt-1.5 flex items-baseline gap-1.5">
            {item.originalPrice ? (
              <span className="text-[11px] text-white/55 line-through">
                {formatMarketplacePrice(item.originalPrice, item.currency)}
              </span>
            ) : null}
            <span className="text-[16px] font-bold text-[#EBAD5B]">
              {formatMarketplacePrice(item.price, item.currency)}
            </span>
          </p>
        </Link>
      </article>
    );
  }

  return (
    <article className="group flex h-full w-full flex-col overflow-hidden rounded-lg bg-white shadow-[0_2px_10px_rgba(15,23,42,.05)] ring-1 ring-black/[0.04] transition hover:-translate-y-0.5 hover:shadow-[0_8px_18px_rgba(15,23,42,.08)]">
      <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden">
        <Link href={item.href} className="absolute inset-0 block">
          <ListingImage
            src={item.image}
            alt={item.title}
            fill
            variant="card"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="200px"
          />
        </Link>
        <Badge item={item} t={t} className="absolute left-1.5 top-1.5" />
        <CountryFlag
          country={item.country ?? item.location}
          className="absolute bottom-1.5 right-1.5 text-[13px] drop-shadow-[0_1px_2px_rgba(0,0,0,.7)]"
        />
        <button
          type="button"
          onClick={handleClick}
          className={cn(
            "absolute right-1.5 top-1.5 inline-flex size-6 items-center justify-center rounded-full backdrop-blur-md transition",
            active
              ? "bg-[#EBAD5B] text-[#1A1205]"
              : "bg-white/90 text-[#1A1F2B] hover:bg-white",
          )}
          aria-label={t("save")}
        >
          <Heart className={cn("size-3", active && "fill-current")} />
        </button>
      </div>
      <Link href={item.href} className="flex flex-1 flex-col p-2">
        <p className="text-[9px] font-bold tracking-[0.14em] text-[#8C97A8] uppercase">
          {categoryLabel}
        </p>
        <h3 className="mt-0.5 line-clamp-2 text-[12px] font-semibold leading-tight text-[#0B1220]">
          {item.title}
        </h3>
        <p className="mt-0.5 flex items-center gap-1 text-[11px] text-[#6B7285]">
          <CountryFlag
            country={item.country ?? item.location}
            className="text-[12px]"
          />
          <span className="line-clamp-1">{item.location}</span>
        </p>
        <p className="mt-auto flex items-baseline gap-1.5 pt-1.5">
          <span
            className={cn(
              "text-[14px] font-bold",
              priceAccent ? "text-[#EBAD5B]" : "text-[#0B1220]",
            )}
          >
            {formatMarketplacePrice(item.price, item.currency)}
          </span>
          {item.originalPrice ? (
            <span className="text-[11px] text-[#9CA3AF] line-through">
              {formatMarketplacePrice(item.originalPrice, item.currency)}
            </span>
          ) : null}
        </p>
      </Link>
    </article>
  );
}
