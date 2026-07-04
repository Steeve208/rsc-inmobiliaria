"use client";

import { useEffect, useRef, useState } from "react";
import { Send } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  fetchChatThread,
  getBuyerName,
  openChat,
  sendChatMessage,
  setBuyerName,
} from "@/lib/leads/client";
import { useBuyerIdentity } from "@/hooks/use-buyer-identity";
import { mergeChatThread, useChatThreadPolling } from "@/hooks/use-chat-thread-polling";
import type { ChatThread, ListingContactContext } from "@/lib/leads/types";
import { cn } from "@/lib/utils";

type BaseProps = {
  enabled?: boolean;
  className?: string;
  onThreadChange?: (thread: ChatThread | null) => void;
  showNamePrompt?: boolean;
  showRefresh?: boolean;
};

type Props = BaseProps &
  (
    | { source: "listing"; listing: ListingContactContext }
    | { source: "thread"; threadId: string }
  );

export function RscChatConversation({
  enabled = true,
  className,
  onThreadChange,
  showNamePrompt = true,
  showRefresh = true,
  ...sourceProps
}: Props) {
  const t = useTranslations("contact.chat");
  const { buyerId } = useBuyerIdentity();
  const [buyerName, setBuyerNameState] = useState(getBuyerName());
  const [thread, setThread] = useState<ChatThread | null>(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    onThreadChange?.(thread);
  }, [thread, onThreadChange]);

  useEffect(() => {
    if (!enabled) return;

    setError("");
    setLoading(true);

    const load =
      sourceProps.source === "thread"
        ? fetchChatThread(sourceProps.threadId)
        : openChat({
            listingId: sourceProps.listing.listingId,
            listingTitle: sourceProps.listing.listingTitle,
            listingCategory: sourceProps.listing.listingCategory,
            companyId: sourceProps.listing.companyId,
            companyName: sourceProps.listing.companyName,
            buyerId,
            buyerName: buyerName.trim() || t("defaultBuyerName"),
          });

    load
      .then(setThread)
      .catch(() => setError(t("errorOpen")))
      .finally(() => setLoading(false));
  }, [
    enabled,
    sourceProps.source,
    sourceProps.source === "thread" ? sourceProps.threadId : sourceProps.listing.listingId,
    sourceProps.source === "listing" ? sourceProps.listing.companyId : undefined,
    sourceProps.source === "listing" ? buyerId : undefined,
    sourceProps.source === "listing" ? buyerName : undefined,
    t,
  ]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [thread?.messages.length]);

  useChatThreadPolling(thread?.id, enabled && !!thread?.id, (updated) => {
    setThread((current) => mergeChatThread(current, updated));
  });

  async function handleSend(event: React.FormEvent) {
    event.preventDefault();
    if (!thread || !message.trim()) return;

    const trimmedName = buyerName.trim() || t("defaultBuyerName");
    if (buyerName.trim()) setBuyerName(trimmedName);

    setLoading(true);
    setError("");

    try {
      const updated = await sendChatMessage({
        threadId: thread.id,
        sender: "buyer",
        text: message.trim(),
      });
      setThread(updated);
      setMessage("");
    } catch {
      setError(t("errorSend"));
    } finally {
      setLoading(false);
    }
  }

  async function refreshThread() {
    if (!thread) return;
    const updated = await fetchChatThread(thread.id);
    setThread(updated);
  }

  const needsName = showNamePrompt && sourceProps.source === "listing" && !buyerName.trim();

  return (
    <div className={cn("flex min-h-0 flex-1 flex-col", className)}>
      {needsName ? (
        <div className="border-b border-white/10 p-4">
          <p className="mb-2 text-sm text-white/60">{t("namePrompt")}</p>
          <div className="flex gap-2">
            <Input
              value={buyerName}
              onChange={(e) => setBuyerNameState(e.target.value)}
              placeholder={t("namePlaceholder")}
              className="border-white/10 bg-[#0a111f] text-white"
            />
            <Button
              type="button"
              onClick={() => {
                const trimmed = buyerName.trim() || t("defaultBuyerName");
                setBuyerName(trimmed);
                setBuyerNameState(trimmed);
              }}
            >
              {t("continue")}
            </Button>
          </div>
        </div>
      ) : null}

      <div className="flex-1 space-y-3 overflow-y-auto p-4">
        {loading && !thread ? (
          <p className="text-center text-sm text-white/50">{t("loading")}</p>
        ) : null}
        {thread?.messages.length === 0 ? (
          <p className="text-center text-sm text-white/45">{t("empty")}</p>
        ) : null}
        {thread?.messages.map((item) => (
          <div
            key={item.id}
            className={cn(
              "max-w-[85%] rounded-xl px-3 py-2 text-sm",
              item.sender === "buyer"
                ? "ml-auto bg-[#1d4ed8] text-white"
                : "bg-white/10 text-white/85",
            )}
          >
            {item.text}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {error ? <p className="px-4 text-sm text-red-400">{error}</p> : null}

      <form
        className="flex items-center gap-2 border-t border-white/10 p-4"
        onSubmit={handleSend}
      >
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={t("placeholder")}
          disabled={!thread || loading || needsName}
          className="border-white/10 bg-[#0a111f] text-white"
        />
        <Button
          type="submit"
          size="icon"
          disabled={!thread || loading || needsName || !message.trim()}
        >
          <Send className="size-4" />
        </Button>
        {showRefresh ? (
          <Button type="button" variant="outline" size="sm" onClick={refreshThread}>
            {t("refresh")}
          </Button>
        ) : null}
      </form>
    </div>
  );
}
