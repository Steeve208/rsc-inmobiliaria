"use client";

import { MessageCircle, X } from "lucide-react";
import { useTranslations } from "next-intl";
import type { ListingContactContext } from "@/lib/leads/types";
import { RscChatConversation } from "./rsc-chat-conversation";

type Props = {
  open: boolean;
  onClose: () => void;
  listing: ListingContactContext;
};

export function RscChatModal({ open, onClose, listing }: Props) {
  const t = useTranslations("contact.chat");

  if (!open) return null;

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

        <RscChatConversation
          enabled={open}
          source="listing"
          listing={listing}
          showRefresh
        />
      </div>
    </div>
  );
}
