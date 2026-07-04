"use client";

import { useEffect, useState } from "react";
import { ExternalLink } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/routing";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { fetchAdminReport, updateAdminReport } from "@/lib/reports/client";
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
  reportId: string;
  locale?: string;
};

export function AdminReportDetailPanel({ reportId, locale = "pt-BR" }: Props) {
  const t = useTranslations("adminReports");
  const [report, setReport] = useState<ListingReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<ListingReportStatus>("pending");
  const [adminNotes, setAdminNotes] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAdminReport(reportId)
      .then((next) => {
        setReport(next);
        setStatus(next.status);
        setAdminNotes(next.adminNotes ?? "");
      })
      .catch(() => setReport(null))
      .finally(() => setLoading(false));
  }, [reportId]);

  if (loading) {
    return <p className="text-muted-foreground">{t("loading")}</p>;
  }

  if (!report) {
    return (
      <div className="space-y-3">
        <p className="text-muted-foreground">{t("notFound")}</p>
        <Link href="/admin/reports" className="text-sm text-primary hover:underline">
          {t("backToList")}
        </Link>
      </div>
    );
  }

  const listingHref =
    report.listingKind === "vehicle"
      ? `/veiculos/${report.listingId}`
      : `/imoveis/${report.listingId}`;

  async function handleSave() {
    setSaving(true);
    setError("");
    try {
      const updated = await updateAdminReport({
        id: report!.id,
        status,
        adminNotes: adminNotes.trim() || undefined,
      });
      setReport(updated);
    } catch {
      setError(t("saveError"));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin/reports" className="text-sm text-primary hover:underline">
          {t("backToList")}
        </Link>
        <div className="mt-4 flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{report.listingTitle}</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {t(`listingKind.${report.listingKind}`)} ·{" "}
              {new Date(report.createdAt).toLocaleString(locale)}
            </p>
          </div>
          <Badge className={statusStyles[report.status]}>
            {t(`status.${report.status}`)}
          </Badge>
        </div>
      </div>

      <section className="rounded-lg border border-border/60 bg-card p-5 space-y-4">
        <div>
          <h2 className="text-sm font-medium text-muted-foreground">{t("reason")}</h2>
          <p className="mt-2 whitespace-pre-wrap text-sm">{report.reason}</p>
        </div>

        <dl className="grid gap-3 sm:grid-cols-2 text-sm">
          <div>
            <dt className="text-muted-foreground">{t("reporterEmail")}</dt>
            <dd className="mt-1 font-medium">
              {report.reporterEmail ?? t("anonymous")}
            </dd>
          </div>
          <div>
            <dt className="text-muted-foreground">{t("listingId")}</dt>
            <dd className="mt-1 font-mono text-xs">{report.listingId}</dd>
          </div>
        </dl>

        <Link
          href={listingHref}
          className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-sm hover:bg-muted"
        >
          <ExternalLink className="size-4" />
          {t("viewListing")}
        </Link>
      </section>

      <section className="rounded-lg border border-border/60 bg-card p-5 space-y-4">
        <h2 className="font-semibold">{t("reviewTitle")}</h2>

        <div className="space-y-2">
          <Label htmlFor="report-status">{t("statusLabel")}</Label>
          <select
            id="report-status"
            value={status}
            onChange={(e) => setStatus(e.target.value as ListingReportStatus)}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            {LISTING_REPORT_STATUSES.map((value) => (
              <option key={value} value={value}>
                {t(`status.${value}`)}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="admin-notes">{t("adminNotes")}</Label>
          <textarea
            id="admin-notes"
            rows={4}
            value={adminNotes}
            onChange={(e) => setAdminNotes(e.target.value)}
            placeholder={t("adminNotesPlaceholder")}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          />
        </div>

        {report.reviewedAt ? (
          <p className="text-xs text-muted-foreground">
            {t("lastReviewed", {
              date: new Date(report.reviewedAt).toLocaleString(locale),
            })}
          </p>
        ) : null}

        {error ? <p className="text-sm text-destructive">{error}</p> : null}

        <Button onClick={handleSave} disabled={saving}>
          {saving ? t("saving") : t("saveReview")}
        </Button>
      </section>
    </div>
  );
}
