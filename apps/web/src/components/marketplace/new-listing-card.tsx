"use client";

import { ListingImage } from "@/components/listing-image";
import { Link } from "@/lib/i18n/routing";
import { formatListingCode, listingCodeKindFrom } from "@/lib/listings/listing-code";
import { CountryFlag } from "@/components/marketplace/country-flag";
import { formatMarketplacePrice } from "@/lib/marketplace/format";
import type { MarketplaceListing } from "@/lib/marketplace/types";

type Props = {
  item: MarketplaceListing;
};

export function NewListingCard({ item }: Props) {
  return (
    <article className="group flex w-[240px] shrink-0 overflow-hidden rounded-md bg-white ring-1 ring-black/[0.05] transition hover:shadow-md">
      <div className="relative h-[78px] w-[92px] shrink-0 overflow-hidden">
        <Link href={item.href} className="absolute inset-0 block">
          <ListingImage
            src={item.image}
            alt={item.title}
            fill
            variant="thumb"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="92px"
          />
        </Link>
        <CountryFlag
          country={item.country ?? item.location}
          className="absolute bottom-1 left-1 text-[11px] drop-shadow-[0_1px_2px_rgba(0,0,0,.7)]"
        />
      </div>
      <Link href={item.href} className="flex min-w-0 flex-1 flex-col justify-center px-3 py-2">
        <h3 className="line-clamp-2 text-xs font-semibold leading-snug text-[#0B1220]">
          {item.title}
        </h3>
        <p className="mt-0.5 font-mono text-[10px] font-bold tracking-wide text-[#C9972A]">
          {formatListingCode(item.id, item.code, listingCodeKindFrom(item.kind))}
        </p>
        <p className="mt-1 text-sm font-bold text-[#0B1220]">
          {formatMarketplacePrice(item.price, item.currency)}
        </p>
      </Link>
    </article>
  );
}
