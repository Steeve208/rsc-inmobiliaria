"use client";

import { useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/routing";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createFinancingRequest } from "@/lib/financing/client";
import { useBuyerIdentity, setBuyerName } from "@/hooks/use-buyer-identity";
import type { ListingCategory } from "@/lib/leads/types";

function formatCurrency(value: number, locale: string, currency = "BRL") {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value);
}

export type FinancingSimulatorProps = {
  initialPrice?: number;
  initialDownPct?: number;
  listingId?: string;
  listingTitle?: string;
  listingCategory?: ListingCategory;
  currency?: string;
};

export function FinancingSimulator({
  initialPrice = 500000,
  initialDownPct = 20,
  listingId = "",
  listingTitle = "",
  listingCategory = "properties",
  currency = "BRL",
}: FinancingSimulatorProps) {
  const t = useTranslations("financing");
  const locale = useLocale();
  const { buyerId, buyerName, buyerEmail } = useBuyerIdentity();

  const [price, setPrice] = useState(initialPrice);
  const [downPct, setDownPct] = useState(initialDownPct);
  const [termMonths, setTermMonths] = useState(360);
  const [interestRate, setInterestRate] = useState(0.89);
  const [name, setName] = useState(buyerName);
  const [email, setEmail] = useState(buyerEmail ?? "");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submittedId, setSubmittedId] = useState<string | null>(null);

  const downPayment = Math.round(price * (downPct / 100));
  const monthlyRate = interestRate / 100;
  const principal = price - downPayment;

  const installment = useMemo(() => {
    if (monthlyRate === 0) return principal / termMonths;
    const factor = Math.pow(1 + monthlyRate, termMonths);
    return (principal * monthlyRate * factor) / (factor - 1);
  }, [principal, monthlyRate, termMonths]);

  const intlLocale =
    locale === "pt" ? "pt-BR" : locale === "es" ? "es-ES" : "en-US";

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSubmitting(true);
    setSubmitError("");

    if (name.trim()) setBuyerName(name.trim());

    try {
      const created = await createFinancingRequest({
        buyerId,
        buyerName: name.trim() || undefined,
        buyerEmail: email.trim() || undefined,
        buyerPhone: phone.trim() || undefined,
        listingId: listingId || undefined,
        listingTitle: listingTitle || undefined,
        listingCategory: listingId ? listingCategory : undefined,
        propertyValue: price,
        downPaymentPct: downPct,
        downPaymentAmount: downPayment,
        termMonths,
        interestRate,
        estimatedInstallment: Math.round(installment),
        currency,
        notes: notes.trim() || undefined,
      });
      setSubmittedId(created.id);
    } catch {
      setSubmitError(t("submitError"));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="space-y-8" onSubmit={handleSubmit}>
      <div className="space-y-6 rounded-2xl border border-white/10 bg-[#0a1428]/80 p-6">
        <div>
          <h2 className="text-lg font-semibold text-white">{t("simulatorTitle")}</h2>
          {listingTitle ? (
            <p className="mt-1 text-sm text-[#60a5fa]">
              {t("forListing")}: {listingTitle}
            </p>
          ) : null}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="fin-price">{t("propertyValue")}</Label>
            <Input
              id="fin-price"
              type="number"
              min={1}
              required
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              className="border-white/10 bg-[#0a111f] text-white"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="fin-down">{t("downPayment")}</Label>
            <div className="flex gap-2">
              <Input
                id="fin-down"
                readOnly
                value={formatCurrency(downPayment, intlLocale, currency)}
                className="border-white/10 bg-[#0a111f] text-white"
              />
              <select
                value={downPct}
                onChange={(e) => setDownPct(Number(e.target.value))}
                className="rounded-md border border-white/10 bg-[#0a111f] px-3 text-white"
              >
                {[10, 20, 30, 40, 50].map((p) => (
                  <option key={p} value={p}>
                    {p}%
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="fin-term">{t("term")}</Label>
            <Input
              id="fin-term"
              type="number"
              min={1}
              max={480}
              required
              value={termMonths}
              onChange={(e) => setTermMonths(Number(e.target.value))}
              className="border-white/10 bg-[#0a111f] text-white"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="fin-rate">{t("rate")}</Label>
            <Input
              id="fin-rate"
              type="number"
              step="0.01"
              min={0}
              required
              value={interestRate}
              onChange={(e) => setInterestRate(Number(e.target.value))}
              className="border-white/10 bg-[#0a111f] text-white"
            />
          </div>
        </div>

        <div className="rounded-xl bg-[#1d4ed8]/10 px-4 py-4">
          <p className="text-sm text-white/70">{t("estimatedInstallment")}</p>
          <p className="mt-1 text-2xl font-bold text-white">
            {formatCurrency(installment, intlLocale, currency)}
            <span className="text-base font-normal text-white/50">{t("perMonth")}</span>
          </p>
        </div>
      </div>

      <section
        id="rsc-credit"
        className="rounded-2xl border border-[#d4a017]/30 bg-[#d4a017]/10 p-6"
      >
        <h2 className="text-xl font-bold text-white">{t("rscCreditTitle")}</h2>
        <p className="mt-2 text-sm text-white/65">{t("rscCreditBody")}</p>
        <ul className="mt-4 space-y-2 text-sm text-white/70">
          <li>• {t("benefit1")}</li>
          <li>• {t("benefit2")}</li>
          <li>• {t("benefit3")}</li>
        </ul>

        {submittedId ? (
          <div className="mt-6 rounded-lg bg-emerald-500/10 px-4 py-3">
            <p className="text-sm font-medium text-emerald-300">{t("submitSuccess")}</p>
            <p className="mt-1 text-xs text-white/50">{t("requestId", { id: submittedId })}</p>
            <Link
              href="/dashboard/requests"
              className="mt-3 inline-flex items-center justify-center rounded-md bg-[#d4a017] px-4 py-2 text-sm font-semibold text-[#0a111f] transition-colors hover:bg-[#eebc49]"
            >
              {t("viewRequests")}
            </Link>
          </div>
        ) : (
          <>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="fin-name">{t("applicantName")}</Label>
                <Input
                  id="fin-name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="border-white/10 bg-[#0a111f] text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fin-email">{t("applicantEmail")}</Label>
                <Input
                  id="fin-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border-white/10 bg-[#0a111f] text-white"
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="fin-phone">{t("applicantPhone")}</Label>
                <Input
                  id="fin-phone"
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="border-white/10 bg-[#0a111f] text-white"
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="fin-notes">{t("notes")}</Label>
                <textarea
                  id="fin-notes"
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder={t("notesPlaceholder")}
                  className="w-full rounded-md border border-white/10 bg-[#0a111f] px-3 py-2 text-sm text-white"
                />
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <Button
                type="submit"
                disabled={submitting}
                className="bg-[#d4a017] text-[#0a111f] hover:bg-[#eebc49]"
              >
                {submitting ? t("submitting") : t("submitRequest")}
              </Button>
              <Link
                href={
                  listingId
                    ? listingCategory === "vehicles"
                      ? `/veiculos/${listingId}`
                      : `/imoveis/${listingId}`
                    : "/imoveis"
                }
                className="inline-flex items-center justify-center rounded-md border border-white/15 px-4 py-2 text-sm font-medium text-white/80 transition-colors hover:bg-white/10"
              >
                {t("cta")}
              </Link>
            </div>
          </>
        )}

        {submitError ? <p className="mt-3 text-sm text-red-400">{submitError}</p> : null}
      </section>
    </form>
  );
}
