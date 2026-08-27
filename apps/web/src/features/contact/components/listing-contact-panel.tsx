"use client";

import { useEffect, useState } from "react";
import { MessageCircle, CalendarClock, Info } from "lucide-react";
import { useTranslations } from "next-intl";
import type { ListingContactContext } from "@/lib/leads/types";
import { buildWhatsAppUrl } from "@/lib/leads/whatsapp";
import { trackListingEvent } from "@/lib/listings/analytics-client";
import { cn } from "@/lib/utils";
import { RscChatModal } from "./rsc-chat-modal";
import { ScheduleVisitModal } from "./schedule-visit-modal";

type Props = {
  listing: ListingContactContext;
  className?: string;
  /** Marketplace light detail pages vs legacy dark panels */
  variant?: "dark" | "light";
  /** Category-aware secondary CTAs */
  mode?: "property" | "vehicle" | "project" | "business" | "service";
};

export function ListingContactPanel({
  listing,
  className,
  variant = "dark",
  mode = "property",
}: Props) {
  const t = useTranslations("contact.panel");
  const tDetail = useTranslations("imoveis.detail");
  const [whatsappNumber, setWhatsappNumber] = useState(listing.whatsappNumber);
  const [chatOpen, setChatOpen] = useState(false);
  const [visitOpen, setVisitOpen] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams({
      companyId: listing.companyId,
      companyName: listing.companyName,
    });
    fetch(`/api/leads/company-config?${params.toString()}`)
      .then((response) => response.json())
      .then((config: { whatsappNumber?: string }) => {
        if (config.whatsappNumber) setWhatsappNumber(config.whatsappNumber);
      })
      .catch(() => setWhatsappNumber(listing.whatsappNumber));
  }, [listing.companyId, listing.companyName, listing.whatsappNumber]);

  function handleWhatsApp() {
    void trackListingEvent(listing.listingId, "contact");
    const url = buildWhatsAppUrl(
      whatsappNumber,
      t("whatsappPrefill", { title: listing.listingTitle }),
      listing.listingTitle,
    );
    if (!url) return;
    window.open(url, "_blank", "noopener,noreferrer");
  }

  function openChat() {
    void trackListingEvent(listing.listingId, "click");
    setChatOpen(true);
  }

  function openVisit() {
    void trackListingEvent(listing.listingId, "click");
    setVisitOpen(true);
  }

  const contactListing: ListingContactContext = {
    ...listing,
    whatsappNumber,
  };

  const light = variant === "light";

  const primaryLabel =
    mode === "service"
      ? t("requestQuote")
      : mode === "business"
        ? t("requestInformation")
        : t("contactAdvertiser");

  const secondaryLabel =
    mode === "vehicle"
      ? t("bookInspection")
      : mode === "service"
        ? t("contactProvider")
        : mode === "project"
          ? t("requestInformation")
          : t("scheduleVisit");

  const tertiaryLabel =
    mode === "vehicle" || mode === "project"
      ? t("askFinancing")
      : t("requestInformation");

  if (light) {
    return (
      <>
        <div className={cn("space-y-2.5", className)}>
          <button
            type="button"
            onClick={openChat}
            className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#EBAD5B] text-sm font-bold text-[#1A1205] transition hover:bg-[#F0BC73]"
          >
            <MessageCircle className="size-4" />
            {primaryLabel}
          </button>
          <button
            type="button"
            onClick={mode === "service" ? handleWhatsApp : openVisit}
            className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg border border-[#D1D5DB] bg-white text-sm font-semibold text-[#0B1220] transition hover:border-[#EBAD5B]"
          >
            <CalendarClock className="size-4" />
            {secondaryLabel}
          </button>
          <button
            type="button"
            onClick={mode === "vehicle" || mode === "project" ? openChat : openChat}
            className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg border border-[#D1D5DB] bg-white text-sm font-semibold text-[#0B1220] transition hover:border-[#EBAD5B]"
          >
            <Info className="size-4" />
            {tertiaryLabel}
          </button>
          <p className="flex items-center gap-2 pt-1 text-xs text-[#059669]">
            <span className="size-1.5 rounded-full bg-[#059669]" />
            {tDetail("onlineNow")}
          </p>
          {whatsappNumber ? (
            <button
              type="button"
              onClick={handleWhatsApp}
              className="w-full text-center text-xs font-semibold text-[#2563EB] hover:underline"
            >
              {t("whatsapp")}
            </button>
          ) : null}
        </div>

        <RscChatModal
          open={chatOpen}
          onClose={() => setChatOpen(false)}
          listing={contactListing}
        />
        <ScheduleVisitModal
          open={visitOpen}
          onClose={() => setVisitOpen(false)}
          listing={contactListing}
        />
      </>
    );
  }

  return (
    <>
      <div className={className}>
        <button
          type="button"
          className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-md bg-[#1d4ed8] text-sm font-semibold text-white hover:bg-[#1e40af]"
          onClick={openChat}
        >
          <MessageCircle className="size-4" />
          {t("chatRsc")}
        </button>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <button
            type="button"
            className="inline-flex h-10 items-center justify-center rounded-md bg-white/10 text-sm font-medium text-white/80 hover:bg-white/15 disabled:opacity-40"
            onClick={handleWhatsApp}
            disabled={!whatsappNumber}
          >
            {t("whatsapp")}
          </button>
          <button
            type="button"
            className="inline-flex h-10 items-center justify-center rounded-md bg-white/10 text-sm font-medium text-white/80 hover:bg-white/15"
            onClick={openVisit}
          >
            {t("scheduleVisit")}
          </button>
        </div>
        <p className="mt-4 flex items-center gap-2 text-xs text-white/55">
          <span className="size-2 rounded-full bg-emerald-500" />
          {tDetail("onlineNow")}
        </p>
      </div>

      <RscChatModal
        open={chatOpen}
        onClose={() => setChatOpen(false)}
        listing={contactListing}
      />
      <ScheduleVisitModal
        open={visitOpen}
        onClose={() => setVisitOpen(false)}
        listing={contactListing}
      />
    </>
  );
}
