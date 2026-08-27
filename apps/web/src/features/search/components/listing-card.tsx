"use client";

import { ListingImage } from "@/components/listing-image";
import { useTranslations } from "next-intl";
import { Bath, BedDouble, Car, MapPin, Waves } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ListingCodeBadge } from "@/components/marketplace/listing-code-badge";
import { listingCodeKindFrom } from "@/lib/listings/listing-code";
import { Link } from "@/lib/i18n/routing";
import type { ListingItem } from "../types";

type Props = {
  item: ListingItem;
  variant?: "list" | "gallery";
};

function formatPrice(price: number, currency: string) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(price);
}

function detailHref(item: ListingItem) {
  if (item.category === "vehicles") return `/veiculos/${item.id}`;
  return `/imoveis/${item.id}`;
}

export function ListingCard({ item, variant = "list" }: Props) {
  const t = useTranslations("search");
  const href = detailHref(item);

  if (variant === "gallery") {
    return (
      <Link href={href} className="block">
        <article className="group overflow-hidden rounded-xl border border-white/10 bg-[#081128]/60 transition-colors hover:border-white/20">
          <div className="relative aspect-[4/3] overflow-hidden">
            <ListingImage
              src={item.image}
              alt={item.title}
              fill
              variant="card"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width:768px) 100vw, 33vw"
            />
            {item.financing && (
              <Badge className="absolute left-3 top-3 bg-[#1d4ed8] text-white">
                {t("filters.financingAvailable")}
              </Badge>
            )}
            <ListingCodeBadge
              id={item.id}
              kind={listingCodeKindFrom(item.category)}
              className="absolute bottom-3 left-3"
            />
          </div>
          <div className="p-4">
            <p className="text-lg font-semibold text-white">
              {formatPrice(item.price, item.currency)}
            </p>
            <h3 className="mt-1 font-medium text-white/90">{item.title}</h3>
            <p className="mt-1 flex items-center gap-1 text-xs text-white/50">
              <MapPin className="size-3" />
              {item.neighborhood}, {item.city} - {item.state}
            </p>
          </div>
        </article>
      </Link>
    );
  }

  return (
    <Link href={href} className="block">
      <article className="flex flex-col gap-4 overflow-hidden rounded-xl border border-white/10 bg-[#081128]/60 transition hover:border-white/20 sm:flex-row">
        <div className="relative h-48 w-full shrink-0 sm:h-auto sm:w-64">
          <ListingImage
            src={item.image}
            alt={item.title}
            fill
            variant="card"
            className="object-cover"
            sizes="256px"
          />
          <ListingCodeBadge
            id={item.id}
            kind={listingCodeKindFrom(item.category)}
            className="absolute bottom-3 left-3"
          />
        </div>
        <div className="flex flex-1 flex-col justify-between p-4 sm:py-5">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-xl font-semibold text-white">
                {formatPrice(item.price, item.currency)}
              </p>
              {item.financing && (
                <Badge
                  variant="secondary"
                  className="bg-[#1d4ed8]/20 text-[#93c5fd]"
                >
                  {t("filters.financingAvailable")}
                </Badge>
              )}
            </div>
            <h3 className="mt-1 text-base font-medium text-white">
              {item.title}
            </h3>
            <p className="mt-1 flex items-center gap-1 text-sm text-white/50">
              <MapPin className="size-3.5" />
              {item.neighborhood}, {item.city} - {item.state}, {item.country}
            </p>
            <p className="mt-1 text-xs text-white/40">{item.company}</p>
          </div>
          <div className="mt-3 flex flex-wrap gap-3 text-xs text-white/55">
            {item.bedrooms ? (
              <span className="inline-flex items-center gap-1">
                <BedDouble className="size-3.5" />
                {item.bedrooms}
              </span>
            ) : null}
            {item.bathrooms ? (
              <span className="inline-flex items-center gap-1">
                <Bath className="size-3.5" />
                {item.bathrooms}
              </span>
            ) : null}
            {item.garage ? (
              <span className="inline-flex items-center gap-1">
                <Car className="size-3.5" />
                {item.garage}
              </span>
            ) : null}
            {item.pool ? (
              <span className="inline-flex items-center gap-1">
                <Waves className="size-3.5" />
              </span>
            ) : null}
            {item.area ? <span>{item.area} m²</span> : null}
          </div>
        </div>
      </article>
    </Link>
  );
}
