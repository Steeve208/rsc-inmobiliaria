"use client";

import { useEffect, useState } from "react";
import { Send } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/routing";
import {
  fetchFinancingRequests,
  updateFinancingRequestStatus,
} from "@/lib/financing/client";
import {
  FINANCING_REQUEST_STATUSES,
  type FinancingRequest,
  type FinancingRequestStatus,
} from "@/lib/financing/types";
import { cn } from "@/lib/utils";

const statusStyles: Record<FinancingRequestStatus, string> = {
  pending: "bg-amber-500/15 text-amber-700 dark:text-amber-300",
  in_analysis: "bg-blue-500/15 text-blue-700 dark:text-blue-300",
  approved: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
  rejected: "bg-red-500/15 text-red-700 dark:text-red-300",
};

function formatMoney(value: number, currency: string, locale: string) {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value);
}

type Props = {
  locale?: string;
};

export function AdminFinancingRequestsPanel({ locale = "pt-BR" }: Props) {
  const t = useTranslations("adminFinancing");
  const [requests, setRequests] = useState<FinancingRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<FinancingRequestStatus | "all">(
    "all",
  );
  const [savingId, setSavingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  async function loadRequests(status?: FinancingRequestStatus) {
    setLoading(true);
    setError("");
    try {
      setRequests(await fetchFinancingRequests(status ? { status } : undefined));
    } catch {
      setRequests([]);
      setError(t("loadError"));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadRequests(statusFilter === "all" ? undefined : statusFilter);
  }, [statusFilter]);

  async function handleStatusChange(id: string, status: FinancingRequestStatus) {
    setSavingId(id);
    setError("");
    try {
      const updated = await updateFinancingRequestStatus({ id, status });
      setRequests((current) =>
        current.map((item) => (item.id === id ? updated : item)),
      );
    } catch {
      setError(t("saveError"));
    } finally {
      setSavingId(null);
    }
  }

  if (loading) {
    return <p className="text-muted-foreground">{t("loading")}</p>;
  }

  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">{t("apiHint")}</p>

      <div className="flex flex-wrap gap-2">
        {(["all", ...FINANCING_REQUEST_STATUSES] as const).map((status) => (
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

      {error ? <p className="text-sm text-destructive">{error}</p> : null}

      {requests.length === 0 ? (
        <section className="rounded-lg bg-muted/30 p-12 text-center">
          <Send className="mx-auto size-10 text-muted-foreground" />
          <p className="mt-4 font-medium">{t("emptyTitle")}</p>
        </section>
      ) : (
        <section className="space-y-4">
          {requests.map((request) => (
            <article
              key={request.id}
              className="rounded-lg border border-border/60 bg-card p-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-medium">
                    {request.listingTitle ?? t("generalSimulation")}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {request.buyerName ?? t("anonymous")} ·{" "}
                    {request.buyerEmail ?? t("noEmail")}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {new Date(request.createdAt).toLocaleString(locale)} · {request.id}
                  </p>
                </div>
                <span
                  className={cn(
                    "rounded-full px-2.5 py-1 text-xs font-medium",
                    statusStyles[request.status],
                  )}
                >
                  {t(`status.${request.status}`)}
                </span>
              </div>

              <dl className="mt-4 grid gap-2 text-sm sm:grid-cols-2 lg:grid-cols-4">
                <div>
                  <dt className="text-muted-foreground">{t("propertyValue")}</dt>
                  <dd className="font-medium">
                    {formatMoney(request.propertyValue, request.currency, locale)}
                  </dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">{t("installment")}</dt>
                  <dd className="font-medium text-primary">
                    {formatMoney(request.estimatedInstallment, request.currency, locale)}
                  </dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">{t("downPayment")}</dt>
                  <dd className="font-medium">
                    {request.downPaymentPct}% ·{" "}
                    {formatMoney(request.downPaymentAmount, request.currency, locale)}
                  </dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">{t("term")}</dt>
                  <dd className="font-medium">
                    {request.termMonths} {t("months")}
                  </dd>
                </div>
              </dl>

              {request.buyerPhone ? (
                <p className="mt-3 text-sm text-muted-foreground">
                  {t("phone")}: {request.buyerPhone}
                </p>
              ) : null}
              {request.notes ? (
                <p className="mt-2 text-sm text-muted-foreground">{request.notes}</p>
              ) : null}

              <div className="mt-4 flex flex-wrap items-center gap-3">
                <label className="text-sm text-muted-foreground" htmlFor={`status-${request.id}`}>
                  {t("updateStatus")}
                </label>
                <select
                  id={`status-${request.id}`}
                  value={request.status}
                  disabled={savingId === request.id}
                  onChange={(e) =>
                    handleStatusChange(request.id, e.target.value as FinancingRequestStatus)
                  }
                  className="rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  {FINANCING_REQUEST_STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {t(`status.${status}`)}
                    </option>
                  ))}
                </select>
                {request.listingId && request.listingCategory ? (
                  <Link
                    href={
                      request.listingCategory === "properties"
                        ? `/imoveis/${request.listingId}`
                        : `/veiculos/${request.listingId}`
                    }
                    className="text-sm font-medium text-primary hover:underline"
                  >
                    {t("viewListing")}
                  </Link>
                ) : null}
              </div>
            </article>
          ))}
        </section>
      )}
    </div>
  );
}
