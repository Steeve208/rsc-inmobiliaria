import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { FavoritesPanel } from "@/features/contact";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function FavoritosPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "favorites" });

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-white">{t("title")}</h1>
        <p className="mt-1 text-white/60">{t("subtitle")}</p>
      </div>
      <FavoritesPanel />
    </div>
  );
}
