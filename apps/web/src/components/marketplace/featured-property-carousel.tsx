"use client";

import { MarketplaceCarousel } from "@/components/marketplace/marketplace-carousel";
import { MarketplacePropertyCard } from "@/components/marketplace/property-card";
import { useTranslations } from "next-intl";
import type { MarketplaceListing } from "@/lib/marketplace/types";

type Props = {
  items: MarketplaceListing[];
};

export function FeaturedPropertyCarousel({ items }: Props) {
  const t = useTranslations("marketplace");
  if (items.length === 0) return null;

  return (
    <MarketplaceCarousel
      title={t("featuredProperties")}
      href="/imoveis?featured=1"
      hrefLabel={t("seeAll")}
    >
      {items.map((item) => (
        <MarketplacePropertyCard key={item.id} item={item} />
      ))}
    </MarketplaceCarousel>
  );
}
