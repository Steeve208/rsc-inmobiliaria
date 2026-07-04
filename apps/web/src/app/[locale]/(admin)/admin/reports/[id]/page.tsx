import { setRequestLocale } from "next-intl/server";
import { AdminReportDetailPanel } from "@/features/admin/components/admin-report-detail-panel";

type Props = {
  params: Promise<{ locale: string; id: string }>;
};

export default async function AdminReportDetailPage({ params }: Props) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  const dateLocale =
    locale === "pt" ? "pt-BR" : locale === "es" ? "es-ES" : "en-US";

  return <AdminReportDetailPanel reportId={id} locale={dateLocale} />;
}
