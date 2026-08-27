import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { MagazineDetailPage } from "@/features/revistas";
import {
  getMagazineBySlug,
  listMagazines,
} from "@/lib/listings/magazine-store";
import { buildListingMetadata } from "@/lib/seo/listing-metadata";

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const magazine = await getMagazineBySlug(slug);
  if (!magazine || magazine.status !== "published") return {};

  return buildListingMetadata({
    locale,
    path: `/revistas/${slug}`,
    title: magazine.title,
    description: magazine.excerpt,
    image: magazine.coverImage,
  });
}

export default async function Page({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const [magazine, all] = await Promise.all([
    getMagazineBySlug(slug),
    listMagazines(),
  ]);
  if (!magazine || magazine.status !== "published") notFound();

  const related = all
    .filter((item) => item.id !== magazine.id)
    .sort((a, b) => {
      const sameCat =
        Number(b.category === magazine.category) -
        Number(a.category === magazine.category);
      if (sameCat !== 0) return sameCat;
      return (
        new Date(`${b.publishedAt}T12:00:00.000Z`).getTime() -
        new Date(`${a.publishedAt}T12:00:00.000Z`).getTime()
      );
    })
    .slice(0, 4);

  return <MagazineDetailPage magazine={magazine} related={related} />;
}
