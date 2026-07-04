import { setRequestLocale } from "next-intl/server";
import { AdminFinancingRequestsPanel } from "@/features/admin/components/admin-financing-requests-panel";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function AdminFinancingPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const dateLocale =
    locale === "pt" ? "pt-BR" : locale === "es" ? "es-ES" : "en-US";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">RSC Credit</h1>
        <p className="text-muted-foreground">
          Review financing requests submitted by buyers. External dashboards use the same API.
        </p>
      </div>
      <AdminFinancingRequestsPanel locale={dateLocale} />
    </div>
  );
}
