"use client";

import { MarketplaceCarousel } from "@/components/marketplace/marketplace-carousel";
import { NewListingCard } from "@/components/marketplace/new-listing-card";
import { useTranslations } from "next-intl";
import type { MarketplaceListing } from "@/lib/marketplace/types";

type Props = {
  items: MarketplaceListing[];
  href?: string;
};

export function NewListingsCarousel({ items, href = "/imoveis" }: Props) {
  const t = useTranslations("marketplace");
  if (items.length === 0) return null;

  return (
    <MarketplaceCarousel
      title={t("newListings")}
      href={href}
      hrefLabel={t("seeAll")}
    >
      {items.map((item) => (
        <NewListingCard key={`${item.kind}-${item.id}`} item={item} />
      ))}
    </MarketplaceCarousel>
  );
}
