"use client";

import { useTranslations } from "next-intl";
import {
  ArrowRight,
  Building2,
  Car,
  CheckCircle2,
  CreditCard,
  Handshake,
  Home,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { Link } from "@/lib/i18n/routing";
import { useMarket } from "@/lib/providers/market-provider";

export const RSC_CREDIT_URL = "https://rsccredit.com.br/";

const services = [
  { key: "home", icon: Home },
  { key: "vehicle", icon: Car },
  { key: "personal", icon: CreditCard },
  { key: "business", icon: Building2 },
] as const;

const steps = ["profile", "compare", "propose"] as const;

const guarantees = ["free", "partners", "support"] as const;

export function FinancingPage() {
  const t = useTranslations("financing");
  const { market, marketId } = useMarket();
  const available = market.creditAvailable && marketId === "br";

  if (!available) {
    return (
      <div className="bg-[#F7F5F0]">
        <div className="rk-container max-w-3xl py-16 sm:py-20">
          <p className="text-xs font-semibold tracking-[0.18em] text-[#D4A62A] uppercase">
            {t("unavailable.eyebrow")}
          </p>
          <h1 className="rk-display mt-3 text-3xl font-bold tracking-tight text-[#121826] sm:text-4xl">
            {t("unavailable.title")}
          </h1>
          <p className="mt-4 text-base leading-relaxed text-[#6B7285]">
            {t("unavailable.body", { country: market.countryName })}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/imoveis"
              className="rk-btn-gold inline-flex h-12 items-center justify-center px-6 text-sm"
            >
              {t("unavailable.ctaProperties")}
            </Link>
            <Link
              href="/"
              className="inline-flex h-12 items-center justify-center rounded-2xl border border-[#D8D2C4] bg-white px-6 text-sm font-semibold text-[#121826] transition-colors hover:border-[#D4A62A]/50"
            >
              {t("unavailable.ctaHome")}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#F7F5F0]">
      <section className="relative overflow-hidden bg-[#0B1220]">
        <div
          className="pointer-events-none absolute inset-0 opacity-50"
          style={{
            background:
              "radial-gradient(circle at 15% 20%, rgba(212,166,42,.22), transparent 40%), radial-gradient(circle at 85% 70%, rgba(255,255,255,.06), transparent 35%)",
          }}
        />
        <div className="rk-container relative z-10 py-14 sm:py-16 lg:py-20">
          <p className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.18em] text-[#D4A62A] uppercase">
            <Sparkles className="size-3.5" />
            {t("hero.eyebrow")}
          </p>
          <h1 className="rk-display mt-4 max-w-3xl text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-[2.75rem] lg:leading-[1.1]">
            {t("hero.title")}
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-[#AEB7C5] sm:text-lg">
            {t("hero.subtitle")}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <a
              href={RSC_CREDIT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="rk-btn-gold inline-flex h-12 items-center justify-center gap-2 px-7 text-sm"
            >
              {t("hero.cta")}
              <ArrowRight className="size-4" />
            </a>
            <p className="text-sm text-[#8C97A8]">{t("hero.ctaHint")}</p>
          </div>
        </div>
      </section>

      <section className="rk-container py-14 sm:py-16">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="rk-display text-2xl font-bold tracking-tight text-[#121826] sm:text-3xl">
            {t("about.title")}
          </h2>
          <p className="mt-3 text-base leading-relaxed text-[#6B7285]">
            {t("about.body")}
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {guarantees.map((key) => (
            <div
              key={key}
              className="rounded-[20px] bg-white px-5 py-6 shadow-[0_6px_24px_rgba(15,20,30,.05)] ring-1 ring-black/[0.04]"
            >
              <CheckCircle2 className="size-5 text-[#D4A62A]" strokeWidth={1.75} />
              <h3 className="rk-display mt-3 text-lg font-semibold text-[#121826]">
                {t(`about.guarantees.${key}.title`)}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[#6B7285]">
                {t(`about.guarantees.${key}.body`)}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-[#E8E2D4] bg-white py-14 sm:py-16">
        <div className="rk-container">
          <div className="mx-auto mb-10 max-w-2xl text-center">
            <h2 className="rk-display text-2xl font-bold tracking-tight text-[#121826] sm:text-3xl">
              {t("services.title")}
            </h2>
            <p className="mt-3 text-base text-[#6B7285]">{t("services.subtitle")}</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {services.map(({ key, icon: Icon }) => (
              <div
                key={key}
                className="rounded-[18px] bg-[#F7F5F0] px-5 py-6 ring-1 ring-black/[0.03]"
              >
                <span className="flex size-11 items-center justify-center rounded-2xl bg-[#0B1220] text-[#D4A62A]">
                  <Icon className="size-5" strokeWidth={1.7} />
                </span>
                <h3 className="mt-4 text-base font-semibold text-[#121826]">
                  {t(`services.items.${key}.title`)}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[#6B7285]">
                  {t(`services.items.${key}.body`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="rk-container py-14 sm:py-16">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <h2 className="rk-display text-2xl font-bold tracking-tight text-[#121826] sm:text-3xl">
            {t("steps.title")}
          </h2>
          <p className="mt-3 text-base text-[#6B7285]">{t("steps.subtitle")}</p>
        </div>
        <div className="mx-auto grid max-w-4xl gap-4 md:grid-cols-3">
          {steps.map((key, index) => (
            <div
              key={key}
              className="rounded-[20px] bg-white px-5 py-6 shadow-[0_6px_24px_rgba(15,20,30,.05)] ring-1 ring-black/[0.04]"
            >
              <p className="rk-display text-sm font-bold tracking-[0.16em] text-[#D4A62A]">
                0{index + 1}
              </p>
              <h3 className="mt-3 text-lg font-semibold text-[#121826]">
                {t(`steps.items.${key}.title`)}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[#6B7285]">
                {t(`steps.items.${key}.body`)}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="rk-container pb-16 sm:pb-20">
        <div className="relative overflow-hidden rounded-[28px] bg-[#0B1220] px-6 py-12 sm:px-10 lg:px-14">
          <div
            className="pointer-events-none absolute inset-0 opacity-40"
            style={{
              background:
                "radial-gradient(circle at 90% 20%, rgba(212,166,42,.25), transparent 40%)",
            }}
          />
          <div className="relative z-10 mx-auto max-w-2xl text-center">
            <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-[#D4A62A]/15 text-[#D4A62A]">
              <ShieldCheck className="size-6" strokeWidth={1.7} />
            </div>
            <h2 className="rk-display mt-5 text-2xl font-bold text-white sm:text-3xl">
              {t("cta.title")}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-[#AEB7C5] sm:text-base">
              {t("cta.body")}
            </p>
            <a
              href={RSC_CREDIT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="rk-btn-gold mt-8 inline-flex h-12 items-center justify-center gap-2 px-8 text-sm"
            >
              {t("cta.button")}
              <ArrowRight className="size-4" />
            </a>
            <p className="mt-4 inline-flex items-center justify-center gap-2 text-xs text-[#8C97A8]">
              <Handshake className="size-3.5" />
              {t("cta.disclaimer")}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
