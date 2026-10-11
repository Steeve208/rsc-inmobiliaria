import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { JournalPage } from "@/components/marketplace/journal-page";
import { listMagazines } from "@/lib/listings/magazine-store";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "marketplace.journal" });
  return { title: t("title") };
}

export default async function Page({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const articles = await listMagazines();
  return <JournalPage articles={articles} />;
}
