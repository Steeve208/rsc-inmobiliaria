"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  BookOpen,
  ChevronDown,
  HelpCircle,
  Mail,
  MessageCircle,
  Shield,
  FileText,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/routing";
import { marketplace } from "@/lib/layout/marketplace";
import { cn } from "@/lib/utils";

const faqCategories = [
  "account",
  "search",
  "listings",
  "business",
  "security",
] as const;

const quickLinks = [
  { key: "faq", href: "#faq", icon: HelpCircle },
  { key: "contact", href: "#contact", icon: MessageCircle },
  { key: "privacy", href: "#privacy", icon: Shield },
  { key: "terms", href: "#terms", icon: FileText },
] as const;

function FaqItem({
  question,
  answer,
  isOpen,
  onToggle,
}: {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="rounded-xl border border-white/8 bg-white/[0.02]">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
        aria-expanded={isOpen}
      >
        <span className="text-sm font-medium text-white sm:text-base">{question}</span>
        <ChevronDown
          className={cn(
            "size-4 shrink-0 text-white/40 transition-transform",
            isOpen && "rotate-180",
          )}
        />
      </button>
      {isOpen ? (
        <div className="border-t border-white/8 px-5 pb-4 pt-1">
          <p className="text-sm leading-relaxed text-white/55">{answer}</p>
        </div>
      ) : null}
    </div>
  );
}

export function HelpPage() {
  const t = useTranslations("helpPage");
  const [openFaq, setOpenFaq] = useState<string | null>("account-0");

  return (
    <div className="relative overflow-hidden">
      <section className="border-b border-white/8 bg-gradient-to-b from-[#0a1628]/80 to-[#000810]">
        <div className={cn(marketplace.container, "py-12 lg:py-16")}>
          <motion.div
            className="mx-auto max-w-3xl text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
          >
            <span className="inline-flex items-center gap-2 rounded-full bg-[#d4a017]/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[#fbbf24]">
              <BookOpen className="size-3.5" />
              {t("hero.badge")}
            </span>
            <h1 className="mt-6 text-3xl font-bold text-white sm:text-4xl">
              {t("hero.title")}
            </h1>
            <p className="mt-4 text-base leading-relaxed text-white/60 sm:text-lg">
              {t("hero.subtitle")}
            </p>
          </motion.div>

          <div className="mx-auto mt-10 grid max-w-3xl gap-3 sm:grid-cols-2">
            {quickLinks.map(({ key, href, icon: Icon }) => (
              <a
                key={key}
                href={href}
                className="flex items-center gap-3 rounded-xl border border-white/8 bg-white/[0.02] px-4 py-3.5 text-sm text-white/70 transition-colors hover:border-[#d4a017]/30 hover:bg-[#d4a017]/5 hover:text-white"
              >
                <Icon className="size-4 shrink-0 text-[#d4a017]" />
                {t(`quickLinks.${key}`)}
              </a>
            ))}
          </div>
        </div>
      </section>

      <section id="faq" className="market-section scroll-mt-24">
        <div className={marketplace.container}>
          <div className="mx-auto max-w-3xl">
            <h2 className={marketplace.titleLg}>{t("faq.title")}</h2>
            <p className={marketplace.subtitle}>{t("faq.subtitle")}</p>

            <div className="mt-8 space-y-10">
              {faqCategories.map((category) => (
                <div key={category}>
                  <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-[#d4a017]">
                    {t(`faq.categories.${category}.title`)}
                  </h3>
                  <div className="space-y-3">
                    {[0, 1, 2].map((i) => {
                      const id = `${category}-${i}`;
                      return (
                        <FaqItem
                          key={id}
                          question={t(`faq.categories.${category}.items.${i}.question`)}
                          answer={t(`faq.categories.${category}.items.${i}.answer`)}
                          isOpen={openFaq === id}
                          onToggle={() =>
                            setOpenFaq((prev) => (prev === id ? null : id))
                          }
                        />
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="contact" className="market-section scroll-mt-24 bg-[#000810]/60">
        <div className={marketplace.container}>
          <div className="mx-auto max-w-3xl rounded-2xl border border-white/8 bg-[#0a1628]/50 p-8 sm:p-10">
            <div className="flex size-11 items-center justify-center rounded-xl bg-[#1d4ed8]/15">
              <Mail className="size-5 text-[#60a5fa]" />
            </div>
            <h2 className="mt-5 text-2xl font-bold text-white">{t("contact.title")}</h2>
            <p className="mt-3 text-sm leading-relaxed text-white/55 sm:text-base">
              {t("contact.subtitle")}
            </p>
            <ul className="mt-6 space-y-3 text-sm text-white/65">
              <li>
                <span className="text-white/40">{t("contact.emailLabel")}: </span>
                <a
                  href="mailto:support@rscmarket.com"
                  className="text-[#60a5fa] transition-colors hover:text-[#93c5fd]"
                >
                  support@rscmarket.com
                </a>
              </li>
              <li>
                <span className="text-white/40">{t("contact.hoursLabel")}: </span>
                {t("contact.hours")}
              </li>
            </ul>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/entrar"
                className="inline-flex h-11 items-center justify-center rounded-lg bg-[#d4a017] px-5 text-sm font-semibold text-[#000a1a] transition-colors hover:bg-[#c39216]"
              >
                {t("contact.ctaAccount")}
              </Link>
              <Link
                href="/imoveis"
                className="inline-flex h-11 items-center justify-center rounded-lg bg-white/10 px-5 text-sm font-semibold text-white transition-colors hover:bg-white/15"
              >
                {t("contact.ctaBrowse")}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section id="privacy" className="market-section scroll-mt-24">
        <div className={marketplace.container}>
          <article className="mx-auto max-w-3xl">
            <h2 className={marketplace.titleLg}>{t("privacy.title")}</h2>
            <p className="mt-2 text-xs text-white/35">{t("privacy.updated")}</p>
            <div className="mt-6 space-y-4 text-sm leading-relaxed text-white/55">
              {[0, 1, 2, 3].map((i) => (
                <p key={i}>{t(`privacy.paragraphs.${i}`)}</p>
              ))}
            </div>
          </article>
        </div>
      </section>

      <section id="terms" className="market-section scroll-mt-24 bg-[#000810]/60 pb-12 lg:pb-16">
        <div className={marketplace.container}>
          <article className="mx-auto max-w-3xl">
            <h2 className={marketplace.titleLg}>{t("terms.title")}</h2>
            <p className="mt-2 text-xs text-white/35">{t("terms.updated")}</p>
            <div className="mt-6 space-y-4 text-sm leading-relaxed text-white/55">
              {[0, 1, 2, 3].map((i) => (
                <p key={i}>{t(`terms.paragraphs.${i}`)}</p>
              ))}
            </div>
          </article>
        </div>
      </section>
    </div>
  );
}
