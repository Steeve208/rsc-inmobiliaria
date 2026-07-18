import { setRequestLocale } from "next-intl/server";
import { HeroSection } from "@/components/home/hero-section";
import { EcosystemStrip } from "@/components/home/ecosystem-strip";
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
import { listHomeFeaturedProperties } from "@/lib/listings/property-repository";

type Props = {
  params: Promise<{ locale: string }>;
};

function formatHomePrice(price: number, currency: string) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: currency || "BRL",
    maximumFractionDigits: 0,
  }).format(price);
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [reviews, featuredListings] = await Promise.all([
    listPublishedPlatformReviews(8),
    listHomeFeaturedProperties(4),
  ]);

  const featured = featuredListings.map((item) => ({
    id: item.id,
    title: item.title,
    place: [item.neighborhood, item.city, item.state].filter(Boolean).join(", "),
    priceLabel: formatHomePrice(item.price, item.currency),
    beds: item.bedrooms ?? 0,
    baths: item.bathrooms ?? 0,
    area: item.area ?? 0,
    badge: item.premium ? ("premium" as const) : item.launch ? ("new" as const) : null,
    image: item.image,
  }));

  return (
    <>
      <HeroSection />
      <EcosystemStrip />
      <StatsBar />
      <FeaturedProperties items={featured} />
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
