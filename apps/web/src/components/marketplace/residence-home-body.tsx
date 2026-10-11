"use client";

import { ArrowRight, Bath, BedDouble, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { ListingImage } from "@/components/listing-image";
import { Link } from "@/lib/i18n/routing";
import { formatMarketplacePrice } from "@/lib/marketplace/format";
import type { MarketplaceListing } from "@/lib/marketplace/types";
import { cn } from "@/lib/utils";

export type HomeDestination = {
  name: string;
  count: number;
  href: string;
  image: string;
  fromPrice?: number;
  currency?: string;
};

type Props = {
  properties: MarketplaceListing[];
  destinations: HomeDestination[];
};

const serif = { fontFamily: "var(--font-playfair), Georgia, serif" };

const COLLECTIONS = [
  {
    key: "estates" as const,
    href: "/imoveis",
    image:
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=900&q=80",
  },
  {
    key: "waterfront" as const,
    href: "/imoveis",
    image:
      "https://images.pexels.com/photos/31817160/pexels-photo-31817160.jpeg?auto=compress&cs=tinysrgb&w=900",
  },
  {
    key: "apartments" as const,
    href: "/imoveis",
    image:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=900&q=80",
  },
];

const row =
  "grid items-center gap-3 lg:grid-cols-[minmax(0,12rem)_minmax(0,1fr)] lg:gap-x-4";
const heading = "mt-1 text-[1.55rem] leading-[1.05] tracking-[-0.015em]";

export function ResidenceHomeBody({ properties, destinations }: Props) {
  const t = useTranslations("marketplace.residence.body");
  const [page, setPage] = useState(0);
  const pageSize = 3;
  const pageCount = Math.max(1, Math.ceil(properties.length / pageSize));
  const featured = properties.slice(page * pageSize, page * pageSize + pageSize);

  return (
    <div className="bg-[#f7f5f2] text-[#1c1917]">
      <div className="mx-auto w-full max-w-[1480px] px-5 py-5 sm:px-6 lg:px-8">
      <section>
        <div className={row}>
          <Copy
            eyebrow={t("collectionsEyebrow")}
            title={t("collectionsTitle")}
            text={t("collectionsText")}
            link={t("collectionsLink")}
            href="/imoveis"
          />
          <div className="grid min-w-0 grid-cols-1 gap-2 sm:grid-cols-3">
            {COLLECTIONS.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                className="group relative aspect-[19/10] min-w-0 overflow-hidden rounded-xl"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.image}
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
                <span className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />
                <span className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 p-2.5">
                  <span className="min-w-0">
                    <span className="block text-[14px] leading-tight text-white" style={serif}>
                      {t(`collections.${item.key}.title`)}
                    </span>
                    <span className="mt-0.5 line-clamp-2 text-[10px] leading-snug text-white/75">
                      {t(`collections.${item.key}.subtitle`)}
                    </span>
                  </span>
                  <CardArrow />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <div className="mt-2 flex items-center justify-end gap-1.5">
          <Link href="/imoveis" className="inline-flex items-center gap-1 text-[12px] text-[#3f3a34] hover:text-black">
            {t("featuredLink")}
            <ArrowRight className="size-3" />
          </Link>
          <button
            type="button"
            aria-label={t("featuredLink")}
            disabled={page === 0}
            onClick={() => setPage((value) => Math.max(0, value - 1))}
            className="inline-flex size-6 items-center justify-center rounded-full border border-[#d9d3c8] text-[#3f3a34] disabled:opacity-30"
          >
            <ChevronLeft className="size-3" />
          </button>
          <button
            type="button"
            aria-label={t("featuredLink")}
            disabled={page >= pageCount - 1}
            onClick={() => setPage((value) => Math.min(pageCount - 1, value + 1))}
            className="inline-flex size-6 items-center justify-center rounded-full border border-[#d9d3c8] text-[#3f3a34] disabled:opacity-30"
          >
            <ChevronRight className="size-3" />
          </button>
      </div>
      <section className="mt-1.5">
        <div className={row}>
          <Copy eyebrow={t("featuredEyebrow")} title={t("featuredTitle")} className="lg:-translate-y-8" />
          {featured.length > 0 ? (
            <div className="grid min-w-0 grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {featured.map((item) => (
                <PropertyCard key={item.id} item={item} />
              ))}
            </div>
          ) : (
            <p className="text-sm text-[#8a8175]">{t("featuredEmpty")}</p>
          )}
        </div>
      </section>

      <section className="mt-2.5">
        <div className={row}>
          <Copy
            eyebrow={t("destinationsEyebrow")}
            title={t("destinationsTitle")}
            text={t("destinationsText")}
            link={t("destinationsLink")}
            href="/destinos"
          />
          {destinations.length > 0 ? (
            <div className="grid min-w-0 grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
              {destinations.map((item) => (
                <Link key={item.name} href={item.href} className="group relative aspect-[7/5] min-w-0 overflow-hidden rounded-xl">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.image}
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                  <span className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <span className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-1.5 p-2.5">
                    <span className="min-w-0">
                      <span className="block truncate text-[13px] leading-tight text-white" style={serif}>
                        {item.name}
                      </span>
                      <span className="mt-0.5 block truncate text-[10px] text-white/80">
                        {item.fromPrice && item.currency
                          ? t("fromPrice", { price: formatMarketplacePrice(item.fromPrice, item.currency) })
                          : t("propertiesCount", { count: item.count })}
                      </span>
                    </span>
                    <CardArrow />
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <div />
          )}
        </div>
      </section>
      </div>
    </div>
  );
}

