import { setRequestLocale } from "next-intl/server";
import { AdminReportsListPanel } from "@/features/admin/components/admin-reports-list-panel";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function AdminReportsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const dateLocale =
    locale === "pt" ? "pt-BR" : locale === "es" ? "es-ES" : "en-US";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Reports</h1>
        <p className="text-muted-foreground">
          Review and moderate listing reports submitted by users.
        </p>
      </div>
      <AdminReportsListPanel locale={dateLocale} />
    </div>
  );
}
