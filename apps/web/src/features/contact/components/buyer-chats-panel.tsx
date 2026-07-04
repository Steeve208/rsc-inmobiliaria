"use client";

import { useEffect, useState } from "react";
import { MessageCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/routing";
import { fetchBuyerChats } from "@/lib/leads/client";
import { useBuyerIdentity } from "@/hooks/use-buyer-identity";
import { useBuyerActivitySync } from "@/lib/providers/buyer-activity-sync-provider";
import type { ChatThread } from "@/lib/leads/types";
import { cn } from "@/lib/utils";

type Props = {
  activeThreadId?: string;
};

export function BuyerChatsPanel({ activeThreadId }: Props) {
  const t = useTranslations("contact.buyer.chats");
  const { buyerId, isAuthenticated } = useBuyerIdentity();
  const { syncVersion, isSynced } = useBuyerActivitySync();
  const [threads, setThreads] = useState<ChatThread[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!buyerId) return;
    if (isAuthenticated && !isSynced) return;

    let cancelled = false;
    setLoading(true);

    fetchBuyerChats(buyerId)
      .then((next) => {
        if (!cancelled) setThreads(next);
      })
      .catch(() => {
        if (!cancelled) setThreads([]);
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

  if (threads.length === 0) {
    return (
      <section className="rounded-lg bg-muted/30 p-12 text-center">
        <MessageCircle className="mx-auto size-10 text-muted-foreground" />
        <p className="mt-4 font-medium">{t("emptyTitle")}</p>
        <p className="mt-1 text-sm text-muted-foreground">{t("emptyBody")}</p>
      </section>
    );
  }

  return (
    <section className="space-y-3">
      {threads.map((thread) => {
        const isActive = activeThreadId === thread.id;

        return (
          <article
            key={thread.id}
            className={cn(
              "rounded-lg border bg-card p-4 transition-colors",
              isActive
                ? "border-[#1d4ed8]/50 ring-1 ring-[#1d4ed8]/30"
                : "border-border/60",
            )}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-medium">{thread.listingTitle}</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {thread.companyName} · {t("messages", { count: thread.messages.length })}
                </p>
              </div>
              <span className="text-xs text-muted-foreground">
                {new Date(thread.updatedAt).toLocaleDateString()}
              </span>
            </div>
            {thread.messages.at(-1) ? (
              <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">
                {thread.messages.at(-1)?.text}
              </p>
            ) : null}
            <div className="mt-3 flex flex-wrap gap-3">
              <Link
                href={`/dashboard/chats/${thread.id}`}
                className={cn(
                  "inline-flex items-center text-sm font-medium hover:underline",
                  isActive ? "text-[#60a5fa]" : "text-primary",
                )}
              >
                {t("continueChat")}
              </Link>
              <Link
                href={
                  thread.listingCategory === "properties"
                    ? `/imoveis/${thread.listingId}`
                    : `/veiculos/${thread.listingId}`
                }
                className="inline-block text-sm text-muted-foreground hover:text-foreground hover:underline"
              >
                {t("viewListing")}
              </Link>
            </div>
          </article>
        );
      })}
    </section>
  );
}
