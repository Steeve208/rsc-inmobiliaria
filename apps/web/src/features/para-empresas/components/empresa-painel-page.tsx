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
      <div className="flex size-14 items-center justify-center rounded-2xl border border-[#d4a017]/30 bg-[#d4a017]/10">
        <LayoutDashboard className="size-7 text-[#d4a017]" />
      </div>
      <h1 className="mt-6 text-center text-2xl font-bold text-white">{t("title")}</h1>
      <p className="mt-3 text-center text-sm leading-relaxed text-white/55">{t("subtitle")}</p>

      {loginUrl ? (
        <a
          href={loginUrl}
          className="mt-8 flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#d4a017] text-sm font-semibold text-[#000a1a] transition-colors hover:bg-[#c39216]"
        >
          {t("submit")}
        </a>
      ) : (
        <Link
          href="/para-empresas"
          className="mt-8 flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#d4a017] text-sm font-semibold text-[#000a1a] transition-colors hover:bg-[#c39216]"
        >
          {t("backToLanding")}
        </Link>
      )}

      <p className="mt-6 text-center text-sm text-white/40">
        {t("noAccount")}{" "}
        <Link href="/empresa/cadastro" className="font-medium text-[#d4a017] hover:underline">
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
