"use client";

import { useTranslations } from "next-intl";
import { Building2, Clock3, MapPin, Phone } from "lucide-react";
import type { CompanyPublicInfo } from "@/features/imoveis/types";

const DAY_KEYS = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
] as const;

type CompanyPresenceCardProps = {
  companyName: string;
  companyLogoUrl?: string;
  companyInfo: CompanyPublicInfo;
  title?: string;
};

function formatLocation(info: CompanyPublicInfo): string | null {
  const parts = [
    info.address,
    [info.city, info.state].filter(Boolean).join(", "),
    info.postalCode,
  ].filter(Boolean);
  return parts.length > 0 ? parts.join(" · ") : null;
}

export function CompanyPresenceCard({
  companyName,
  companyLogoUrl,
  companyInfo,
  title,
}: CompanyPresenceCardProps) {
  const t = useTranslations("companyPresence");
  const location = formatLocation(companyInfo);
  const hasHours = companyInfo.businessHours.length > 0;
  const hasDetails =
    Boolean(companyInfo.cnpj) ||
    Boolean(companyInfo.phone) ||
    Boolean(location) ||
    hasHours;

  return (
    <div className="rounded-xl bg-[#111d2f] p-5">
      <p className="text-xs font-semibold uppercase tracking-wider text-white/40">
        {title ?? t("title")}
      </p>

      <div className="mt-3 flex items-center gap-3">
        {companyLogoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={companyLogoUrl}
            alt={companyName}
            className="size-12 rounded-lg object-cover"
          />
        ) : (
          <div className="flex size-12 items-center justify-center rounded-lg bg-[#1d4ed8] text-sm font-bold text-white">
            {companyName.slice(0, 3).toUpperCase()}
          </div>
        )}
        <div>
          <p className="font-semibold text-white">{companyName}</p>
          {companyInfo.branchName && companyInfo.branchName !== companyName ? (
            <p className="text-sm text-white/50">{companyInfo.branchName}</p>
          ) : null}
        </div>
      </div>

      {hasDetails ? (
        <div className="mt-4 space-y-3 text-sm text-white/70">
          {companyInfo.cnpj ? (
            <div className="flex items-start gap-2">
              <Building2 className="mt-0.5 size-4 shrink-0 text-[#d4a017]" />
              <div>
                <p className="text-xs uppercase tracking-wide text-white/40">{t("cnpj")}</p>
                <p className="text-white">{companyInfo.cnpj}</p>
              </div>
            </div>
          ) : null}

          {location ? (
            <div className="flex items-start gap-2">
              <MapPin className="mt-0.5 size-4 shrink-0 text-[#d4a017]" />
              <div>
                <p className="text-xs uppercase tracking-wide text-white/40">{t("address")}</p>
                <p className="text-white">{location}</p>
              </div>
            </div>
          ) : null}

          {companyInfo.phone ? (
            <div className="flex items-start gap-2">
              <Phone className="mt-0.5 size-4 shrink-0 text-[#d4a017]" />
              <div>
                <p className="text-xs uppercase tracking-wide text-white/40">{t("phone")}</p>
                <p className="text-white">{companyInfo.phone}</p>
              </div>
            </div>
          ) : null}

          {hasHours ? (
            <div className="flex items-start gap-2">
              <Clock3 className="mt-0.5 size-4 shrink-0 text-[#d4a017]" />
              <div className="min-w-0 flex-1">
                <p className="text-xs uppercase tracking-wide text-white/40">{t("hours")}</p>
                <ul className="mt-1 space-y-1">
                  {DAY_KEYS.map((dayKey, index) => {
                    const entry = companyInfo.businessHours.find(
                      (hour) => hour.dayOfWeek === index,
                    );
                    if (!entry) return null;
                    return (
                      <li
                        key={dayKey}
                        className="flex items-center justify-between gap-3 text-xs"
                      >
                        <span className="text-white/55">{t(`days.${dayKey}`)}</span>
                        <span className="tabular-nums text-white">
                          {entry.isClosed
                            ? t("closed")
                            : `${entry.openTime} – ${entry.closeTime}`}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          ) : null}
        </div>
      ) : (
        <p className="mt-4 text-sm text-white/45">{t("noDetails")}</p>
      )}
    </div>
  );
}
