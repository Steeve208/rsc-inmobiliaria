"use client";

import { Calendar, CheckCircle2, Home } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/lib/i18n/routing";

function formatVisitDate(date: string, locale: string) {
  if (!date) return "";
  try {
    return new Intl.DateTimeFormat(locale, {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(new Date(`${date}T12:00:00`));
  } catch {
    return date;
  }
}

function formatVisitTime(time: string, locale: string) {
  if (!time) return "";
  try {
    const [hours, minutes] = time.split(":");
    const date = new Date();
    date.setHours(Number(hours), Number(minutes), 0, 0);
    return new Intl.DateTimeFormat(locale, {
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  } catch {
    return time;
  }
}

export function VisitConfirmedPanel() {
  const t = useTranslations("contact.visitConfirmed");
  const locale = useLocale();
  const searchParams = useSearchParams();

  const listingTitle = searchParams.get("title") ?? "";
  const companyName = searchParams.get("company") ?? "";
  const preferredDate = searchParams.get("date") ?? "";
  const preferredTime = searchParams.get("time") ?? "";
  const listingId = searchParams.get("listingId") ?? "";

  const hasDetails = Boolean(listingTitle || companyName || preferredDate);

  return (
    <div className="mx-auto max-w-lg">
      <div className="rounded-2xl border border-white/10 bg-[#0a1428]/90 p-8 text-center shadow-xl shadow-black/20">
        <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-emerald-500/15">
          <CheckCircle2 className="size-8 text-emerald-400" />
        </div>
        <h1 className="mt-6 text-2xl font-bold text-white">{t("title")}</h1>
        <p className="mt-2 text-sm text-white/60">{t("subtitle")}</p>

        {hasDetails && (
          <div className="mt-8 space-y-3 rounded-xl border border-white/10 bg-white/[0.03] p-4 text-left">
            {listingTitle && (
              <div className="flex items-start gap-3">
                <Home className="mt-0.5 size-4 shrink-0 text-[#60a5fa]" />
                <div>
                  <p className="text-xs text-white/45">{t("property")}</p>
                  <p className="text-sm font-medium text-white">{listingTitle}</p>
                </div>
              </div>
            )}
            {companyName && (
              <div className="flex items-start gap-3">
                <span className="mt-1.5 size-2 shrink-0 rounded-full bg-emerald-500" />
                <div>
                  <p className="text-xs text-white/45">{t("agency")}</p>
                  <p className="text-sm font-medium text-white">{companyName}</p>
                </div>
              </div>
            )}
            {(preferredDate || preferredTime) && (
              <div className="flex items-start gap-3">
                <Calendar className="mt-0.5 size-4 shrink-0 text-[#60a5fa]" />
                <div>
                  <p className="text-xs text-white/45">{t("schedule")}</p>
                  <p className="text-sm font-medium text-white">
                    {preferredDate && formatVisitDate(preferredDate, locale)}
                    {preferredDate && preferredTime && " · "}
                    {preferredTime && formatVisitTime(preferredTime, locale)}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        <p className="mt-6 text-sm text-white/55">{t("nextSteps")}</p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          {listingId ? (
            <Link
              href={`/imoveis/${listingId}`}
              className="inline-flex flex-1 items-center justify-center rounded-md bg-[#1d4ed8] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#1e40af]"
            >
              {t("backToProperty")}
            </Link>
          ) : null}
          <Link
            href="/imoveis"
            className="inline-flex flex-1 items-center justify-center rounded-md border border-white/15 bg-white/5 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-white/10"
          >
            {t("browseMore")}
          </Link>
        </div>
      </div>
    </div>
  );
}
