"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  Building2,
  Car,
  Check,
  Home,
  Shield,
  Layers,
  TrendingUp,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/routing";
import { marketplace } from "@/lib/layout/marketplace";
import { cn } from "@/lib/utils";

const accent = "#d4a017";

const services = [
  {
    key: "properties",
    icon: Home,
    href: "/imoveis",
    border: "border-[#3b82f6]/30",
    gradient: "from-[#3b82f6]/15 via-[#0f172a] to-[#020617]",
    iconBox: "bg-[#3b82f6]/20 text-[#60a5fa]",
    link: "text-[#60a5fa]",
  },
  {
    key: "vehicles",
    icon: Car,
    href: "/veiculos",
    border: "border-[#22c55e]/30",
    gradient: "from-[#22c55e]/15 via-[#0f172a] to-[#020617]",
    iconBox: "bg-[#22c55e]/20 text-[#4ade80]",
    link: "text-[#4ade80]",
  },
  {
    key: "financing",
    icon: TrendingUp,
    href: "/financing",
    border: "border-[#a855f7]/30",
    gradient: "from-[#a855f7]/15 via-[#0f172a] to-[#020617]",
    iconBox: "bg-[#a855f7]/20 text-[#c084fc]",
    link: "text-[#c084fc]",
  },
  {
    key: "insurance",
    icon: Shield,
    href: "/services#insurance",
    border: "border-[#d4a017]/30",
    gradient: "from-[#d4a017]/15 via-[#0f172a] to-[#020617]",
    iconBox: "bg-[#d4a017]/20 text-[#fbbf24]",
    link: "text-[#fbbf24]",
  },
  {
    key: "companies",
    icon: Building2,
    href: "/para-empresas",
    border: "border-[#1e40af]/30",
    gradient: "from-[#1e40af]/15 via-[#0f172a] to-[#020617]",
    iconBox: "bg-[#1e40af]/20 text-[#93c5fd]",
    link: "text-[#93c5fd]",
  },
] as const;

const benefits = ["verified", "digital", "support", "regional"] as const;

