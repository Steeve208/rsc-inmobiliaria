import { setRequestLocale } from "next-intl/server";
import { BuyerHub } from "@/features/dashboard/components/buyer-hub";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function Page({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <BuyerHub activeTab="requests" />;
}
