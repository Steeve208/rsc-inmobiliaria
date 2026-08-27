import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { BrokerDetailPage } from "@/features/corredores";
import {
  getBrokerById,
  listBrokerListings,
} from "@/lib/listings/broker-repository";
import { buildListingMetadata } from "@/lib/seo/listing-metadata";

type Props = {
  params: Promise<{ locale: string; id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, id } = await params;
  const broker = await getBrokerById(id);
  if (!broker) return {};

  const place = [broker.city, broker.state, broker.country]
    .filter(Boolean)
    .join(", ");
  const description =
    broker.bio?.trim() ||
    [broker.name, broker.role, broker.companyName, place]
      .filter(Boolean)
      .join(" · ");

  return buildListingMetadata({
    locale,
    path: `/corredores/${id}`,
    title: broker.name,
    description,
    image: broker.photo,
  });
}

export default async function Page({ params }: Props) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  const broker = await getBrokerById(id);
  if (!broker) notFound();

  const listings = await listBrokerListings(broker);

  return <BrokerDetailPage broker={broker} listings={listings} />;
}
