"use client";

import { ListingImage } from "@/components/listing-image";
import { Heart } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/routing";
import { useFavoriteButton } from "@/hooks/use-favorites";
import { formatMarketplacePrice } from "@/lib/marketplace/format";
import type { MarketplaceListing } from "@/lib/marketplace/types";
import { cn } from "@/lib/utils";

type Props = {
  item: MarketplaceListing;
};

function listingKind(item: MarketplaceListing): "property" | "vehicle" {
  return item.kind === "vehicle" ? "vehicle" : "property";
}

export function ExploreCard({ item }: Props) {
  const t = useTranslations("marketplace");
  const { active, handleClick } = useFavoriteButton(listingKind(item), item.id);

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
        <button
          type="button"
          onClick={handleClick}
          className={cn(
            "absolute right-1.5 top-1.5 inline-flex size-6 items-center justify-center rounded-full backdrop-blur-md",
            active ? "bg-[#D4A62A] text-[#070B14]" : "bg-white/90 text-[#1A1F2B]",
          )}
          aria-label={t("save")}
        >
          <Heart className={cn("size-3", active && "fill-current")} />
        </button>
      </div>
      <Link href={item.href} className="block p-2.5">
        <h3 className="line-clamp-2 min-h-[2.25rem] text-xs font-semibold text-[#0B1220]">
          {item.title}
        </h3>
        <p className="mt-1 text-sm font-bold text-[#D4A62A]">
          {formatMarketplacePrice(item.price, item.currency)}
        </p>
      </Link>
    </article>
  );
}
