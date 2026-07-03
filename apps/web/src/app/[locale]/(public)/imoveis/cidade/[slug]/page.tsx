import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { redirect } from "@/lib/i18n/routing";
import { resolveCitySlug } from "@/lib/imoveis/city-slugs";
import { imoveisFiltersToParams } from "@/lib/imoveis/search-params";
import { defaultImoveisFilters } from "@/features/imoveis/types";

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateStaticParams() {
  const { cityLandingPages } = await import("@/lib/imoveis/city-slugs");
  return cityLandingPages.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props) {
  const { locale, slug } = await params;
  const city = resolveCitySlug(slug);
  if (!city) return {};

  const t = await getTranslations({ locale, namespace: "imoveis.city" });
  return {
    title: t("metaTitle", { city: city.city }),
    description: t("metaDescription", { city: city.city, state: city.state }),
  };
}

export default async function CityImoveisPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const city = resolveCitySlug(slug);
  if (!city) notFound();

  const filters = {
    ...defaultImoveisFilters,
    city: city.city,
    state: city.state,
    locationLabel: `${city.city}, ${city.state}`,
  };

  const query = Object.fromEntries(imoveisFiltersToParams(filters));
  redirect({ href: { pathname: "/imoveis", query }, locale });
}
