import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { MagazineDetailPage } from "@/features/revistas/components/magazine-detail-page";
import { getMagazineBySlug, listMagazines } from "@/lib/listings/magazine-store";

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export default async function Page({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const magazine = await getMagazineBySlug(slug);
  if (!magazine || magazine.status !== "published") notFound();

  const related = (await listMagazines())
    .filter((item) => item.slug !== magazine.slug)
    .slice(0, 4);

  return <MagazineDetailPage magazine={magazine} related={related} />;
}
