"use client";

import { Mail, MessageCircle, Phone } from "lucide-react";
import { useTranslations } from "next-intl";
import { buildWhatsAppUrl } from "@/lib/leads/whatsapp";
import { cn } from "@/lib/utils";
import type { BrokerProfile } from "../types";

type Variant = "card" | "panel";

type Props = {
  broker: BrokerProfile;
  variant?: Variant;
  className?: string;
};

export function BrokerContactActions({
  broker,
  variant = "card",
  className,
}: Props) {
  const t = useTranslations("corredores");
  const compact = variant === "card";
  const whatsappUrl = broker.whatsapp
    ? buildWhatsAppUrl(broker.whatsapp, t("whatsappPrefill", { name: broker.name }))
    : null;
  const telHref = broker.phone ? `tel:${broker.phone.replace(/\s/g, "")}` : null;
  const mailHref = broker.email
    ? `mailto:${broker.email}?subject=${encodeURIComponent(t("emailSubject", { name: broker.name }))}`
    : null;

  const btn =
    compact
      ? "inline-flex h-8 flex-1 items-center justify-center gap-1 rounded-md text-[11px] font-semibold"
      : "inline-flex h-10 w-full items-center justify-center gap-2 rounded-md text-sm font-semibold";

  return (
    <div
      className={cn(compact ? "grid grid-cols-3 gap-1.5" : "grid gap-2", className)}
      onClick={(event) => event.stopPropagation()}
    >
      <a
        href={whatsappUrl ?? undefined}
        target="_blank"
        rel="noopener noreferrer"
        aria-disabled={!whatsappUrl}
        className={cn(
          btn,
          whatsappUrl
            ? "bg-[#128C7E] text-white hover:bg-[#0E7A6E]"
            : "pointer-events-none bg-[#E5E7EB] text-[#9CA3AF]",
        )}
      >
        <MessageCircle className={compact ? "size-3.5" : "size-4"} />
        {t("whatsapp")}
      </a>
      <a
        href={telHref ?? undefined}
        aria-disabled={!telHref}
        className={cn(
          btn,
          telHref
            ? "bg-[#0B1220] text-white hover:bg-[#1A2233]"
            : "pointer-events-none bg-[#E5E7EB] text-[#9CA3AF]",
        )}
      >
        <Phone className={compact ? "size-3.5" : "size-4"} />
        {t("call")}
      </a>
      <a
        href={mailHref ?? undefined}
        aria-disabled={!mailHref}
        className={cn(
          btn,
          mailHref
            ? "bg-white text-[#0B1220] ring-1 ring-[#E5E7EB] hover:bg-[#F9FAFB]"
            : "pointer-events-none bg-[#E5E7EB] text-[#9CA3AF]",
        )}
      >
        <Mail className={compact ? "size-3.5" : "size-4"} />
        {t("email")}
      </a>
    </div>
  );
}
