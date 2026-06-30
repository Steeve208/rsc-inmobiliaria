"use client";

import { useState } from "react";
import { ArrowLeft, Building2, CheckCircle2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/routing";

type Field = "company" | "cnpj" | "email" | "phone";
const FIELDS: Field[] = ["company", "cnpj", "email", "phone"];

export function EmpresaCadastroPage() {
  const t = useTranslations("paraEmpresas.signup");
  const [values, setValues] = useState<Record<Field, string>>({
    company: "",
    cnpj: "",
    email: "",
    phone: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setStatus("loading");

    try {
      const res = await fetch("/api/companies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!res.ok) {
        setError(t("error"));
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
          <div className="mt-10 rounded-2xl border border-[#d4a017]/20 bg-[#d4a017]/5 p-8 text-center">
            <div className="mx-auto flex size-12 items-center justify-center rounded-xl bg-[#d4a017]/10">
              <CheckCircle2 className="size-6 text-[#d4a017]" />
            </div>
            <h1 className="mt-6 text-2xl font-bold text-white">
              {t("successTitle")}
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-white/60">
              {t("successMessage")}
            </p>
            <Link
              href="/para-empresas"
              className="mt-8 inline-flex h-11 items-center justify-center rounded-lg bg-[#d4a017] px-6 text-sm font-semibold text-[#000a1a] transition-colors hover:bg-[#c39216]"
            >
              {t("back")}
            </Link>
          </div>
        ) : (
          <>
            <div className="mt-8 flex size-12 items-center justify-center rounded-xl bg-[#d4a017]/10">
              <Building2 className="size-6 text-[#d4a017]" />
            </div>
            <h1 className="mt-6 text-2xl font-bold text-white sm:text-3xl">
              {t("title")}
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-white/55 sm:text-base">
              {t("subtitle")}
            </p>

            <form className="mt-10 space-y-5" onSubmit={handleSubmit}>
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
                    className="h-11 w-full rounded-lg bg-white/5 px-4 text-sm text-white outline-none placeholder:text-white/30 focus:bg-white/[0.08] focus:ring-2 focus:ring-[#d4a017]/40"
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
                className="mt-2 flex h-12 w-full items-center justify-center rounded-lg bg-[#d4a017] text-sm font-semibold text-[#000a1a] transition-colors hover:bg-[#c39216] disabled:opacity-60"
              >
                {status === "loading" ? t("submitting") : t("submit")}
              </button>
            </form>

            <div className="mt-8 rounded-xl bg-[#d4a017]/5 p-5">
              <p className="text-sm text-white/70">
                <strong className="text-[#d4a017]">{t("noteLabel")}</strong>{" "}
                {t("note")}
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