export function ServicesPage() {
  const t = useTranslations("servicesPage");
  const tl = useTranslations("landing.services");

  return (
    <div className="relative overflow-hidden">
      <section className="border-b border-white/8 bg-gradient-to-b from-[#0a1628]/80 to-[#000810]">
        <div className={cn(marketplace.container, "py-12 lg:py-16")}>
          <motion.div
            className="max-w-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
          >
            <span className="inline-flex items-center gap-2 rounded-full bg-[#d4a017]/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[#fbbf24]">
              <Layers className="size-3.5" />
              {t("hero.badge")}
            </span>
            <h1 className="mt-6 text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl">
              {t("hero.titleStart")}{" "}
              <span style={{ color: accent }}>{t("hero.titleHighlight")}</span>
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-white/70 sm:text-lg">
              {t("hero.subtitle")}
            </p>
          </motion.div>
        </div>
      </section>

      <section className="market-section">
        <div className={marketplace.container}>
          <div className="mb-8 text-center">
            <h2 className={marketplace.titleLg}>{t("catalog.title")}</h2>
            <p className={cn(marketplace.subtitle, "mx-auto max-w-2xl")}>
              {t("catalog.subtitle")}
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <motion.article
                  key={service.key}
                  className={cn(
                    "group flex min-h-[220px] flex-col rounded-2xl border bg-gradient-to-b p-6 transition-all hover:scale-[1.01]",
                    service.border,
                    service.gradient,
                  )}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, delay: index * 0.06 }}
                >
                  <div
                    className={cn(
                      "flex size-11 items-center justify-center rounded-xl",
                      service.iconBox,
                    )}
                  >
                    <Icon className="size-5" strokeWidth={1.5} />
                  </div>
                  <h3 className="mt-5 text-lg font-semibold text-white">
                    {tl(`${service.key}.title`)}
                  </h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-white/60">
                    {tl(`${service.key}.description`)}
                  </p>
                  <Link
                    href={service.href}
                    className={cn(
                      "mt-4 inline-flex items-center gap-1.5 text-sm font-medium transition-opacity group-hover:opacity-80",
                      service.link,
                    )}
                  >
                    {tl(`${service.key}.link`)}
                    <ArrowRight className="size-3.5" />
                  </Link>
                </motion.article>
              );
            })}
          </div>
        </div>
      </section>

      <section id="insurance" className="market-section scroll-mt-24 bg-[#000810]/60">
        <div className={marketplace.container}>
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
            <div>
              <div className="flex size-11 items-center justify-center rounded-xl bg-[#d4a017]/15">
                <Shield className="size-5 text-[#fbbf24]" />
              </div>
              <h2 className="mt-5 text-2xl font-bold text-white sm:text-3xl">
                {t("insurance.title")}
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-white/55 sm:text-base">
                {t("insurance.subtitle")}
              </p>
              <ul className="mt-6 space-y-3">
                {[0, 1, 2].map((i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-white/65">
                    <Check className="mt-0.5 size-4 shrink-0 text-[#d4a017]" />
                    {t(`insurance.bullets.${i}`)}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-[#d4a017]/20 bg-gradient-to-br from-[#d4a017]/8 via-[#0a1628]/50 to-[#020617]/50 p-8">
              <h3 className="text-lg font-semibold text-white">{t("insurance.plansTitle")}</h3>
              <div className="mt-6 space-y-4">
                {(["home", "vehicle", "life"] as const).map((plan) => (
                  <div
                    key={plan}
                    className="rounded-xl bg-white/[0.03] px-4 py-4"
                  >
                    <p className="font-medium text-white">{t(`insurance.plans.${plan}.name`)}</p>
                    <p className="mt-1 text-sm text-white/50">
                      {t(`insurance.plans.${plan}.description`)}
                    </p>
                  </div>
                ))}
              </div>
              <Link
                href="/help#contact"
                className="mt-6 inline-flex h-11 items-center justify-center rounded-lg bg-[#d4a017] px-5 text-sm font-semibold text-[#000a1a] transition-colors hover:bg-[#c39216]"
              >
                {t("insurance.cta")}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="market-section">
        <div className={marketplace.container}>
          <div className="rounded-2xl bg-gradient-to-br from-[#d4a017]/8 via-[#0a1628]/50 to-[#020617]/50 p-8 sm:p-10 lg:p-12">
            <h2 className="text-center text-2xl font-bold text-white sm:text-3xl">
              {t("benefits.title")}
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-center text-sm text-white/50 sm:text-base">
              {t("benefits.subtitle")}
            </p>
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {benefits.map((key, i) => (
                <motion.div
                  key={key}
                  className="rounded-xl bg-white/[0.02] p-5 text-center"
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06 }}
                >
                  <h3 className="font-semibold text-white">{t(`benefits.items.${key}.title`)}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/50">
                    {t(`benefits.items.${key}.description`)}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="pb-10 pt-2 lg:pb-14 lg:pt-4">
        <div className={marketplace.container}>
          <div className="rounded-2xl bg-gradient-to-br from-[#d4a017]/10 via-[#0a1628] to-[#020617] px-8 py-10 text-center sm:px-10 sm:py-12">
            <h2 className="text-2xl font-bold text-white sm:text-3xl">{t("cta.title")}</h2>
            <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-white/55 sm:text-base">
              {t("cta.subtitle")}
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-3">
              <Link
                href="/imoveis"
                className="inline-flex h-12 min-w-[180px] items-center justify-center rounded-lg bg-[#d4a017] px-6 text-sm font-semibold text-[#000a1a] transition-colors hover:bg-[#c39216]"
              >
                {t("cta.primary")}
              </Link>
              <Link
                href="/para-empresas"
                className="inline-flex h-12 min-w-[180px] items-center justify-center rounded-lg bg-white/10 px-6 text-sm font-semibold text-white transition-colors hover:bg-white/15"
              >
                {t("cta.secondary")}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
