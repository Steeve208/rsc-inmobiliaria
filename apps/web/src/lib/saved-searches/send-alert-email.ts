import type { PropertyListing } from "@/features/imoveis/types";
import type { VehicleListing } from "@/features/veiculos/types";
import { isResendConfigured, logMissingEnvOnce } from "@/lib/env/production-config";
import type { SavedSearchVertical } from "./types";
import {
  buildAlertEmailHtml,
  buildAlertEmailSubject,
  resolveAlertEmailLocale,
} from "./email-copy";

export async function sendSavedSearchAlertEmail(input: {
  to: string;
  userName: string;
  searchLabel: string;
  vertical: SavedSearchVertical;
  listings: Array<PropertyListing | VehicleListing>;
  searchQuery: string;
  locale?: string;
}): Promise<{ sent: boolean; reason?: string }> {
  const from =
    process.env.RESEND_FROM_EMAIL ?? "RSC Market <onboarding@resend.dev>";

  const locale = resolveAlertEmailLocale(input.locale);
  const subject = buildAlertEmailSubject(
    locale,
    input.searchLabel,
    input.listings.length,
    input.vertical,
  );
  const html = buildAlertEmailHtml({
    locale,
    userName: input.userName,
    searchLabel: input.searchLabel,
    vertical: input.vertical,
    listings: input.listings,
    searchQuery: input.searchQuery,
  });

  if (!isResendConfigured()) {
    logMissingEnvOnce(
      "RESEND_API_KEY",
      "saved-search-alerts",
      "Alert skipped. Set RESEND_API_KEY to send saved-search emails.",
    );
    console.info("[saved-search-alert]", {
      to: input.to,
      subject,
      vertical: input.vertical,
      listingIds: input.listings.map((item) => item.id),
    });
    return { sent: false, reason: "resend_not_configured" };
  }

  const resendKey = process.env.RESEND_API_KEY!;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [input.to],
        subject,
        html,
      }),
    });

    if (!res.ok) {
      const body = await res.text().catch(() => "");
      console.error("[saved-search-alert] Resend failed:", res.status, body);
      return { sent: false, reason: "resend_failed" };
    }

    return { sent: true };
  } catch (error) {
    console.error("[saved-search-alert] Resend error:", error);
    return { sent: false, reason: "resend_error" };
  }
}
