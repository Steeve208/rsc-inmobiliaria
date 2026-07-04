import type { ListingReport } from "./types";
import {
  getAppUrl,
  isAdminReportEmailConfigured,
  isResendConfigured,
  logMissingEnvOnce,
} from "@/lib/env/production-config";

function buildReviewUrl(reportId: string) {
  return `${getAppUrl()}/admin/reports/${reportId}`;
}

function buildListingUrl(report: ListingReport) {
  const base = getAppUrl();
  if (report.listingKind === "vehicle") {
    return `${base}/veiculos/${report.listingId}`;
  }
  return `${base}/imoveis/${report.listingId}`;
}

function buildEmailHtml(report: ListingReport) {
  const reviewUrl = buildReviewUrl(report.id);
  const listingUrl = buildListingUrl(report);

  return `
    <h2>New listing report</h2>
    <p><strong>Listing:</strong> ${report.listingTitle}</p>
    <p><strong>Kind:</strong> ${report.listingKind}</p>
    <p><strong>Reason:</strong></p>
    <p>${report.reason.replace(/\n/g, "<br>")}</p>
    ${
      report.reporterEmail
        ? `<p><strong>Reporter email:</strong> ${report.reporterEmail}</p>`
        : ""
    }
    <p>
      <a href="${listingUrl}">View listing</a> ·
      <a href="${reviewUrl}">Review report</a>
    </p>
  `.trim();
}

export async function notifyAdminNewReport(report: ListingReport) {
  const reviewUrl = buildReviewUrl(report.id);

  if (isAdminReportEmailConfigured()) {
    const resendKey = process.env.RESEND_API_KEY!;
    const adminEmail = process.env.ADMIN_NOTIFY_EMAIL!;
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from:
            process.env.RESEND_FROM_EMAIL ??
            "RSC Market <onboarding@resend.dev>",
          to: [adminEmail],
          subject: `[RSC Market] New report: ${report.listingTitle}`,
          html: buildEmailHtml(report),
        }),
      });

      if (!res.ok) {
        const body = await res.text().catch(() => "");
        console.error("[notify-admin] Resend failed:", res.status, body);
      }
    } catch (error) {
      console.error("[notify-admin] Resend error:", error);
    }
    return;
  }

  if (!isResendConfigured()) {
    logMissingEnvOnce(
      "RESEND_API_KEY",
      "moderation",
      "Report stored but email not sent. Set RESEND_API_KEY to enable outbound mail.",
    );
  } else if (!process.env.ADMIN_NOTIFY_EMAIL?.trim()) {
    logMissingEnvOnce(
      "ADMIN_NOTIFY_EMAIL",
      "moderation",
      "Report stored but no admin recipient. Set ADMIN_NOTIFY_EMAIL for report alerts.",
    );
  }

  console.info("[listing-report-notify]", {
    reportId: report.id,
    listingId: report.listingId,
    listingKind: report.listingKind,
    listingTitle: report.listingTitle,
    reviewUrl,
  });
}
