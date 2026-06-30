"use client";

import { useEffect, useState } from "react";
import { MessageCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/routing";
import { fetchBuyerChats } from "@/lib/leads/client";
import { useBuyerIdentity } from "@/hooks/use-buyer-identity";
import type { ChatThread } from "@/lib/leads/types";

export function BuyerChatsPanel() {
  const t = useTranslations("contact.buyer.chats");
  const { buyerId } = useBuyerIdentity();
  const [threads, setThreads] = useState<ChatThread[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!buyerId) return;
    fetchBuyerChats(buyerId)
      .then(setThreads)
      .catch(() => setThreads([]))
      .finally(() => setLoading(false));
  }, [buyerId]);

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
      {threads.map((thread) => (
        <article
          key={thread.id}
          className="rounded-lg border border-border/60 bg-card p-4"
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
          <Link
            href={
              thread.listingCategory === "properties"
                ? `/imoveis/${thread.listingId}`
                : `/veiculos/${thread.listingId}`
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
