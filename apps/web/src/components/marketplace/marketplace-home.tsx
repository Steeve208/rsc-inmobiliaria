import { QuickPicks } from "@/components/marketplace/quick-picks";
import { MarketplaceHero } from "@/components/marketplace/marketplace-hero";
import { PromoPanels } from "@/components/marketplace/promo-panels";
import { CategoryShortcuts } from "@/components/marketplace/category-shortcuts";
import { DealCarousel } from "@/components/marketplace/deal-carousel";
import { FeaturedPropertyCarousel } from "@/components/marketplace/featured-property-carousel";
import { NewListingsCarousel } from "@/components/marketplace/new-listings-carousel";
import { VehicleCarousel } from "@/components/marketplace/vehicle-carousel";
import { FeaturedCity } from "@/components/marketplace/featured-city";
import { TrustBar } from "@/components/marketplace/trust-bar";
import { MarketplaceFooter } from "@/components/marketplace/marketplace-footer";
import { MobileQuickPicks } from "@/components/marketplace/mobile-quick-picks";
import type { MarketplaceHomeData } from "@/lib/marketplace/types";

type Props = {
  data: MarketplaceHomeData;
};

export function MarketplaceHome({ data }: Props) {
  return (
    <div className="bg-[#F4F4F5] pb-16 text-[#0B1220] md:pb-0">
      <div className="rk-container py-4 lg:py-5">
        <div className="grid items-stretch gap-3 lg:h-[320px] lg:grid-cols-[210px_minmax(0,1fr)_188px] xl:h-[338px] xl:grid-cols-[220px_minmax(0,1fr)_200px]">
          <div className="hidden h-full lg:block">
            <QuickPicks />
          </div>
          <MarketplaceHero />
          <div className="lg:hidden">
            <MobileQuickPicks />
          </div>
          <PromoPanels />
        </div>

        <div className="mt-4">
          <CategoryShortcuts />
        </div>

        <div className="mt-1 grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_280px]">
          <div className="min-w-0">
            <DealCarousel items={data.deals} />
          </div>
          <aside className="hidden xl:block">
            {data.featuredCity ? <FeaturedCity block={data.featuredCity} /> : null}
          </aside>
        </div>

        {data.featuredCity ? (
          <div className="mt-2 xl:hidden">
            <FeaturedCity block={data.featuredCity} />
          </div>
        ) : null}

        <FeaturedPropertyCarousel items={data.featuredProperties} />
        <VehicleCarousel items={data.popularVehicles} />
        <NewListingsCarousel items={data.newListings} />
      </div>

      <TrustBar />
      <MarketplaceFooter />
    </div>
  );
}
