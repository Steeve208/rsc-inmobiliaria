import { setRequestLocale } from "next-intl/server";
import { MarketplaceHome } from "@/components/marketplace/marketplace-home";
import { getMarketplaceHomeData } from "@/lib/marketplace/home-data";
import { listMagazines } from "@/lib/listings/magazine-store";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [data, magazines] = await Promise.all([
    getMarketplaceHomeData(locale),
    listMagazines(),
  ]);

  return <MarketplaceHome data={data} showJournal={magazines.length > 0} />;
}
