"use client";

import { useEffect, useState } from "react";
import { Send } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/routing";
import { fetchBuyerFinancingRequests } from "@/lib/financing/client";
import type { FinancingRequest, FinancingRequestStatus } from "@/lib/financing/types";
import { useBuyerIdentity } from "@/hooks/use-buyer-identity";
import { useBuyerActivitySync } from "@/lib/providers/buyer-activity-sync-provider";
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

export function BuyerFinancingRequestsPanel({ locale = "pt-BR" }: Props) {
  const t = useTranslations("financingRequests");
  const { buyerId, isAuthenticated } = useBuyerIdentity();
  const { syncVersion, isSynced } = useBuyerActivitySync();
  const [requests, setRequests] = useState<FinancingRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!buyerId) return;
    if (isAuthenticated && !isSynced) return;

    let cancelled = false;
    setLoading(true);

    fetchBuyerFinancingRequests(buyerId)
      .then((next) => {
        if (!cancelled) setRequests(next);
      })
      .catch(() => {
        if (!cancelled) setRequests([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [buyerId, isAuthenticated, isSynced, syncVersion]);

  if (loading) {
    return <p className="text-muted-foreground">{t("loading")}</p>;
  }

  if (requests.length === 0) {
    return (
      <section className="rounded-lg bg-muted/30 p-12 text-center">
        <Send className="mx-auto size-10 text-muted-foreground" />
        <p className="mt-4 font-medium">{t("emptyTitle")}</p>
        <p className="mt-1 text-sm text-muted-foreground">{t("emptyBody")}</p>
        <Link
          href="/financing"
          className="mt-4 inline-block text-sm font-medium text-primary hover:underline"
        >
          {t("simulateCta")}
        </Link>
      </section>
    );
  }

  return (
    <section className="space-y-3">
      {requests.map((request) => (
        <article
          key={request.id}
          className="rounded-lg border border-border/60 bg-card p-4"
        >
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="font-medium">
                {request.listingTitle ?? t("generalSimulation")}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {new Date(request.createdAt).toLocaleDateString(locale, {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
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

          <dl className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-muted-foreground">{t("propertyValue")}</dt>
              <dd className="font-medium">
                {formatMoney(request.propertyValue, request.currency, locale)}
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
            <div>
              <dt className="text-muted-foreground">{t("installment")}</dt>
              <dd className="font-medium text-primary">
                {formatMoney(request.estimatedInstallment, request.currency, locale)}
                {t("perMonth")}
              </dd>
            </div>
          </dl>

          {request.listingId && request.listingCategory ? (
            <Link
              href={
                request.listingCategory === "properties"
                  ? `/imoveis/${request.listingId}`
                  : `/veiculos/${request.listingId}`
              }
              className="mt-3 inline-block text-sm font-medium text-primary hover:underline"
            >
              {t("viewListing")}
            </Link>
          ) : null}
        </article>
      ))}
    </section>
  );
}