function CardArrow() {
  return (
    <span className="inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-white text-[#1c1917] shadow-sm">
      <ArrowRight className="size-3" />
    </span>
  );
}

function Copy({
  eyebrow,
  title,
  text,
  link,
  href,
  className,
}: {
  eyebrow: string;
  title: string;
  text?: string;
  link?: string;
  href?: string;
  className?: string;
}) {
  return (
    <div className={cn("min-w-0", className)}>
      <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#8a8175]">{eyebrow}</p>
      <h2 className={heading} style={serif}>
        {title}
      </h2>
      {text ? <p className="mt-2 text-[11px] leading-snug text-[#6b645c]">{text}</p> : null}
      {link && href ? (
        <Link href={href} className="mt-2.5 inline-flex items-center gap-1 text-[12px] text-[#3f3a34] hover:text-black">
          {link}
          <ArrowRight className="size-3" />
        </Link>
      ) : null}
    </div>
  );
}

function PropertyCard({ item }: { item: MarketplaceListing }) {
  const t = useTranslations("marketplace.residence.body");
  const area = item.area && item.area > 0 ? `${new Intl.NumberFormat().format(item.area)} m²` : null;

  return (
    <article className="min-w-0 overflow-hidden rounded-xl border border-[#e7e1d8] bg-white">
      <div className="relative aspect-[13/5]">
        <Link href={item.href} className="absolute inset-0">
          <ListingImage src={item.image} alt={item.title} fill className="object-cover" sizes="320px" />
        </Link>
        <span className="absolute left-2.5 top-2.5 rounded-sm bg-white/95 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-[0.14em] text-[#1c1917]">
          {t("featuredBadge")}
        </span>
      </div>
      <div className="px-2.5 py-2">
        <p className="truncate text-[10px] text-[#8a8175]">{item.location}</p>
        <p className="truncate text-[13px] leading-tight" style={serif}>
          {item.type || item.title}
        </p>
        <p className="mt-0.5 text-[13px] font-medium">
          {item.price > 0 ? formatMarketplacePrice(item.price, item.currency) : "—"}
        </p>
        <p className="mt-2 flex flex-wrap items-center gap-2.5 text-[11px] text-[#8a8175]">
          {item.bedrooms ? (
            <span className="inline-flex items-center gap-1">
              <BedDouble className="size-3" />
              {item.bedrooms} {t("beds")}
            </span>
          ) : null}
          {item.bathrooms ? (
            <span className="inline-flex items-center gap-1">
              <Bath className="size-3" />
              {item.bathrooms} {t("baths")}
            </span>
          ) : null}
          {area ? <span>{area}</span> : null}
        </p>
      </div>
    </article>
  );
}
