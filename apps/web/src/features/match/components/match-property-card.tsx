"use client";

import { Bath, BedDouble, MapPin } from "lucide-react";
import { useTranslations } from "next-intl";
import { ListingImage } from "@/components/listing-image";
import { Link } from "@/lib/i18n/routing";
import { formatMarketplacePrice } from "@/lib/marketplace/format";
import type { MatchResultCard } from "@/lib/match/types";
import { MatchScoreBadge } from "./match-score-badge";

type Props = {
  item: MatchResultCard;
  sessionId: string;
  selected?: boolean;
  onToggleSelect?: () => void;
  onExplain?: () => void;
};

export function MatchPropertyCard({
  item,
  sessionId,
  selected,
  onToggleSelect,
  onExplain,
}: Props) {
  const t = useTranslations("match.results");
  const { property } = item;

  return (
    <article className="overflow-hidden bg-white ring-1 ring-black/[0.05] transition hover:shadow-[0_16px_32px_rgba(15,23,42,.08)]">
      <div className="relative aspect-[16/10]">
        <ListingImage
          src={property.image}
          alt={property.title}
          fill
          variant="card"
          className="object-cover"
        />
        <div className="absolute right-3 top-3">
          <MatchScoreBadge score={item.totalScore} />
        </div>
        {onToggleSelect ? (
          <label className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded bg-white/95 px-2 py-1 text-[11px] font-semibold">
            <input
              type="checkbox"
              checked={selected}
              onChange={onToggleSelect}
            />
            {t("compare")}
          </label>
        ) : null}
      </div>
      <div className="p-4">
        <h3 className="rk-display text-[15px] font-semibold text-[#0B1220]">
          {property.title}
        </h3>
        <p className="mt-1 text-base font-bold">
          {formatMarketplacePrice(property.price, property.currency)}
        </p>
        <p className="mt-1 flex items-center gap-1 text-xs text-[#6B7285]">
          <MapPin className="size-3" />
          {[property.neighborhood, property.city].filter(Boolean).join(", ")}
        </p>
        <p className="mt-2 flex gap-3 text-xs text-[#6B7285]">
          <span className="inline-flex items-center gap-1">
            <BedDouble className="size-3.5" />
            {property.bedrooms}
          </span>
          <span className="inline-flex items-center gap-1">
            <Bath className="size-3.5" />
            {property.bathrooms}
          </span>
          <span>{property.area} m²</span>
        </p>
        {item.reasons.length > 0 ? (
          <div className="mt-4">
            <p className="text-[11px] font-bold uppercase tracking-wider text-[#6B7285]">
              {t("why")}
            </p>
            <ul className="mt-1.5 space-y-1 text-sm text-[#374151]">
              {item.reasons.slice(0, 4).map((reason) => (
                <li key={reason}>✓ {reason}</li>
              ))}
            </ul>
          </div>
        ) : null}
        <div className="mt-4 flex flex-wrap gap-2">
          <Link
            href={`/imoveis/${property.id}?match=${sessionId}`}
            className="inline-flex h-10 items-center rounded-md bg-[#EBAD5B] px-4 text-sm font-bold text-[#1A1205]"
          >
            {t("viewProperty")}
          </Link>
          <button
            type="button"
            onClick={onExplain}
            className="inline-flex h-10 items-center rounded-md border border-[#D1D5DB] px-3 text-sm font-semibold"
          >
            {t("whyPercent", { score: item.totalScore })}
          </button>
        </div>
      </div>
    </article>
  );
}
