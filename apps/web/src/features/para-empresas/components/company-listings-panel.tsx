"use client";

import { Building2, ExternalLink } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

type Props = {
  companyId: string;
};

function getBackofficeLoginHref(locale: string) {
  const base =
    process.env.NEXT_PUBLIC_BACKOFFICE_URL?.trim() ||
    process.env.NEXT_PUBLIC_API_URL?.trim() ||
    "";
  if (!base) return null;
  return `${base.replace(/\/$/, "")}/${locale}/auth/login`;
}

/** Local listing CRUD is disabled — companies manage inventory in the backoffice. */
export function CompanyListingsPanel({ companyId }: Props) {
  void companyId;
  const t = useTranslations("contact.company.listings");
  const locale = useLocale();
  const href = getBackofficeLoginHref(locale);

  return (
    <section className="rounded-xl bg-white/5 p-10 text-center">
      <Building2 className="mx-auto size-10 text-white/35" />
      <p className="mt-4 font-medium text-white">{t("disabledTitle")}</p>
      <p className="mx-auto mt-2 max-w-md text-sm text-white/45">
        {t("disabledBody")}
      </p>
      {href ? (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-flex h-9 items-center justify-center gap-2 rounded-lg bg-[#d4a017] px-3 text-sm font-medium text-[#000a1a] transition-colors hover:bg-[#e0b020]"
        >
          {t("disabledCta")}
          <ExternalLink className="size-4" />
        </a>
      ) : null}
    </section>
  );
}
