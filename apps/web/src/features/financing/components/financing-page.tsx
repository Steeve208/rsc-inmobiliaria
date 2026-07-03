"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/routing";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function formatCurrency(value: number, currency = "BRL") {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value);
}

export function FinancingPage() {
  const t = useTranslations("financing");
  const searchParams = useSearchParams();

  const initialPrice = Number(searchParams.get("price") || 500000);
  const initialDownPct = Number(searchParams.get("down") || 20);
  const listingId = searchParams.get("listingId") ?? "";
  const listingTitle = searchParams.get("title") ?? "";

  const [price, setPrice] = useState(initialPrice);
  const [downPct, setDownPct] = useState(initialDownPct);
  const [termMonths, setTermMonths] = useState(360);
  const [interestRate, setInterestRate] = useState(0.89);

  const downPayment = Math.round(price * (downPct / 100));
  const monthlyRate = interestRate / 100;
  const principal = price - downPayment;

  const installment = useMemo(() => {
    if (monthlyRate === 0) return principal / termMonths;
    const factor = Math.pow(1 + monthlyRate, termMonths);
    return (principal * monthlyRate * factor) / (factor - 1);
  }, [principal, monthlyRate, termMonths]);

  const creditHref = listingId
    ? `/financing?price=${price}&down=${downPct}&listingId=${listingId}&title=${encodeURIComponent(listingTitle)}#rsc-credit`
    : "#rsc-credit";

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">{t("title")}</h1>
        <p className="mt-2 text-white/60">{t("subtitle")}</p>
        {listingTitle ? (
          <p className="mt-2 text-sm text-[#60a5fa]">
            {t("forListing")}: {listingTitle}
          </p>
        ) : null}
      </div>

      <div className="space-y-6 rounded-2xl border border-white/10 bg-[#0a1428]/80 p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="fin-price">{t("propertyValue")}</Label>
            <Input
              id="fin-price"
              type="number"
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
                value={formatCurrency(downPayment)}
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
              value={interestRate}
              onChange={(e) => setInterestRate(Number(e.target.value))}
              className="border-white/10 bg-[#0a111f] text-white"
            />
          </div>
        </div>

        <div className="rounded-xl bg-[#1d4ed8]/10 px-4 py-4">
          <p className="text-sm text-white/70">{t("estimatedInstallment")}</p>
          <p className="mt-1 text-2xl font-bold text-white">
            {formatCurrency(installment)}
            <span className="text-base font-normal text-white/50">{t("perMonth")}</span>
          </p>
        </div>
      </div>

      <section id="rsc-credit" className="mt-8 rounded-2xl border border-[#d4a017]/30 bg-[#d4a017]/10 p-6">
        <h2 className="text-xl font-bold text-white">{t("rscCreditTitle")}</h2>
        <p className="mt-2 text-sm text-white/65">{t("rscCreditBody")}</p>
        <ul className="mt-4 space-y-2 text-sm text-white/70">
          <li>• {t("benefit1")}</li>
          <li>• {t("benefit2")}</li>
          <li>• {t("benefit3")}</li>
        </ul>
        <Link
          href={listingId ? `/imoveis/${listingId}` : "/imoveis"}
          className="mt-6 inline-flex items-center justify-center rounded-md bg-[#d4a017] px-4 py-2 text-sm font-semibold text-[#0a111f] transition-colors hover:bg-[#eebc49]"
        >
          {t("cta")}
        </Link>
      </section>
    </div>
  );
}
