import { setRequestLocale } from "next-intl/server";
import { HeroSection } from "@/components/home/hero-section";
import { FeaturedProperties } from "@/components/home/featured-properties";
import { MarketplaceCategories } from "@/components/home/marketplace-categories";
import { FeaturedVehicles } from "@/components/home/featured-vehicles";
import { EcosystemJourney } from "@/components/home/ecosystem-journey";
import { MarketplaceServices } from "@/components/home/marketplace-services";
import { WhyReeskova } from "@/components/home/why-reeskova";
import { SellCta } from "@/components/home/sell-cta";
import { NewsletterCta } from "@/components/home/newsletter-cta";
import { RscGroupSection } from "@/components/home/rsc-group-section";
import { Footer } from "@/components/layout/footer";
import { listHomeFeaturedProperties } from "@/lib/listings/property-repository";
import { listHomeFeaturedVehicles } from "@/lib/listings/vehicle-repository";

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

function formatMileage(mileage: number, locale: string) {
  return `${new Intl.NumberFormat(locale).format(mileage)} km`;
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [featuredListings, featuredVehicles] = await Promise.all([
    listHomeFeaturedProperties(3),
    listHomeFeaturedVehicles(4),
  ]);

  const featured = featuredListings.map((item) => ({
    id: item.id,
    title: item.title,
    place: [item.city, item.state].filter(Boolean).join(", "),
    priceLabel: formatHomePrice(item.price, item.currency),
    beds: item.bedrooms ?? 0,
    baths: item.bathrooms ?? 0,
    area: item.area ?? 0,
    garage: item.garage ?? 0,
    transaction:
      item.transaction === "rent"
        ? ("rent" as const)
        : ("buy" as const),
    badge: item.premium
      ? ("premium" as const)
      : item.launch
        ? ("new" as const)
        : ("featured" as const),
    image: item.image,
  }));

  const vehicles = featuredVehicles.map((item) => ({
    id: item.id,
    title: item.title,
    year: item.year,
    mileageLabel: formatMileage(item.mileage, locale),
    priceLabel: formatHomePrice(item.price, item.currency),
    image: item.image,
  }));

  return (
    <>
      <HeroSection />
      <FeaturedProperties items={featured} />
      <MarketplaceCategories />
      <FeaturedVehicles items={vehicles} />
      <EcosystemJourney />
      <MarketplaceServices />
      <WhyReeskova />
      <SellCta />
      <NewsletterCta />
      <RscGroupSection />
      <Footer />
    </>
  );
}
