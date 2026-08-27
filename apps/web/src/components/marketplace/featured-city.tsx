"use client";

import { ListingImage } from "@/components/listing-image";
import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/routing";
import { formatMarketplacePrice } from "@/lib/marketplace/format";
import type { FeaturedCityBlock } from "@/lib/marketplace/types";

type Props = {
  block: FeaturedCityBlock;
};

export function FeaturedCity({ block }: Props) {
  const t = useTranslations("marketplace");

  return (
    <section className="flex h-full flex-col rounded-lg bg-white p-2.5 ring-1 ring-black/[0.04]">
      <div className="mb-2 flex h-8 items-center justify-between gap-2">
        <h2 className="rk-display text-[15px] font-bold leading-tight text-[#0B1220]">
          {t("featuredIn", { city: block.city })}
        </h2>
        <Link
          href={`/imoveis?city=${encodeURIComponent(block.city)}&locationLabel=${encodeURIComponent(block.city)}`}
          className="shrink-0 text-[12px] font-semibold text-[#2563EB] hover:text-[#1D4ED8]"
        >
          {t("seeAll")}
        </Link>
      </div>
      <div className="grid flex-1 grid-cols-2 grid-rows-2 gap-2">
        {block.items.slice(0, 4).map((item) => (
          <Link
            key={`${item.kind}-${item.id}`}
            href={item.href}
            className="group flex min-h-0 flex-col overflow-hidden rounded-md ring-1 ring-black/[0.05] transition hover:shadow-md"
          >
            <div className="relative min-h-0 flex-1 overflow-hidden">
              <ListingImage
                src={item.image}
                alt={item.title}
                fill
                variant="thumb"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="140px"
              />
            </div>
            <div className="shrink-0 p-1.5">
              <p className="line-clamp-1 text-[11px] font-semibold text-[#0B1220]">
                {item.title}
              </p>
              <p className="mt-0.5 text-[12px] font-bold text-[#0B1220]">
                {formatMarketplacePrice(item.price, item.currency)}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
