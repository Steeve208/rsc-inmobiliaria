"use client";

import { Building2, LayoutDashboard, Lock } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/lib/i18n/routing";

export function EmpresaPainelPage() {
  const t = useTranslations("paraEmpresas.panel");
  const router = useRouter();

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col items-center justify-center px-6 py-16">
      <div className="flex size-14 items-center justify-center rounded-2xl border border-[#d4a017]/30 bg-[#d4a017]/10">
        <LayoutDashboard className="size-7 text-[#d4a017]" />
      </div>
      <h1 className="mt-6 text-center text-2xl font-bold text-white">{t("title")}</h1>
      <p className="mt-3 text-center text-sm leading-relaxed text-white/55">{t("subtitle")}</p>

      <form
        className="mt-8 w-full space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          router.push("/empresa/painel/dashboard?company=rsc-imoveis");
        }}
      >
        <div>
          <label htmlFor="email" className="mb-1.5 block text-xs font-medium text-white/50">
            {t("email")}
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            placeholder={t("emailPlaceholder")}
            className="h-11 w-full rounded-lg border border-white/10 bg-white/5 px-4 text-sm text-white outline-none placeholder:text-white/30 focus:border-[#d4a017]/50"
          />
        </div>
        <div>
          <label htmlFor="password" className="mb-1.5 block text-xs font-medium text-white/50">
            {t("password")}
          </label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            placeholder="••••••••"
            className="h-11 w-full rounded-lg border border-white/10 bg-white/5 px-4 text-sm text-white outline-none placeholder:text-white/30 focus:border-[#d4a017]/50"
          />
        </div>
        <button
          type="submit"
          className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#d4a017] text-sm font-semibold text-[#000a1a] transition-colors hover:bg-[#c39216]"
        >
          <Lock className="size-4" />
          {t("submit")}
        </button>
      </form>

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
