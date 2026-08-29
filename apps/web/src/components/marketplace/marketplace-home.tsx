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
    <div className="bg-[#F4F7FA] pb-16 text-[#0B1220] md:pb-0">
      <div className="rk-container py-2">
        <section className="overflow-hidden rounded-xl bg-white shadow-[0_2px_10px_rgba(15,23,42,.06)] ring-1 ring-black/[0.05]">
          <div className="grid grid-cols-1 lg:h-[360px] lg:grid-cols-[210px_minmax(0,1fr)_236px]">
            <div className="hidden h-full overflow-hidden border-r border-[#E8EEF4] lg:block">
              <QuickPicks items={data.quickPicks} />
            </div>
            <div className="h-full min-w-0 overflow-hidden">
              <MarketplaceHero hero={data.hero} />
            </div>
            <div className="hidden h-full overflow-hidden lg:block">
              <PromoPanels panels={data.promoPanels} />
            </div>
          </div>

          <div className="border-t border-[#E8EEF4] lg:hidden">
            <MobileQuickPicks items={data.quickPicks} />
          </div>
          <div className="border-t border-[#E8EEF4] lg:hidden">
            <PromoPanels panels={data.promoPanels} />
          </div>
          <div className="border-t border-[#E8EEF4]">
            <CategoryShortcuts items={data.categoryShortcuts} />
          </div>
        </section>

        <div className="mt-3 grid items-stretch gap-3 xl:grid-cols-[minmax(0,1fr)_260px]">
          <div className="min-w-0">
            <DealCarousel items={data.deals} href={data.dealsSeeAllHref} />
          </div>
          <aside className="hidden min-h-0 xl:block">
            {data.featuredCity ? <FeaturedCity block={data.featuredCity} /> : null}
          </aside>
        </div>

        {data.featuredCity ? (
          <div className="mt-3 xl:hidden">
            <FeaturedCity block={data.featuredCity} />
          </div>
        ) : null}

        <div className="mt-3 grid items-start gap-3 xl:grid-cols-[minmax(0,1.65fr)_minmax(0,1fr)]">
          <FeaturedPropertyCarousel
            items={data.featuredProperties}
            href={data.featuredPropertiesSeeAllHref}
          />
          <VehicleCarousel
            items={data.popularVehicles}
            href={data.popularVehiclesSeeAllHref}
          />
        </div>

        <div className="mt-3">
          <NewListingsCarousel
            items={data.newListings}
            href={data.newListingsSeeAllHref}
          />
        </div>
      </div>

      <TrustBar />
      <MarketplaceFooter />
    </div>
  );
}
