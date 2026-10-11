import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { DestinationsPage } from "@/components/marketplace/destinations-page";
import { buildDestinationCatalog } from "@/lib/marketplace/destination-catalog";
import { listMagazines } from "@/lib/listings/magazine-store";
import { listProperties } from "@/lib/listings/property-repository";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "marketplace.destinationsPage" });
  return { title: t("featuredTitle") };
}

export default async function Page({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const [properties, magazines] = await Promise.all([listProperties(), listMagazines()]);

  return (
    <DestinationsPage
      catalog={buildDestinationCatalog(properties)}
      showJournal={magazines.length > 0}
    />
  );
}
