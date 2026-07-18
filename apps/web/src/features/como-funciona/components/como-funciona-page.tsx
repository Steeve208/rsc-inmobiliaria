"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import {
  Building2,
  FileText,
  Handshake,
  HelpCircle,
  MapPinned,
  MessageSquare,
  Search,
  Shield,
  Store,
  Users,
} from "lucide-react";
import { Link } from "@/lib/i18n/routing";

const steps = [
  { key: "search", icon: Search },
  { key: "contact", icon: MessageSquare },
  { key: "visit", icon: MapPinned },
  { key: "negotiate", icon: Handshake },
  { key: "close", icon: Users },
  { key: "publish", icon: Store },
] as const;

const sections = [
  { key: "whatIs", icon: Building2 },
  { key: "marketplace", icon: Search },
  { key: "whoPublishes", icon: Store },
  { key: "purchase", icon: Handshake },
  { key: "financing", icon: FileText },
  { key: "legal", icon: Shield },
] as const;

const faqs = ["0", "1", "2", "3", "4"] as const;

export function ComoFuncionaPage() {
  const t = useTranslations("comoFunciona");

  return (
    <div className="pb-20">
      <section className="border-b border-white/[0.06] bg-gradient-to-b from-[#0E1422] to-[#070B14]">
        <div className="rk-container py-14 lg:py-20">
          <motion.div
            className="mx-auto max-w-3xl text-center"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
          >
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#D4A62A]">
              {t("hero.badge")}
            </p>
            <h1 className="rk-display mt-4 text-3xl font-bold text-white sm:text-5xl">
              {t("hero.title")}
            </h1>
            <p className="mt-4 text-base leading-relaxed text-[#AEB7C5] sm:text-lg">
              {t("hero.subtitle")}
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/imoveis"
                className="rk-btn-gold inline-flex h-12 items-center justify-center px-6 text-sm"
              >
                {t("hero.ctaExplore")}
              </Link>
              <Link
                href="/help"
                className="rk-btn-ghost inline-flex h-12 items-center justify-center px-6 text-sm"
              >
                {t("hero.ctaHelp")}
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="pt-16">
        <div className="rk-container">
          <div className="grid gap-6 lg:grid-cols-2">
            {sections.map((section, index) => {
              const Icon = section.icon;
              return (
                <motion.article
                  key={section.key}
                  className="rounded-[20px] border border-white/[0.08] bg-[#0E1422] p-6 sm:p-8"
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, delay: index * 0.04 }}
                >
                  <span className="inline-flex size-11 items-center justify-center rounded-xl bg-[#D4A62A]/12 text-[#D4A62A]">
                    <Icon className="size-5" strokeWidth={1.75} />
                  </span>
                  <h2 className="mt-4 text-xl font-semibold text-white">
                    {t(`sections.${section.key}.title`)}
                  </h2>
                  <p className="mt-3 text-sm leading-relaxed text-[#AEB7C5]">
                    {t(`sections.${section.key}.body`)}
                  </p>
                </motion.article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="pt-16">
        <div className="rk-container">
          <div className="mb-8 text-center">
            <h2 className="rk-section-title text-3xl">{t("flow.title")}</h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm text-[#8C97A8] sm:text-base">
              {t("flow.subtitle")}
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.key}
                  className="flex flex-col items-center text-center"
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <div className="flex size-14 items-center justify-center rounded-full border border-[#D4A62A]/45 bg-[#111827] text-[#D4A62A]">
                    <Icon className="size-5" strokeWidth={1.75} />
                  </div>
                  <p className="mt-3 text-xs font-semibold text-[#D4A62A]">
                    {index + 1}
                  </p>
                  <h3 className="mt-1 text-base font-semibold text-white">
                    {t(`flow.steps.${step.key}.title`)}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-[#8C97A8]">
                    {t(`flow.steps.${step.key}.description`)}
                  </p>
                </motion.div>
              );
            })}
          </div>

          <p className="mx-auto mt-10 max-w-3xl rounded-[16px] border border-white/[0.08] bg-[#0E1422] px-5 py-4 text-center text-sm leading-relaxed text-[#C8D0DD]">
            {t("flow.disclaimer")}
          </p>
        </div>
      </section>

      <section className="pt-16">
        <div className="rk-container">
          <div className="mb-8 flex items-center gap-3">
            <HelpCircle className="size-6 text-[#D4A62A]" />
            <h2 className="rk-section-title text-3xl">{t("faq.title")}</h2>
          </div>
          <div className="space-y-3">
            {faqs.map((key) => (
              <details
                key={key}
                className="group rounded-[16px] border border-white/[0.08] bg-[#0E1422] px-5 py-4"
              >
                <summary className="cursor-pointer list-none text-sm font-medium text-white marker:content-none [&::-webkit-details-marker]:hidden">
                  {t(`faq.items.${key}.q`)}
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-[#AEB7C5]">
                  {t(`faq.items.${key}.a`)}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
