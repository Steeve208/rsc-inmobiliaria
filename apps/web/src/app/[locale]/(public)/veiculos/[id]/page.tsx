import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import {
  getVehicleDetail,
  getSimilarVehicles,
} from "@/lib/listings/vehicle-repository";
import { VehicleDetailPage } from "@/features/veiculos/components/vehicle-detail-page";

type Props = {
  params: Promise<{ locale: string; id: string }>;
};

export default async function Page({ params }: Props) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  const vehicle = await getVehicleDetail(id);
  if (!vehicle) notFound();

  const similar = await getSimilarVehicles(id);

  return <VehicleDetailPage vehicle={vehicle} similar={similar} />;
}
