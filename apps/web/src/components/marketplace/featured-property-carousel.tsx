"use client";

import { MarketplaceCarousel } from "@/components/marketplace/marketplace-carousel";
import { MarketplacePropertyCard } from "@/components/marketplace/property-card";
import { useTranslations } from "next-intl";
import type { MarketplaceListing } from "@/lib/marketplace/types";

type Props = {
  items: MarketplaceListing[];
  href?: string;
};

export function FeaturedPropertyCarousel({
  items,
  href = "/imoveis?featured=1",
}: Props) {
  const t = useTranslations("marketplace");
  if (items.length === 0) return null;

  const visible = items.slice(0, 5);

  return (
    <>
      <MarketplaceCarousel
        title={t("featuredProperties")}
        href={href}
        hrefLabel={t("seeAll")}
        columns={5}
        className="hidden min-w-0 lg:block"
      >
        {visible.map((item) => (
          <MarketplacePropertyCard key={item.id} item={item} fill />
        ))}
      </MarketplaceCarousel>
      <MarketplaceCarousel
        title={t("featuredProperties")}
        href={href}
        hrefLabel={t("seeAll")}
        className="lg:hidden"
      >
        {visible.map((item) => (
          <MarketplacePropertyCard key={`m-${item.id}`} item={item} />
        ))}
      </MarketplaceCarousel>
    </>
  );
}
