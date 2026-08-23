import { setRequestLocale } from "next-intl/server";
import { MarketplaceHome } from "@/components/marketplace/marketplace-home";
import { getMarketplaceHomeData } from "@/lib/marketplace/home-data";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const data = await getMarketplaceHomeData(locale);

  return <MarketplaceHome data={data} />;
}
