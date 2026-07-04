import { headers } from "next/headers";
import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { redirect } from "@/lib/i18n/routing";
import { auth } from "@/lib/auth";
import { FavoritesPageSection } from "@/features/favorites";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function FavoritosPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const session = await auth.api.getSession({ headers: await headers() });
  if (session?.user) {
    redirect({ href: "/dashboard", locale });
  }

  const t = await getTranslations({ locale, namespace: "favorites" });

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <FavoritesPageSection title={t("title")} subtitle={t("subtitle")} />
    </div>
  );
}
