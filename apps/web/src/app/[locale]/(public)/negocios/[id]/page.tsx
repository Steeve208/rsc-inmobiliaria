import { setRequestLocale } from "next-intl/server";
import { BusinessDetailPage } from "@/features/negocios/components/business-detail-page";

type Props = {
  params: Promise<{ locale: string; id: string }>;
};

export default async function Page({ params }: Props) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  return <BusinessDetailPage id={id} />;
}
