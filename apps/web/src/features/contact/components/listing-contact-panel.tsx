"use client";

import { Suspense, useEffect, useState } from "react";
import { MessageCircle, CalendarClock, Info, Landmark, Mail } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import type { ChatMatchContext, ListingContactContext } from "@/lib/leads/types";
import { buildMailtoUrl } from "@/lib/leads/email";
import { buildWhatsAppUrl } from "@/lib/leads/whatsapp";
import { trackListingEvent } from "@/lib/listings/analytics-client";
import { fetchMatchExplain, recordMatchEvent } from "@/lib/match/client";
import { formatWhatsAppMatchMessage } from "@/lib/match/lead-context";
import { summarizeRequirements } from "@/lib/match/missing";
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
  financingHref?: string;
};

export function ListingContactPanel(props: Props) {
  return (
    <Suspense fallback={<ListingContactPanelInner {...props} />}>
      <ListingContactPanelWithMatch {...props} />
    </Suspense>
  );
}

function ListingContactPanelWithMatch(props: Props) {
  const searchParams = useSearchParams();
  const matchSessionId = searchParams.get("match");
  return <ListingContactPanelInner {...props} matchSessionId={matchSessionId} />;
}

function ListingContactPanelInner({
  listing,
  className,
  variant = "dark",
  mode = "property",
  financingHref,
  matchSessionId,
}: Props & { matchSessionId?: string | null }) {
  const t = useTranslations("contact.panel");
  const tDetail = useTranslations("imoveis.detail");
  const [whatsappNumber, setWhatsappNumber] = useState(listing.whatsappNumber);
  const [contactEmail, setContactEmail] = useState(listing.contactEmail ?? "");
  const [chatOpen, setChatOpen] = useState(false);
  const [visitOpen, setVisitOpen] = useState(false);
  const [matchContext, setMatchContext] = useState<ChatMatchContext | undefined>(
    listing.matchContext,
  );

  useEffect(() => {
    if (!matchSessionId) return;
    fetchMatchExplain(matchSessionId, listing.listingId)
      .then((explain) => {
        setMatchContext({
          sessionId: matchSessionId,
          matchScore: explain.totalScore,
          requirementsSummary: summarizeRequirements(explain.requirements),
        });
      })
      .catch(() => undefined);
  }, [matchSessionId, listing.listingId]);

  useEffect(() => {
    const params = new URLSearchParams({
      companyId: listing.companyId,
      companyName: listing.companyName,
      listingId: listing.listingId,
    });
    fetch(`/api/leads/company-config?${params.toString()}`)
      .then((response) => response.json())
      .then((config: { whatsappNumber?: string; contactEmail?: string }) => {
        if (config.whatsappNumber) setWhatsappNumber(config.whatsappNumber);
        if (config.contactEmail) setContactEmail(config.contactEmail);
      })
      .catch(() => {
        setWhatsappNumber(listing.whatsappNumber);
        setContactEmail(listing.contactEmail ?? "");
      });
  }, [
    listing.companyId,
    listing.companyName,
    listing.listingId,
    listing.whatsappNumber,
    listing.contactEmail,
  ]);

  function whatsappPrefill() {
    if (listing.listingCode) {
      return t("whatsappPropertyPrefill", { code: listing.listingCode });
    }
    if (matchContext) {
      return formatWhatsAppMatchMessage({
        listingTitle: listing.listingTitle,
        matchScore: matchContext.matchScore,
        summary: matchContext.requirementsSummary,
      });
    }
    return t("whatsappPrefill", { title: listing.listingTitle });
  }

  const whatsappUrl = buildWhatsAppUrl(
    whatsappNumber,
    whatsappPrefill(),
    listing.listingCode ? undefined : listing.listingTitle,
  );

  const emailBody = whatsappPrefill();
  const emailSubject = listing.listingCode
    ? t("emailSubject", { code: listing.listingCode })
    : listing.listingTitle;
  const mailtoUrl = contactEmail
    ? buildMailtoUrl(contactEmail, emailSubject, emailBody)
    : null;

  function trackWhatsAppClick() {
    void trackListingEvent(listing.listingId, "contact");
    if (matchContext) {
      void recordMatchEvent(matchContext.sessionId, listing.listingId, "property_contact");
    }
  }

  function openChat() {
    void trackListingEvent(listing.listingId, "click");
    if (matchContext) {
      void recordMatchEvent(matchContext.sessionId, listing.listingId, "property_contact");
    }
    setChatOpen(true);
  }

  function openVisit() {
    void trackListingEvent(listing.listingId, "click");
    setVisitOpen(true);
  }

  function openFinancing() {
    void trackListingEvent(listing.listingId, "click");
    if (financingHref) {
      window.location.assign(financingHref);
      return;
    }
    setChatOpen(true);
  }

  function openWhatsApp() {
    if (!whatsappUrl) return;
    trackWhatsAppClick();
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  }

  const secondaryAction =
    mode === "service"
      ? openWhatsApp
      : mode === "project"
        ? openChat
        : openVisit;

  const tertiaryAction =
    mode === "vehicle" || mode === "project" ? openFinancing : openChat;

  const contactListing: ListingContactContext = {
    ...listing,
    whatsappNumber,
    matchContext,
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
          {mode === "property" ? (
            <>
              {whatsappUrl ? (
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={trackWhatsAppClick}
                  className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#25D366] text-sm font-bold text-white transition hover:bg-[#1EBE5A]"
                >
                  <MessageCircle className="size-4" />
                  {t("whatsapp")}
                </a>
              ) : (
                <button
                  type="button"
                  disabled
                  className="inline-flex h-12 w-full cursor-not-allowed items-center justify-center gap-2 rounded-lg bg-[#25D366] text-sm font-bold text-white opacity-50"
                >
                  <MessageCircle className="size-4" />
                  {t("whatsapp")}
                </button>
              )}
              <a
                href={mailtoUrl ?? undefined}
                onClick={() => {
                  if (mailtoUrl) trackWhatsAppClick();
                }}
                className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg border border-[#D1D5DB] bg-white text-sm font-semibold text-[#0B1220] transition hover:border-[#EBAD5B]"
              >
                <Mail className="size-4" />
                {t("email")}
              </a>
              <button
                type="button"
                onClick={openVisit}
                className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg border border-[#D1D5DB] bg-white text-sm font-semibold text-[#0B1220] transition hover:border-[#EBAD5B]"
              >
                <CalendarClock className="size-4" />
                {t("scheduleVisit")}
              </button>
            </>
          ) : (
            <>
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
            onClick={secondaryAction}
            className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg border border-[#D1D5DB] bg-white text-sm font-semibold text-[#0B1220] transition hover:border-[#EBAD5B]"
          >
            {mode === "project" ? (
              <Info className="size-4" />
            ) : (
              <CalendarClock className="size-4" />
            )}
            {secondaryLabel}
          </button>
          <button
            type="button"
            onClick={tertiaryAction}
            className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg border border-[#D1D5DB] bg-white text-sm font-semibold text-[#0B1220] transition hover:border-[#EBAD5B]"
          >
            {mode === "project" ? (
              <Landmark className="size-4" />
            ) : (
              <Info className="size-4" />
            )}
            {tertiaryLabel}
          </button>
            </>
          )}
          <p className="flex items-center gap-2 pt-1 text-xs text-[#059669]">
            <span className="size-1.5 rounded-full bg-[#059669]" />
            {tDetail("onlineNow")}
          </p>
          {mode !== "property" && whatsappUrl ? (
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={trackWhatsAppClick}
              className="w-full text-center text-xs font-semibold text-[#2563EB] hover:underline"
            >
              {t("whatsapp")}
            </a>
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
            onClick={openWhatsApp}
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
