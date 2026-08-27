"use client";

import { ListingImage } from "@/components/listing-image";
import { Heart } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/routing";
import { useFavoriteButton } from "@/hooks/use-favorites";
import { formatListingCode, listingCodeKindFrom } from "@/lib/listings/listing-code";
import { CountryFlag } from "@/components/marketplace/country-flag";
import { formatMarketplacePrice } from "@/lib/marketplace/format";
import type { MarketplaceListing } from "@/lib/marketplace/types";
import { cn } from "@/lib/utils";

type Props = {
  item: MarketplaceListing;
};

function listingKind(item: MarketplaceListing): "property" | "vehicle" {
  return item.kind === "vehicle" ? "vehicle" : "property";
}

export function NewListingCard({ item }: Props) {
  const t = useTranslations("marketplace");
  const { active, handleClick } = useFavoriteButton(listingKind(item), item.id);

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
        <button
          type="button"
          onClick={handleClick}
          className={cn(
            "absolute right-1 top-1 inline-flex size-5 items-center justify-center rounded-full backdrop-blur-md",
            active ? "bg-[#EBAD5B] text-[#1A1205]" : "bg-white/90 text-[#1A1F2B]",
          )}
          aria-label={t("save")}
        >
          <Heart className={cn("size-2.5", active && "fill-current")} />
        </button>
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
