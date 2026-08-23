import { setRequestLocale } from "next-intl/server";
import { ServiceDetailPage } from "@/features/services/components/service-detail-page";

type Props = {
  params: Promise<{ locale: string; id: string }>;
};

export default async function Page({ params }: Props) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  return <ServiceDetailPage id={id} />;
}
