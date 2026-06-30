"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BarChart3,
  Building2,
  Car,
  Check,
  ClipboardCheck,
  Home,
  LayoutGrid,
  Mail,
  MessageSquare,
  Send,
  Shield,
  Sparkles,
  Users,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/routing";
import { marketplace } from "@/lib/layout/marketplace";
import { cn } from "@/lib/utils";

const accent = "#d4a017";

const audiences = [
  { key: "realEstate", icon: Home, color: "text-[#60a5fa]", bg: "bg-[#1d4ed8]/15" },
  { key: "dealerships", icon: Car, color: "text-[#4ade80]", bg: "bg-[#22c55e]/15" },
  { key: "builders", icon: Building2, color: "text-[#c084fc]", bg: "bg-[#a855f7]/15" },
] as const;

const features = [
  { key: "listings", icon: LayoutGrid },
  { key: "leads", icon: Users },
  { key: "chat", icon: MessageSquare },
  { key: "analytics", icon: BarChart3 },
  { key: "trust", icon: Shield },
  { key: "ai", icon: Sparkles },
] as const;

const howItWorks = [
  { key: "submit", icon: Send, color: "text-[#60a5fa]", bg: "bg-[#1d4ed8]/15" },
  { key: "review", icon: ClipboardCheck, color: "text-[#fbbf24]", bg: "bg-[#d4a017]/15" },
  { key: "access", icon: Mail, color: "text-[#4ade80]", bg: "bg-[#22c55e]/15" },
] as const;

const plans = ["starter", "growth", "enterprise"] as const;

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1920&q=85";

