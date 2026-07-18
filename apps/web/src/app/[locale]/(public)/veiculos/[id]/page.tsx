import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import {
  getVehicleDetail,
  getSimilarVehicles,
  getAgencyVehicles,
} from "@/lib/listings/vehicle-repository";
import { VehicleDetailPage } from "@/features/veiculos/components/vehicle-detail-page";
import { buildListingMetadata } from "@/lib/seo/listing-metadata";

type Props = {
  params: Promise<{ locale: string; id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, id } = await params;
  const vehicle = await getVehicleDetail(id);
  if (!vehicle) return {};

  const place = [vehicle.city, vehicle.state].filter(Boolean).join(", ");
  const description =
    vehicle.description?.trim() ||
    [vehicle.title, place, vehicle.company].filter(Boolean).join(" · ");

  return buildListingMetadata({
    locale,
    path: `/veiculos/${id}`,
    title: vehicle.title,
    description,
    image: vehicle.images[0] ?? vehicle.image,
  });
}

export default async function Page({ params }: Props) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  const vehicle = await getVehicleDetail(id);
  if (!vehicle) notFound();

  const [similar, agencyListings] = await Promise.all([
    getSimilarVehicles(id),
    getAgencyVehicles(vehicle.companyId, id),
  ]);

  return (
    <VehicleDetailPage
      vehicle={vehicle}
      similar={similar}
      agencyListings={agencyListings}
    />
  );
}
