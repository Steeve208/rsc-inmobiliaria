"use client";

import { useEffect, useState } from "react";
import { Calendar } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/routing";
import { fetchBuyerVisits } from "@/lib/leads/client";
import { useBuyerIdentity } from "@/hooks/use-buyer-identity";
import { useBuyerActivitySync } from "@/lib/providers/buyer-activity-sync-provider";
import type { ScheduledVisit } from "@/lib/leads/types";
import { cn } from "@/lib/utils";

const statusStyles: Record<ScheduledVisit["status"], string> = {
  pending: "bg-amber-500/15 text-amber-700 dark:text-amber-300",
  confirmed: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
  cancelled: "bg-red-500/15 text-red-700 dark:text-red-300",
};

export function BuyerVisitsPanel() {
  const t = useTranslations("contact.buyer.visits");
  const { buyerId, isAuthenticated } = useBuyerIdentity();
  const { syncVersion, isSynced } = useBuyerActivitySync();
  const [visits, setVisits] = useState<ScheduledVisit[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!buyerId) return;
    if (isAuthenticated && !isSynced) return;

    let cancelled = false;
    setLoading(true);

    fetchBuyerVisits(buyerId)
      .then((next) => {
        if (!cancelled) setVisits(next);
      })
      .catch(() => {
        if (!cancelled) setVisits([]);
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

  if (visits.length === 0) {
    return (
      <section className="rounded-lg bg-muted/30 p-12 text-center">
        <Calendar className="mx-auto size-10 text-muted-foreground" />
        <p className="mt-4 font-medium">{t("emptyTitle")}</p>
        <p className="mt-1 text-sm text-muted-foreground">{t("emptyBody")}</p>
      </section>
    );
  }

  return (
    <section className="space-y-3">
      {visits.map((visit) => (
        <article
          key={visit.id}
          className="rounded-lg border border-border/60 bg-card p-4"
        >
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="font-medium">{visit.listingTitle}</p>
              <p className="mt-1 text-sm text-muted-foreground">{visit.companyName}</p>
            </div>
            <span
              className={cn(
                "rounded-full px-2.5 py-1 text-xs font-medium",
                statusStyles[visit.status],
              )}
            >
              {t(`status.${visit.status}`)}
            </span>
          </div>
          <p className="mt-3 text-sm">
            {t("scheduledFor", {
              date: visit.preferredDate,
              time: visit.preferredTime,
            })}
          </p>
          {visit.notes ? (
            <p className="mt-2 text-sm text-muted-foreground">{visit.notes}</p>
          ) : null}
          <Link
            href={
              visit.listingCategory === "properties"
                ? `/imoveis/${visit.listingId}`
                : `/veiculos/${visit.listingId}`
            }
            className="mt-3 inline-block text-sm font-medium text-primary hover:underline"
          >
            {t("viewListing")}
          </Link>
        </article>
      ))}
    </section>
  );
}
