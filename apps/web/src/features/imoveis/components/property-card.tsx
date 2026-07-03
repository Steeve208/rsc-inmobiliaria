"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Bath, BedDouble, Car, GitCompare, Heart, MapPin, ShieldCheck } from "lucide-react";
import { Link } from "@/lib/i18n/routing";
import { cn } from "@/lib/utils";
import { useFavoriteButton } from "@/hooks/use-favorites";
import { usePropertyCompare } from "@/hooks/use-property-compare-state";
import type { PropertyListing } from "../types";

type Props = {
  item: PropertyListing;
  variant?: "list" | "gallery" | "compact";
  highlighted?: boolean;
  onHover?: () => void;
  onLeave?: () => void;
};

function formatPrice(price: number, currency: string) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(price);
}

export function PropertyCard({
  item,
  variant = "list",
  highlighted,
  onHover,
  onLeave,
}: Props) {
  const t = useTranslations("imoveis.card");
  const { active, handleClick } = useFavoriteButton("property", item.id);
  const { isCompared, toggle } = usePropertyCompare();

  const transactionLabel =
    item.transaction === "rent"
      ? t("rent")
      : item.transaction === "buy"
        ? t("buy")
        : null;

  const imageBlock = (
    <div
      className={cn(
        "relative overflow-hidden",
        variant === "list" ? "h-48 w-full shrink-0 sm:h-auto sm:w-56" : "aspect-[4/3]",
      )}
    >
      <Image
        src={item.image}
        alt={item.title}
        fill
        className="object-cover transition-transform duration-500 group-hover:scale-105"
        sizes={variant === "list" ? "224px" : "(max-width:768px) 100vw, 33vw"}
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-black/5 to-transparent" />
      <div className="absolute left-3 top-3 flex flex-wrap gap-2">
        {transactionLabel && (
          <span className="rounded-full bg-black/50 px-2.5 py-1 text-[10px] font-semibold text-white backdrop-blur-sm">
            {transactionLabel}
          </span>
        )}
        {item.verified && (
          <span className="inline-flex items-center gap-1 rounded-full bg-[#1d4ed8] px-2.5 py-1 text-[10px] font-semibold text-white">
            <ShieldCheck className="size-3" />
            {t("verified")}
          </span>
        )}
      </div>
      <div className="absolute right-3 top-3 flex gap-2">
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggle(item.id);
          }}
          className={cn(
            "flex size-8 items-center justify-center rounded-full backdrop-blur-sm transition-colors",
            isCompared(item.id)
              ? "bg-[#1d4ed8] text-white"
              : "bg-black/40 text-white hover:bg-black/60",
          )}
          aria-label={t("compare")}
        >
          <GitCompare className="size-3.5" />
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleClick(e);
          }}
        className={cn(
          "absolute right-3 top-3 flex size-8 items-center justify-center rounded-full backdrop-blur-sm transition-colors",
          active
            ? "bg-[#d4a017] text-[#000a1a]"
            : "bg-black/40 text-white hover:bg-black/60",
        )}
        aria-label={t("favorite")}
      >
        <Heart className={cn("size-4", active && "fill-current")} />
        </button>
      </div>
    </div>
  );

  const bodyBlock = (
    <div className={cn("p-5", variant === "list" && "flex flex-1 flex-col justify-between")}>
      <div>
        <h3 className="line-clamp-1 font-semibold text-white">{item.title}</h3>
        <p className="mt-1 flex items-center gap-1 text-xs text-white/50">
          <MapPin className="size-3" />
          {variant === "list" ? `${item.neighborhood}, ${item.city}` : item.city}
        </p>
        <p className="mt-2 text-xl font-bold text-white">
          {formatPrice(item.price, item.currency)}
        </p>
      </div>
      <div className="mt-3 flex flex-wrap gap-2 text-xs text-white/55">
        {item.bedrooms > 0 && (
          <span className="flex items-center gap-1 rounded-full bg-white/[0.06] px-2 py-0.5">
            <BedDouble className="size-3" />
            {item.bedrooms} {t("bedrooms")}
          </span>
        )}
        {(item.bathrooms ?? 0) > 0 && (
          <span className="flex items-center gap-1 rounded-full bg-white/[0.06] px-2 py-0.5">
            <Bath className="size-3" />
            {item.bathrooms} {t("bathrooms")}
          </span>
        )}
        {item.garage > 0 && (
          <span className="flex items-center gap-1 rounded-full bg-white/[0.06] px-2 py-0.5">
            <Car className="size-3" />
            {item.garage}
          </span>
        )}
        {item.area > 0 && (
          <span className="rounded-full bg-white/[0.06] px-2 py-0.5">
            {item.area} m²
          </span>
        )}
      </div>
      {variant !== "list" && (
        <span className="mt-3 block w-full rounded-xl bg-[#1d4ed8]/10 py-2 text-center text-xs font-medium text-[#60a5fa] transition-colors group-hover:bg-[#1d4ed8]/15">
          {t("viewProperty")}
        </span>
      )}
      {variant === "list" && (
        <span className="mt-3 inline-block rounded-xl bg-[#1d4ed8]/10 px-4 py-2 text-xs font-medium text-[#60a5fa]">
          {t("viewProperty")}
        </span>
      )}
    </div>
  );

  if (variant === "gallery" || variant === "compact") {
    return (
      <Link href={`/imoveis/${item.id}`} className="block">
        <article
          className={cn(
            "group overflow-hidden rounded-2xl bg-[#081128]/60 transition-all duration-300",
            highlighted
              ? "shadow-xl shadow-[#1d4ed8]/20 ring-2 ring-[#1d4ed8]/50"
              : "hover:bg-[#081128]/80 hover:shadow-xl hover:shadow-black/20",
          )}
          onMouseEnter={onHover}
          onMouseLeave={onLeave}
        >
          {imageBlock}
          {bodyBlock}
        </article>
      </Link>
    );
  }

  return (
    <Link href={`/imoveis/${item.id}`} className="block">
      <article
        className={cn(
          "group flex flex-col overflow-hidden rounded-2xl bg-[#081128]/60 transition-all duration-300 sm:flex-row",
          highlighted
            ? "shadow-xl shadow-[#1d4ed8]/20 ring-2 ring-[#1d4ed8]/50"
            : "hover:bg-[#081128]/80 hover:shadow-xl hover:shadow-black/20",
        )}
        onMouseEnter={onHover}
        onMouseLeave={onLeave}
      >
        {imageBlock}
        {bodyBlock}
      </article>
    </Link>
  );
}
