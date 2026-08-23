"use client";

import { ExploreCard } from "@/components/marketplace/explore-card";
import { MarketplaceCarousel } from "@/components/marketplace/marketplace-carousel";
import { useTranslations } from "next-intl";
import type { MarketplaceListing } from "@/lib/marketplace/types";

type Props = {
  items: MarketplaceListing[];
};

export function ContinueExploring({ items }: Props) {
  const t = useTranslations("marketplace");
  if (items.length === 0) return null;

  return (
    <MarketplaceCarousel title={t("continueExploring")} href="/imoveis" hrefLabel={t("seeAll")}>
      {items.map((item) => (
        <ExploreCard key={`${item.kind}-${item.id}`} item={item} />
      ))}
    </MarketplaceCarousel>
  );
}
