"use client";

import { Heart, MapPin, ShieldCheck, Star } from "lucide-react";
import { useTranslations } from "next-intl";
import { ListingImage } from "@/components/listing-image";
import { useFavoriteButton } from "@/hooks/use-favorites";
import { Link } from "@/lib/i18n/routing";
import { listingLocation } from "@/lib/marketplace/format";
import { cn } from "@/lib/utils";
import type { ServiceListing } from "@/features/services/types";
import { formatServicePrice, initials } from "./listing-utils";

type Variant = "grid" | "list" | "compact";

type Props = {
  item: ServiceListing;
  variant?: Variant;
  highlighted?: boolean;
  onHover?: () => void;
  onLeave?: () => void;
};

function badges(item: ServiceListing) {
  const list: Array<{ id: string; label: string; className: string }> = [];
  if (item.topRated) {
    list.push({ id: "topRated", label: "topRated", className: "bg-[#EA580C] text-white" });
  }
  if (item.verified) {
    list.push({ id: "verified", label: "verified", className: "bg-[#2563EB] text-white" });
  }
  if (item.availableToday) {
    list.push({ id: "today", label: "today", className: "bg-[#059669] text-white" });
  }
  return list.slice(0, 2);
}

export function ListingServiceCard({
  item,
  variant = "grid",
  highlighted,
  onHover,
  onLeave,
}: Props) {
  const t = useTranslations("marketplace.services");
  const { active, handleClick } = useFavoriteButton("property", item.id);
  const location = listingLocation([item.city, item.state]);
  const compact = variant === "compact";
  const price = formatServicePrice(item, {
    from: t("priceFrom"),
    month: t("perMonth"),
    quote: t("requestQuote"),
  });

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
            {t(`badges.${badge.label}`)}
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
      <p className="mt-1 flex items-center gap-1 text-xs text-[#6B7285]">
        <MapPin className="size-3 shrink-0 text-[#E8A84A]" />
        <span className="line-clamp-1">{location}</span>
      </p>
      <p className="mt-1.5 flex items-center gap-1 text-xs font-semibold text-[#0B1220]">
        <Star className="size-3.5 fill-[#E8A84A] text-[#E8A84A]" />
        {item.rating.toFixed(1)}
        {!compact ? (
          <span className="font-normal text-[#6B7285]">({item.reviews})</span>
        ) : null}
      </p>
      {!compact ? (
        <p className="mt-2 line-clamp-2 text-xs text-[#4B5563]">{item.description}</p>
      ) : null}
      <p className={cn("font-bold text-[#EA580C]", compact ? "mt-1.5 text-sm" : "mt-2 text-base")}>
        {price}
      </p>
      {item.provider ? (
        <p className="mt-3 flex items-center gap-2 border-t border-[#F0EBE0] pt-2.5 text-xs text-[#4B5563]">
          <span className="inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-[#0B1220] text-[9px] font-bold text-[#E8A84A]">
            {initials(item.provider)}
          </span>
          <span className="line-clamp-1 font-medium">{item.provider}</span>
          {item.verified ? (
            <>
              <ShieldCheck className="size-3.5 shrink-0 text-[#2563EB]" />
              {!compact ? (
                <span className="text-[11px] font-semibold text-[#2563EB]">{t("verifiedProvider")}</span>
              ) : null}
            </>
          ) : null}
        </p>
      ) : null}
    </div>
  );

  return (
    <Link href={`/services/${item.id}`} className="block h-full">
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
