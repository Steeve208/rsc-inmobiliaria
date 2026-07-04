"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, ExternalLink, MessageCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/routing";
import { fetchChatThread } from "@/lib/leads/client";
import { useBuyerIdentity } from "@/hooks/use-buyer-identity";
import { useBuyerActivitySync } from "@/lib/providers/buyer-activity-sync-provider";
import type { ChatThread } from "@/lib/leads/types";
import { cn } from "@/lib/utils";
import { RscChatConversation } from "./rsc-chat-conversation";

type Props = {
  threadId: string;
  className?: string;
};

export function BuyerChatThreadPanel({ threadId, className }: Props) {
  const t = useTranslations("contact.buyer.chats");
  const { buyerId, isAuthenticated } = useBuyerIdentity();
  const { syncVersion, isSynced } = useBuyerActivitySync();
  const [threadMeta, setThreadMeta] = useState<ChatThread | null>(null);
  const [loading, setLoading] = useState(true);
  const [forbidden, setForbidden] = useState(false);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!buyerId) return;
    if (isAuthenticated && !isSynced) return;

    setLoading(true);
    setForbidden(false);
    setNotFound(false);

    fetchChatThread(threadId)
      .then((thread) => {
        if (thread.buyerId !== buyerId) {
          setForbidden(true);
          setThreadMeta(null);
          return;
        }
        setThreadMeta(thread);
      })
      .catch(() => {
        setNotFound(true);
        setThreadMeta(null);
      })
      .finally(() => setLoading(false));
  }, [threadId, buyerId, isAuthenticated, isSynced, syncVersion]);

  if (loading) {
    return (
      <section
        className={cn(
          "flex min-h-[420px] items-center justify-center rounded-lg border border-border/60 bg-card",
          className,
        )}
      >
        <p className="text-muted-foreground">{t("loadingThread")}</p>
      </section>
    );
  }

  if (notFound || forbidden) {
    return (
      <section
        className={cn(
          "rounded-lg border border-border/60 bg-card p-12 text-center",
          className,
        )}
      >
        <MessageCircle className="mx-auto size-10 text-muted-foreground" />
        <p className="mt-4 font-medium">
          {forbidden ? t("forbiddenTitle") : t("notFoundTitle")}
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          {forbidden ? t("forbiddenBody") : t("notFoundBody")}
        </p>
        <Link
          href="/dashboard/chats"
          className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
        >
          <ArrowLeft className="size-3.5" />
          {t("backToList")}
        </Link>
      </section>
    );
  }

  const listingHref =
    threadMeta?.listingCategory === "properties"
      ? `/imoveis/${threadMeta.listingId}`
      : `/veiculos/${threadMeta?.listingId}`;

  return (
    <section
      className={cn(
        "flex min-h-[420px] flex-col overflow-hidden rounded-lg border border-border/60 bg-[#111d2f]",
        className,
      )}
    >
      <div className="border-b border-white/10 p-4">
        <Link
          href="/dashboard/chats"
          className="mb-3 inline-flex items-center gap-1.5 text-xs font-medium text-white/50 transition-colors hover:text-white/80 lg:hidden"
        >
          <ArrowLeft className="size-3.5" />
          {t("backToList")}
        </Link>
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="font-semibold text-white">{threadMeta?.listingTitle}</p>
            <p className="mt-1 text-sm text-white/50">{threadMeta?.companyName}</p>
          </div>
          {threadMeta ? (
            <Link
              href={listingHref}
              className="inline-flex shrink-0 items-center gap-1 text-xs font-medium text-[#60a5fa] hover:underline"
            >
              {t("viewListing")}
              <ExternalLink className="size-3" />
            </Link>
          ) : null}
        </div>
      </div>

      <RscChatConversation
        source="thread"
        threadId={threadId}
        showNamePrompt={false}
        showRefresh={false}
        onThreadChange={setThreadMeta}
      />
    </section>
  );
}
