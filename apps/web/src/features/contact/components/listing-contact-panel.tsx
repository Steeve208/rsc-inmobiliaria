"use client";

import { useEffect, useState } from "react";
import { MessageCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import type { ListingContactContext } from "@/lib/leads/types";
import { buildWhatsAppUrl } from "@/lib/leads/whatsapp";
import { RscChatModal } from "./rsc-chat-modal";
import { ScheduleVisitModal } from "./schedule-visit-modal";

type Props = {
  listing: ListingContactContext;
  className?: string;
};

export function ListingContactPanel({ listing, className }: Props) {
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
    const url = buildWhatsAppUrl(
      whatsappNumber,
      t("whatsappPrefill", { title: listing.listingTitle }),
      listing.listingTitle,
    );

    if (!url) return;
    window.open(url, "_blank", "noopener,noreferrer");
  }

  const contactListing: ListingContactContext = {
    ...listing,
    whatsappNumber,
  };

  return (
    <>
      <div className={className}>
        <Button
          type="button"
          className="w-full bg-[#1d4ed8] hover:bg-[#1e40af]"
          onClick={() => setChatOpen(true)}
        >
          <MessageCircle className="mr-2 size-4" />
          {t("chatRsc")}
        </Button>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <Button
            type="button"
            variant="outline"
            className="border-0 bg-white/10 text-white/80 hover:bg-white/15"
            onClick={handleWhatsApp}
          >
            {t("whatsapp")}
          </Button>
          <Button
            type="button"
            variant="outline"
            className="border-0 bg-white/10 text-white/80 hover:bg-white/15"
            onClick={() => setVisitOpen(true)}
          >
            {t("scheduleVisit")}
          </Button>
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
