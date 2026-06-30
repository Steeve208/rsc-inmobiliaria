"use client";

import { useEffect, useRef, useState } from "react";
import { MessageCircle, Send, X } from "lucide-react";
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
import type { ChatThread, ListingContactContext } from "@/lib/leads/types";
import { cn } from "@/lib/utils";

type Props = {
  open: boolean;
  onClose: () => void;
  listing: ListingContactContext;
};

export function RscChatModal({ open, onClose, listing }: Props) {
  const t = useTranslations("contact.chat");
  const { buyerId } = useBuyerIdentity();
  const [buyerName, setBuyerNameState] = useState(getBuyerName());
  const [thread, setThread] = useState<ChatThread | null>(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    setError("");
    setLoading(true);

    openChat({
      listingId: listing.listingId,
      listingTitle: listing.listingTitle,
      listingCategory: listing.listingCategory,
      companyId: listing.companyId,
      companyName: listing.companyName,
      buyerId,
      buyerName: buyerName.trim() || t("defaultBuyerName"),
    })
      .then(setThread)
      .catch(() => setError(t("errorOpen")))
      .finally(() => setLoading(false));
  }, [open, listing, buyerName, buyerId, t]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [thread?.messages.length]);

  if (!open) return null;

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

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-4 sm:items-center">
      <div
        role="dialog"
        aria-modal="true"
        className="flex h-[min(80vh,640px)] w-full max-w-lg flex-col rounded-xl bg-[#111d2f] shadow-xl"
      >
        <div className="flex items-start justify-between gap-3 border-b border-white/10 p-4">
          <div>
            <div className="flex items-center gap-2">
              <MessageCircle className="size-4 text-[#1d4ed8]" />
              <h2 className="font-semibold text-white">{t("title")}</h2>
            </div>
            <p className="mt-1 text-sm text-white/50">{listing.listingTitle}</p>
            <p className="text-xs text-white/40">
              {listing.companyName}
              {listing.agentName ? ` · ${listing.agentName}` : ""}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-white/50 hover:bg-white/10 hover:text-white"
            aria-label={t("close")}
          >
            <X className="size-5" />
          </button>
        </div>

        {!buyerName.trim() ? (
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
            disabled={!thread || loading}
            className="border-white/10 bg-[#0a111f] text-white"
          />
          <Button type="submit" size="icon" disabled={!thread || loading || !message.trim()}>
            <Send className="size-4" />
          </Button>
          <Button type="button" variant="outline" size="sm" onClick={refreshThread}>
            {t("refresh")}
          </Button>
        </form>
      </div>
    </div>
  );
}
