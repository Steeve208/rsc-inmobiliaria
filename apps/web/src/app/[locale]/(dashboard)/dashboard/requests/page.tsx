import { setRequestLocale } from "next-intl/server";
import { BuyerDashboard } from "@/features/veiculos/components/buyer-dashboard";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function Page({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <BuyerDashboard activeTab="requests" />;
}
