import { setRequestLocale } from "next-intl/server";
import { HeroSection } from "@/components/home/hero-section";
import { ServiceCards } from "@/components/home/service-cards";
import { HowItWorks } from "@/components/home/how-it-works";
import { StatsBar } from "@/components/home/stats-bar";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <HeroSection />
      <ServiceCards />
      <HowItWorks />
      <StatsBar />
    </>
  );
}
