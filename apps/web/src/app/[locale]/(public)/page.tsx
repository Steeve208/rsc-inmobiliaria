import { setRequestLocale } from "next-intl/server";
import { HeroSection } from "@/components/home/hero-section";
import { StatsBar } from "@/components/home/stats-bar";
import { FeaturedProperties } from "@/components/home/featured-properties";
import { ServiceCards } from "@/components/home/service-cards";
import { HowItWorks } from "@/components/home/how-it-works";
import { InvestmentMarketplace } from "@/components/home/investment-marketplace";
import { PartnerSpotlight } from "@/components/home/partner-spotlight";
import { Testimonials } from "@/components/home/testimonials";
import { Partners } from "@/components/home/partners";
import { Footer } from "@/components/layout/footer";
import { listPublishedPlatformReviews } from "@/lib/reviews/store";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const reviews = await listPublishedPlatformReviews(8);

  return (
    <>
      <HeroSection />
      <StatsBar />
      <FeaturedProperties />
      <ServiceCards />
      <HowItWorks />
      <InvestmentMarketplace />
      <PartnerSpotlight />
      {reviews.length > 0 ? <Testimonials reviews={reviews} /> : null}
      <Partners />
      <Footer />
    </>
  );
}
