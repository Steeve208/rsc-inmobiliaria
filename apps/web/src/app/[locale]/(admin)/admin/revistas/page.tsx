import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { AdminMagazinesPanel } from "@/features/admin/components/admin-magazines-panel";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function AdminMagazinesPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("adminMagazines");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{t("pageTitle")}</h1>
        <p className="text-muted-foreground">{t("pageSubtitle")}</p>
      </div>
      <AdminMagazinesPanel />
    </div>
  );
}
