import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import {
  getAgencyProperties,
  getPropertyDetail,
  getSimilarProperties,
} from "@/lib/listings/property-repository";
import { PropertyDetailPage } from "@/features/imoveis/components/property-detail-page";
import { buildListingMetadata } from "@/lib/seo/listing-metadata";

type Props = {
  params: Promise<{ locale: string; id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, id } = await params;
  const property = await getPropertyDetail(id);
  if (!property) return {};

  const place = [property.neighborhood, property.city, property.state]
    .filter(Boolean)
    .join(", ");
  const description =
    property.description?.trim() ||
    [property.title, place, property.company].filter(Boolean).join(" · ");

  return buildListingMetadata({
    locale,
    path: `/imoveis/${id}`,
    title: property.title,
    description,
    image: property.images[0] ?? property.image,
  });
}

export default async function Page({ params }: Props) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  const property = await getPropertyDetail(id);
  if (!property) notFound();

  const [similar, agencyListings] = await Promise.all([
    getSimilarProperties(id),
    getAgencyProperties(property.companyId, id),
  ]);

  return (
    <PropertyDetailPage
      property={property}
      similar={similar}
      agencyListings={agencyListings}
    />
  );
}
