"use client";

import { useEffect, useState } from "react";
import { Flag } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/routing";
import { Badge } from "@/components/ui/badge";
import { fetchAdminReports } from "@/lib/reports/client";
import {
  LISTING_REPORT_STATUSES,
  type ListingReport,
  type ListingReportStatus,
} from "@/lib/reports/types";
import { cn } from "@/lib/utils";

const statusStyles: Record<ListingReportStatus, string> = {
  pending: "bg-amber-500/15 text-amber-700 dark:text-amber-300",
  reviewing: "bg-blue-500/15 text-blue-700 dark:text-blue-300",
  resolved: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
  dismissed: "bg-muted text-muted-foreground",
};

type Props = {
  locale?: string;
};

export function AdminReportsListPanel({ locale = "pt-BR" }: Props) {
  const t = useTranslations("adminReports");
  const [reports, setReports] = useState<ListingReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<ListingReportStatus | "all">(
    "all",
  );

  useEffect(() => {
    setLoading(true);
    fetchAdminReports(statusFilter === "all" ? undefined : statusFilter)
      .then(setReports)
      .catch(() => setReports([]))
      .finally(() => setLoading(false));
  }, [statusFilter]);

  if (loading) {
    return <p className="text-muted-foreground">{t("loading")}</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {(["all", ...LISTING_REPORT_STATUSES] as const).map((status) => (
          <button
            key={status}
            type="button"
            onClick={() => setStatusFilter(status)}
            className={cn(
              "rounded-full px-3 py-1 text-sm transition-colors",
              statusFilter === status
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:text-foreground",
            )}
          >
            {status === "all" ? t("filters.all") : t(`status.${status}`)}
          </button>
        ))}
      </div>

      {reports.length === 0 ? (
        <section className="rounded-lg bg-muted/30 p-12 text-center">
          <Flag className="mx-auto size-10 text-muted-foreground" />
          <p className="mt-4 font-medium">{t("emptyTitle")}</p>
          <p className="mt-1 text-sm text-muted-foreground">{t("emptyBody")}</p>
        </section>
      ) : (
        <section className="space-y-3">
          {reports.map((report) => (
            <Link
              key={report.id}
              href={`/admin/reports/${report.id}`}
              className="block rounded-lg border border-border/60 bg-card p-4 transition-colors hover:border-primary/40"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0 space-y-1">
                  <p className="font-medium">{report.listingTitle}</p>
                  <p className="text-sm text-muted-foreground">
                    {t(`listingKind.${report.listingKind}`)} ·{" "}
                    {new Date(report.createdAt).toLocaleDateString(locale, {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                  <p className="line-clamp-2 text-sm text-muted-foreground">
                    {report.reason}
                  </p>
                </div>
                <Badge className={statusStyles[report.status]}>
                  {t(`status.${report.status}`)}
                </Badge>
              </div>
            </Link>
          ))}
        </section>
      )}
    </div>
  );
}