function SectionHeader({
  title,
  subtitle,
  centered = false,
}: {
  title: string;
  subtitle?: string;
  centered?: boolean;
}) {
  return (
    <div className={cn(centered && "text-center", marketplace.headerGap)}>
      <h2 className={marketplace.titleLg}>{title}</h2>
      {subtitle && (
        <p
          className={cn(
            marketplace.subtitle,
            centered && "mx-auto max-w-2xl",
            !centered && "max-w-2xl",
          )}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}

export function ParaEmpresasPage() {
  const t = useTranslations("paraEmpresas");

  return (
    <div className="relative overflow-hidden">
      <section className="relative flex min-h-[520px] items-center overflow-hidden sm:min-h-[560px] lg:min-h-[640px]">
        <Image
          src={HERO_IMAGE}
          alt={t("hero.imageAlt")}
          fill
          priority
          className="object-cover object-[center_40%] brightness-[0.9] saturate-[1.05]"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#000a1a]/95 via-[#000a1a]/70 to-[#000a1a]/25" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#000810]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_20%_40%,rgba(212,160,23,0.14),transparent)]" />

        <div className={cn("relative", marketplace.container, "py-12 lg:py-16")}>
          <motion.div
            className="max-w-2xl"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center gap-2 rounded-full bg-[#d4a017]/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[#fbbf24]">
              <Building2 className="size-3.5" />
              {t("hero.badge")}
            </span>
            <h1 className="mt-6 text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl lg:leading-[1.1]">
              {t("hero.titleStart")}{" "}
              <span style={{ color: accent }}>{t("hero.titleHighlight")}</span>
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-white/75 sm:text-lg">
              {t("hero.subtitle")}
            </p>

            <div className="mt-10">
              <Link
                href="/empresa/cadastro"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-[#d4a017] px-6 text-sm font-semibold text-[#000a1a] transition-colors hover:bg-[#c39216]"
              >
                {t("hero.ctaPrimary")}
                <ArrowRight className="size-4" />
              </Link>
            </div>

            <ul className="mt-10 flex flex-wrap gap-x-8 gap-y-3">
              {[0, 1, 2].map((i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-white/65">
                  <Check className="size-4 shrink-0 text-[#d4a017]" />
                  {t(`hero.bullets.${i}`)}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </section>

      <section className="market-section bg-[#000810]/60">
        <div className={marketplace.container}>
          <SectionHeader
            centered
            title={t("audiences.title")}
            subtitle={t("audiences.subtitle")}
          />
          <div className="grid gap-5 sm:grid-cols-3 lg:gap-6">
            {audiences.map(({ key, icon: Icon, color, bg }, i) => (
              <motion.article
                key={key}
                className="rounded-2xl bg-[#0a1628]/50 p-6 lg:p-7"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <div className={cn("flex size-11 items-center justify-center rounded-xl", bg)}>
                  <Icon className={cn("size-5", color)} />
                </div>
                <h3 className="mt-5 text-lg font-semibold text-white">{t(`audiences.${key}.title`)}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/55">
                  {t(`audiences.${key}.description`)}
                </p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="market-section">
        <div className={marketplace.container}>
          <SectionHeader title={t("features.title")} subtitle={t("features.subtitle")} />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
            {features.map(({ key, icon: Icon }, i) => (
              <motion.div
                key={key}
                className="group rounded-xl bg-white/[0.02] p-6 transition-colors hover:bg-[#d4a017]/5"
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <Icon className="size-5 text-[#d4a017]" strokeWidth={1.5} />
                <h3 className="mt-4 font-semibold text-white">{t(`features.${key}.title`)}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/50">
                  {t(`features.${key}.description`)}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="market-section">
        <div className={marketplace.container}>
          <div className="rounded-2xl bg-gradient-to-br from-[#d4a017]/8 via-[#0a1628]/50 to-[#020617]/50 p-8 sm:p-10 lg:p-12">
            <SectionHeader
              centered
              title={t("howItWorks.title")}
              subtitle={t("howItWorks.subtitle")}
            />
            <div className="grid gap-8 sm:grid-cols-3 lg:gap-10">
              {howItWorks.map(({ key, icon: Icon, color, bg }, i) => (
                <motion.div
                  key={key}
                  className="flex flex-col items-center text-center"
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <div className={cn("flex size-14 items-center justify-center rounded-2xl", bg)}>
                    <Icon className={cn("size-6", color)} />
                  </div>
                  <div className="mt-5 flex items-center gap-2">
                    <span className="flex size-6 items-center justify-center rounded-full bg-[#d4a017]/20 text-xs font-bold text-[#d4a017]">
                      {i + 1}
                    </span>
                    <h3 className="text-lg font-semibold text-white">{t(`howItWorks.${key}.title`)}</h3>
                  </div>
                  <p className="mt-3 max-w-xs text-sm leading-relaxed text-white/55">
                    {t(`howItWorks.${key}.description`)}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="market-section bg-[#000810]/60">
        <div className={marketplace.container}>
          <SectionHeader centered title={t("plans.title")} subtitle={t("plans.subtitle")} />
          <div className="grid gap-5 lg:grid-cols-3 lg:gap-6">
            {plans.map((plan) => (
              <article
                key={plan}
                className={cn(
                  "relative flex flex-col rounded-2xl p-6 lg:p-7",
                  plan === "growth" ? "bg-[#d4a017]/5" : "bg-[#0a1628]/40",
                )}
              >
                {plan === "growth" && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[#d4a017] px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#000a1a]">
                    {t("plans.popular")}
                  </span>
                )}
                <h3 className="text-lg font-semibold text-white">{t(`plans.${plan}.name`)}</h3>
                <p className="mt-2 text-sm text-white/45">{t(`plans.${plan}.description`)}</p>
                <p className="mt-6 text-3xl font-bold text-white">
                  {t(`plans.${plan}.price`)}
                  <span className="text-sm font-normal text-white/40">
                    {t("plans.perMonth")}
                  </span>
                </p>
                <ul className="mt-6 flex-1 space-y-3">
                  {[0, 1, 2].map((j) => (
                    <li key={j} className="flex items-start gap-2 text-sm text-white/60">
                      <Check className="mt-0.5 size-4 shrink-0 text-[#d4a017]" />
                      {t(`plans.${plan}.features.${j}`)}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/empresa/cadastro"
                  className={cn(
                    "mt-8 inline-flex h-11 items-center justify-center rounded-lg text-sm font-semibold transition-colors",
                    plan === "growth"
                      ? "bg-[#d4a017] text-[#000a1a] hover:bg-[#c39216]"
                      : "bg-white/10 text-white hover:bg-white/15",
                  )}
                >
                  {t(`plans.${plan}.cta`)}
                </Link>
              </article>
            ))}
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
            <div className="mt-10 flex justify-center">
              <Link
                href="/empresa/cadastro"
                className="inline-flex h-12 min-w-[220px] items-center justify-center rounded-lg bg-[#d4a017] px-6 text-sm font-semibold text-[#000a1a] transition-colors hover:bg-[#c39216]"
              >
                {t("cta.primary")}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
