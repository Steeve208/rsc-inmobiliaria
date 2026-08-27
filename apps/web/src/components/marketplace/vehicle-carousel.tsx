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

  const visible = items.slice(0, 5);

  return (
    <>
      <MarketplaceCarousel
        title={t("popularVehicles")}
        href="/veiculos"
        hrefLabel={t("seeAll")}
        columns={5}
        className="hidden min-w-0 lg:block"
      >
        {visible.map((item) => (
          <MarketplaceVehicleCard key={item.id} item={item} fill />
        ))}
      </MarketplaceCarousel>
      <MarketplaceCarousel
        title={t("popularVehicles")}
        href="/veiculos"
        hrefLabel={t("seeAll")}
        className="lg:hidden"
      >
        {visible.map((item) => (
          <MarketplaceVehicleCard key={`m-${item.id}`} item={item} compact />
        ))}
      </MarketplaceCarousel>
    </>
  );
}
