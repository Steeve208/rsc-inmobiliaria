"use client";

import { ListingImage } from "@/components/listing-image";
import { Link } from "@/lib/i18n/routing";
import { formatMarketplacePrice } from "@/lib/marketplace/format";
import type { MarketplaceListing } from "@/lib/marketplace/types";

type Props = {
  item: MarketplaceListing;
};

export function ExploreCard({ item }: Props) {
  return (
    <article className="group w-[42vw] shrink-0 overflow-hidden rounded-lg bg-white ring-1 ring-black/[0.05] transition hover:shadow-md sm:w-[170px]">
      <div className="relative aspect-[4/3] overflow-hidden">
        <Link href={item.href} className="absolute inset-0 block">
          <ListingImage
            src={item.image}
            alt={item.title}
            fill
            variant="thumb"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="170px"
          />
        </Link>
      </div>
      <Link href={item.href} className="block p-2.5">
        <h3 className="line-clamp-2 min-h-[2.25rem] text-xs font-semibold text-[#0B1220]">
          {item.title}
        </h3>
        <p className="mt-1 text-sm font-bold text-[#1E9B8C]">
          {formatMarketplacePrice(item.price, item.currency)}
        </p>
      </Link>
    </article>
  );
}
