import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import {
  getPropertyDetail,
  getSimilarProperties,
} from "@/lib/listings/property-repository";
import { PropertyDetailPage } from "@/features/imoveis/components/property-detail-page";

type Props = {
  params: Promise<{ locale: string; id: string }>;
};

export default async function Page({ params }: Props) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  const property = await getPropertyDetail(id);
  if (!property) notFound();

  const similar = await getSimilarProperties(id);

  return <PropertyDetailPage property={property} similar={similar} />;
}
