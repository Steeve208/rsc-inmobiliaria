"use client";

import { Heart, MapPin, ShieldCheck } from "lucide-react";
import { useTranslations } from "next-intl";
import { ListingImage } from "@/components/listing-image";
import { useFavoriteButton } from "@/hooks/use-favorites";
import { Link } from "@/lib/i18n/routing";
import {
  formatMarketplacePrice,
  listingLocation,
} from "@/lib/marketplace/format";
import { cn } from "@/lib/utils";
import type { ProjectListing } from "@/features/projetos/types";
import { bedsLabel, initials } from "./listing-utils";

type Variant = "grid" | "list" | "compact";

type Props = {
  item: ProjectListing;
  variant?: Variant;
  highlighted?: boolean;
  onHover?: () => void;
  onLeave?: () => void;
};

function isNewListing(item: ProjectListing) {
  if (!item.publishedAt) return false;
  return (
    new Date(item.publishedAt).getTime() >=
    Date.now() - 14 * 24 * 60 * 60 * 1000
  );
}

const STATUS_CLASS: Record<string, string> = {
  prelaunch: "bg-[#2563EB] text-white",
  construction: "bg-[#EA580C] text-white",
  ready: "bg-[#059669] text-white",
};

function badges(item: ProjectListing) {
  const list: Array<{ id: string; label: string; className: string }> = [
    {
      id: item.status,
      label: item.status,
      className: STATUS_CLASS[item.status] ?? "bg-[#0B1220] text-white",
    },
  ];
  if (isNewListing(item)) {
    list.push({ id: "new", label: "new", className: "bg-[#16A34A] text-white" });
  }
  if (item.featured || item.premium) {
    list.push({
      id: "featured",
      label: "featured",
      className: "bg-[#7C3AED] text-white",
    });
  }
  if (item.highRoi) {
    list.push({
      id: "highRoi",
      label: "highRoi",
      className: "bg-[#0F766E] text-white",
    });
  } else if (item.paymentPlan) {
    list.push({
      id: "paymentPlan",
      label: "paymentPlan",
      className: "bg-[#4338CA] text-white",
    });
  } else if (item.luxury) {
    list.push({
      id: "luxury",
      label: "luxury",
      className: "bg-[#E8A84A] text-[#070B14]",
    });
  } else if (item.sustainable) {
    list.push({
      id: "sustainable",
      label: "sustainable",
      className: "bg-[#15803D] text-white",
    });
  }
  return list.slice(0, 3);
}

export function ListingProjectCard({
  item,
  variant = "grid",
  highlighted,
  onHover,
  onLeave,
}: Props) {
  const t = useTranslations("marketplace.projects");
  const { active, handleClick } = useFavoriteButton(
    "property",
    item.propertyId ?? item.id,
  );
  const location = listingLocation([
    item.neighborhood,
    item.city,
    item.state,
    item.country,
  ]);
  const compact = variant === "compact";
  const beds = bedsLabel(item);
  const href = item.propertyId ? `/imoveis/${item.propertyId}` : `/projetos/${item.id}`;

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
      <p className="mt-1 line-clamp-1 text-xs text-[#6B7285]">
        {[t(`units.${item.unitType}`), beds ? t("bedsRange", { range: beds }) : ""]
          .filter(Boolean)
          .join(" • ")}
      </p>
      <p
        className={cn(
          "mt-2 font-bold text-[#EA580C]",
          compact ? "text-sm" : "text-base",
        )}
      >
        {t("priceFrom", {
          price: formatMarketplacePrice(item.price, item.currency),
        })}
      </p>
      {item.developer ? (
        <p className="mt-3 flex items-center gap-2 border-t border-[#F0EBE0] pt-2.5 text-xs text-[#4B5563]">
          <span className="inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-[#0B1220] text-[9px] font-bold text-[#E8A84A]">
            {initials(item.developer)}
          </span>
          <span className="line-clamp-1 font-medium text-[#C9972A]">
            {item.developer}
          </span>
          {item.verified ? (
            <ShieldCheck className="size-3.5 shrink-0 text-[#2563EB]" />
          ) : null}
        </p>
      ) : null}
      {!compact ? (
        <p className="mt-1 text-[11px] text-[#6B7285]">
          {t("delivery", { date: item.delivery })}
        </p>
      ) : null}
    </div>
  );

  return (
    <Link href={href} className="block h-full">
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
