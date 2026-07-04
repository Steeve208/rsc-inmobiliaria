import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { CityLandingPage } from "@/features/imoveis/components/city-landing-page";
import { cityLandingPages, resolveCitySlug } from "@/lib/imoveis/city-slugs";
import { listPropertiesByCity } from "@/lib/listings/property-repository";

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateStaticParams() {
  return cityLandingPages.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const entry = resolveCitySlug(slug);
  if (!entry) return {};

  const t = await getTranslations({ locale, namespace: "imoveis.cityLanding" });
  const labels = { city: entry.city, state: entry.state, count: 0 };

  return {
    title: t("metaTitle", labels),
    description: t("metaDescription", labels),
    keywords: t("metaKeywords", labels),
    openGraph: {
      title: t("metaTitle", labels),
      description: t("metaDescription", labels),
      type: "website",
    },
    alternates: {
      canonical: `/imoveis/cidade/${slug}`,
    },
  };
}

export default async function CityImoveisPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const entry = resolveCitySlug(slug);
  if (!entry) notFound();

  const [listings] = await Promise.all([
    listPropertiesByCity(entry.city, entry.state, 12),
  ]);

  const relatedCities = cityLandingPages
    .filter((city) => city.slug !== entry.slug)
    .slice(0, 6);

  return (
    <CityLandingPage
      entry={entry}
      listings={listings}
      relatedCities={relatedCities}
    />
  );
}
