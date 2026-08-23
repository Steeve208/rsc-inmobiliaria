"use client";

import { DealCard } from "@/components/marketplace/deal-card";
import { MarketplaceCarousel } from "@/components/marketplace/marketplace-carousel";
import { useTranslations } from "next-intl";
import type { MarketplaceListing } from "@/lib/marketplace/types";

type Props = {
  items: MarketplaceListing[];
};

export function DealCarousel({ items }: Props) {
  const t = useTranslations("marketplace");
  if (items.length === 0) return null;

  return (
    <MarketplaceCarousel title={t("deals")} href="/imoveis" hrefLabel={t("seeAll")}>
      {items.map((item, index) => (
        <DealCard
          key={`${item.kind}-${item.id}`}
          item={item}
          featured={index === 0}
        />
      ))}
    </MarketplaceCarousel>
  );
}
