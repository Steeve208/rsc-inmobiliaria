import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { ServiceDetailPage } from "@/features/services/components/service-detail-page";
import { PUBLIC_MODULES } from "@/lib/marketplace/features";

type Props = {
  params: Promise<{ locale: string; id: string }>;
};

export default async function Page({ params }: Props) {
  if (!PUBLIC_MODULES.services) notFound();

  const { locale, id } = await params;
  setRequestLocale(locale);
  return <ServiceDetailPage id={id} />;
}
