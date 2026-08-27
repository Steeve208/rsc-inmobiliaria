"use client";

import { MarketplaceCarousel } from "@/components/marketplace/marketplace-carousel";
import { ListingPropertyCard } from "@/components/marketplace/properties/listing-card";
import { useTranslations } from "next-intl";
import type { PropertyListing } from "@/features/imoveis/types";

type Props = {
  premiumItems: PropertyListing[];
  newItems: PropertyListing[];
  showPremium: boolean;
  showNew: boolean;
};

export function PropertyListingSections({
  premiumItems,
  newItems,
  showPremium,
  showNew,
}: Props) {
  const t = useTranslations("imoveis.sections");
  const tMarket = useTranslations("marketplace");

  return (
    <>
      {showPremium && premiumItems.length > 0 ? (
        <MarketplaceCarousel
          title={t("premium")}
          href="/imoveis?featured=1"
          hrefLabel={tMarket("seeAll")}
          className="py-3 sm:py-4"
        >
          {premiumItems.map((item) => (
            <div
              key={`premium-${item.id}`}
              className="w-[80vw] shrink-0 sm:w-[260px]"
            >
              <ListingPropertyCard item={item} />
            </div>
          ))}
        </MarketplaceCarousel>
      ) : null}

      {showNew && newItems.length > 0 ? (
        <MarketplaceCarousel
          title={t("newListings")}
          href="/imoveis?sort=newest"
          hrefLabel={tMarket("seeAll")}
          className="py-3 sm:py-4"
        >
          {newItems.map((item) => (
            <div key={`new-${item.id}`} className="w-[80vw] shrink-0 sm:w-[260px]">
              <ListingPropertyCard item={item} />
            </div>
          ))}
        </MarketplaceCarousel>
      ) : null}
    </>
  );
}
