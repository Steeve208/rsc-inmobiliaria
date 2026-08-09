"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "@/lib/i18n/routing";

export function NewsletterCta() {
  const t = useTranslations("landing.newsletter");

  return (
    <section className="pt-[70px]">
      <div className="rk-container">
        <motion.div
          className="relative overflow-hidden rounded-[28px] border border-white/[0.08] bg-[#0E1422]"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
        >
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(circle at 12% 30%, rgba(212,166,42,.18), transparent 42%), radial-gradient(circle at 88% 70%, rgba(255,255,255,.05), transparent 36%)",
            }}
          />
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.18]"
            style={{
              backgroundImage:
                "url(https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=1600&q=80)",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
          <div className="relative z-10 flex flex-col items-start justify-between gap-8 px-6 py-12 sm:px-10 lg:flex-row lg:items-center lg:py-14">
            <div className="max-w-xl">
              <h2 className="rk-display text-2xl font-bold tracking-tight text-white sm:text-3xl lg:text-[2.1rem] lg:leading-tight">
                {t("title")}
              </h2>
              <p className="mt-3 max-w-lg text-sm leading-relaxed text-[#AEB7C5] sm:text-base">
                {t("subtitle")}
              </p>
            </div>

            <Link
              href="/cadastrar"
              className="rk-btn-gold inline-flex h-12 shrink-0 items-center justify-center gap-2 px-7 text-sm"
            >
              {t("cta")}
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
