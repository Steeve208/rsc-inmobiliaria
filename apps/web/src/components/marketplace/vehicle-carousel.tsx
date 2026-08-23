"use client";

import { MarketplaceCarousel } from "@/components/marketplace/marketplace-carousel";
import { MarketplaceVehicleCard } from "@/components/marketplace/vehicle-card";
import { useTranslations } from "next-intl";
import type { MarketplaceListing } from "@/lib/marketplace/types";

type Props = {
  items: MarketplaceListing[];
};

export function VehicleCarousel({ items }: Props) {
  const t = useTranslations("marketplace");
  if (items.length === 0) return null;

  return (
    <MarketplaceCarousel
      title={t("popularVehicles")}
      href="/veiculos"
      hrefLabel={t("seeAll")}
    >
      {items.map((item) => (
        <MarketplaceVehicleCard key={item.id} item={item} />
      ))}
    </MarketplaceCarousel>
  );
}
