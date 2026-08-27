"use client";

import { Building2, LayoutDashboard } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/routing";
import { getBackofficeLoginUrl } from "@/lib/backoffice/config";

export function EmpresaPainelPage() {
  const t = useTranslations("paraEmpresas.panel");
  const locale = useLocale();
  const loginUrl = getBackofficeLoginUrl(locale);

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col items-center justify-center px-6 py-16">
      <div className="flex size-14 items-center justify-center rounded-2xl border border-[#2BB8A8]/30 bg-[#2BB8A8]/10">
        <LayoutDashboard className="size-7 text-[#2BB8A8]" />
      </div>
      <h1 className="mt-6 text-center text-2xl font-bold text-white">{t("title")}</h1>
      <p className="mt-3 text-center text-sm leading-relaxed text-white/55">{t("subtitle")}</p>

      <a
        href={loginUrl}
        className="mt-8 flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#2BB8A8] text-sm font-semibold text-[#000a1a] transition-colors hover:bg-[#1E9B8C]"
      >
        {t("submit")}
      </a>

      <p className="mt-6 text-center text-sm text-white/40">
        {t("noAccount")}{" "}
        <Link href="/empresa/cadastro" className="font-medium text-[#2BB8A8] hover:underline">
          {t("register")}
        </Link>
      </p>

      <Link
        href="/para-empresas"
        className="mt-8 inline-flex items-center gap-2 text-xs text-white/35 transition-colors hover:text-white/60"
      >
        <Building2 className="size-3.5" />
        {t("backToLanding")}
      </Link>
    </div>
  );
}
