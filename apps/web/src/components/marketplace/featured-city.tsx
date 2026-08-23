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
    <section className="rounded-xl bg-white p-4 shadow-[0_8px_22px_rgba(15,23,42,.06)] ring-1 ring-black/[0.04] lg:p-5">
      <div className="mb-4 flex items-end justify-between gap-3">
        <h2 className="rk-display text-lg font-bold text-[#0B1220]">
          {t("featuredIn", { city: block.city })}
        </h2>
        <Link
          href={`/imoveis?city=${encodeURIComponent(block.city)}&locationLabel=${encodeURIComponent(block.city)}`}
          className="text-sm font-semibold text-[#0B1220] hover:text-[#D4A62A]"
        >
          {t("seeAll")}
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {block.items.map((item) => (
          <Link
            key={`${item.kind}-${item.id}`}
            href={item.href}
            className="group overflow-hidden rounded-lg ring-1 ring-black/[0.05] transition hover:shadow-md"
          >
            <div className="relative aspect-[16/10] overflow-hidden">
              <ListingImage
                src={item.image}
                alt={item.title}
                fill
                variant="thumb"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="200px"
              />
            </div>
            <div className="p-2.5">
              <p className="line-clamp-2 min-h-[2.25rem] text-xs font-semibold text-[#0B1220]">
                {item.title}
              </p>
              <p className="mt-1 text-sm font-bold text-[#E8A84A]">
                {formatMarketplacePrice(item.price, item.currency)}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
