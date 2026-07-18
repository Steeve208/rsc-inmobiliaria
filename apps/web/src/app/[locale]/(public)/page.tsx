import { setRequestLocale } from "next-intl/server";
import { desc } from "drizzle-orm";
import { HeroSection } from "@/components/home/hero-section";
import { MarketplaceCategories } from "@/components/home/marketplace-categories";
import { FeaturedProperties } from "@/components/home/featured-properties";
import { FeaturedVehicles } from "@/components/home/featured-vehicles";
import { VerifiedCompanies } from "@/components/home/verified-companies";
import { MarketplaceServices } from "@/components/home/marketplace-services";
import { Partners } from "@/components/home/partners";
import { NewsletterCta } from "@/components/home/newsletter-cta";
import { Footer } from "@/components/layout/footer";
import { listHomeFeaturedProperties } from "@/lib/listings/property-repository";
import { listHomeFeaturedVehicles } from "@/lib/listings/vehicle-repository";
import { db } from "@/lib/db";
import { company } from "@/lib/db/schema";

type Props = {
  params: Promise<{ locale: string }>;
};

function formatHomePrice(price: number, currency: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency || "USD",
    maximumFractionDigits: 0,
  }).format(price);
}

function formatMileage(mileage: number, locale: string) {
  return `${new Intl.NumberFormat(locale).format(mileage)} km`;
}

async function listHomeCompanies(limit = 6) {
  try {
    const rows = await db
      .select({
        id: company.id,
        name: company.name,
        logoUrl: company.logoUrl,
      })
      .from(company)
      .orderBy(desc(company.verified), desc(company.activeListings))
      .limit(limit);

    return rows.map((row) => ({
      id: row.id,
      name: row.name,
      logo:
        row.logoUrl ??
        "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=400&q=80",
    }));
  } catch {
    return [];
  }
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [featuredListings, featuredVehicles, companies] = await Promise.all([
    listHomeFeaturedProperties(4),
    listHomeFeaturedVehicles(4),
    listHomeCompanies(6),
  ]);

  const featured = featuredListings.map((item) => ({
    id: item.id,
    title: item.title,
    place: [item.neighborhood, item.city, item.state].filter(Boolean).join(", "),
    priceLabel: formatHomePrice(item.price, item.currency),
    beds: item.bedrooms ?? 0,
    baths: item.bathrooms ?? 0,
    area: item.area ?? 0,
    badge: item.premium
      ? ("premium" as const)
      : item.launch
        ? ("new" as const)
        : null,
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
      <MarketplaceCategories />
      <FeaturedProperties items={featured} />
      <FeaturedVehicles items={vehicles} />
      <VerifiedCompanies items={companies} />
      <MarketplaceServices />
      <div id="partners">
        <Partners />
      </div>
      <NewsletterCta />
      <Footer />
    </>
  );
}
