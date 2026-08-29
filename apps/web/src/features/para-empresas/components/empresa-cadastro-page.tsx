"use client";

import { useState } from "react";
import { ArrowLeft, Building2, CheckCircle2, Home, Landmark } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/routing";
import {
  COMPANY_ACCOUNT_TYPES,
  type CompanyAccountType,
} from "@/lib/company/kinds";
import { cn } from "@/lib/utils";

type Field = "company" | "cnpj" | "email" | "phone";
const FIELDS: Field[] = ["company", "cnpj", "email", "phone"];

const ACCOUNT_ICONS = {
  real_estate: Home,
  project: Landmark,
  automotive: Building2,
} as const;

export function EmpresaCadastroPage() {
  const t = useTranslations("paraEmpresas.signup");
  const [values, setValues] = useState<Record<Field, string>>({
    company: "",
    cnpj: "",
    email: "",
    phone: "",
  });
  const [accountType, setAccountType] = useState<CompanyAccountType>("real_estate");
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setStatus("loading");

    try {
      const res = await fetch("/api/registration-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyName: values.company,
          contactName: values.company,
          contactEmail: values.email,
          contactPhone: values.phone,
          category: accountType,
          cnpj: values.cnpj,
        }),
      });

      if (!res.ok) {
        const payload = (await res.json().catch(() => null)) as {
          error?: string;
        } | null;
        if (payload?.error === "DUPLICATE_PENDING") {
          setError(t("duplicate"));
        } else {
          setError(t("error"));
        }
        setStatus("idle");
        return;
      }

      setStatus("success");
    } catch {
      setError(t("error"));
      setStatus("idle");
    }
  }

  return (
    <div className="market-container py-8 lg:py-10">
      <div className="mx-auto max-w-lg">
        <Link
          href="/para-empresas"
          className="inline-flex items-center gap-1.5 text-sm text-white/45 transition-colors hover:text-white/70"
        >
          <ArrowLeft className="size-4" />
          {t("back")}
        </Link>

        {status === "success" ? (
          <div className="mt-10 rounded-2xl border border-[#2BB8A8]/20 bg-[#2BB8A8]/5 p-8 text-center">
            <div className="mx-auto flex size-12 items-center justify-center rounded-xl bg-[#2BB8A8]/10">
              <CheckCircle2 className="size-6 text-[#2BB8A8]" />
            </div>
            <h1 className="mt-6 text-2xl font-bold text-white">
              {t("successTitle")}
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-white/60">
              {t("successMessage")}
            </p>
            <Link
              href="/para-empresas"
              className="mt-8 inline-flex h-11 items-center justify-center rounded-lg bg-[#2BB8A8] px-6 text-sm font-semibold text-[#000a1a] transition-colors hover:bg-[#1E9B8C]"
            >
              {t("back")}
            </Link>
          </div>
        ) : (
          <>
            <div className="mt-8 flex size-12 items-center justify-center rounded-xl bg-[#2BB8A8]/10">
              <Building2 className="size-6 text-[#2BB8A8]" />
            </div>
            <h1 className="mt-6 text-2xl font-bold text-white sm:text-3xl">
              {t("title")}
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-white/55 sm:text-base">
              {t("subtitle")}
            </p>

            <form className="mt-10 space-y-5" onSubmit={handleSubmit}>
              <fieldset>
                <legend className="mb-2 block text-xs font-medium text-white/50">
                  {t("accountType")}
                </legend>
                <p className="mb-3 text-xs leading-relaxed text-white/40">
                  {t("accountTypeHint")}
                </p>
                <div className="grid gap-2">
                  {COMPANY_ACCOUNT_TYPES.map((type) => {
                    const Icon = ACCOUNT_ICONS[type];
                    const selected = accountType === type;
                    return (
                      <label
                        key={type}
                        className={cn(
                          "flex cursor-pointer items-start gap-3 rounded-xl px-4 py-3 transition-colors",
                          selected
                            ? "bg-[#2BB8A8]/15 ring-1 ring-[#2BB8A8]/40"
                            : "bg-white/5 hover:bg-white/[0.08]",
                        )}
                      >
                        <input
                          type="radio"
                          name="accountType"
                          value={type}
                          checked={selected}
                          onChange={() => setAccountType(type)}
                          className="mt-1 accent-[#2BB8A8]"
                        />
                        <Icon className="mt-0.5 size-4 shrink-0 text-[#2BB8A8]" />
                        <span>
                          <span className="block text-sm font-medium text-white">
                            {t(`types.${type}`)}
                          </span>
                          <span className="mt-0.5 block text-xs text-white/45">
                            {t(`types.${type}Hint`)}
                          </span>
                        </span>
                      </label>
                    );
                  })}
                </div>
              </fieldset>

              {FIELDS.map((field) => (
                <div key={field}>
                  <label
                    htmlFor={field}
                    className="mb-1.5 block text-xs font-medium text-white/50"
                  >
                    {t(field)}
                  </label>
                  <input
                    id={field}
                    type={field === "email" ? "email" : "text"}
                    required
                    value={values[field]}
                    onChange={(e) =>
                      setValues((prev) => ({ ...prev, [field]: e.target.value }))
                    }
                    placeholder={t(`${field}Placeholder`)}
                    className="h-11 w-full rounded-lg bg-white/5 px-4 text-sm text-white outline-none placeholder:text-white/30 focus:bg-white/[0.08] focus:ring-2 focus:ring-[#2BB8A8]/40"
                  />
                </div>
              ))}

              {error && (
                <p className="rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={status === "loading"}
                className="mt-2 flex h-12 w-full items-center justify-center rounded-lg bg-[#2BB8A8] text-sm font-semibold text-[#000a1a] transition-colors hover:bg-[#1E9B8C] disabled:opacity-60"
              >
                {status === "loading" ? t("submitting") : t("submit")}
              </button>
            </form>

            <div className="mt-8 rounded-xl bg-[#2BB8A8]/5 p-5">
              <p className="text-sm text-white/70">
                <strong className="text-[#2BB8A8]">{t("noteLabel")}</strong>{" "}
                {t("note")}
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
