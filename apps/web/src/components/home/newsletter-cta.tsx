"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Link } from "@/lib/i18n/routing";

/** Marketing CTA only — no fake subscribe success until a real backend exists. */
export function NewsletterCta() {
  const t = useTranslations("landing.newsletter");

  return (
    <section className="pt-[70px]">
      <div className="rk-container">
        <motion.div
          className="relative overflow-hidden rounded-[24px] border border-white/[0.08] bg-[#0E1422]"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
        >
          <div
            className="absolute inset-0 opacity-40"
            style={{
              backgroundImage:
                "linear-gradient(120deg, rgba(7,11,20,.92), rgba(7,11,20,.55)), url(https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=1600&q=80)",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
          <div className="relative z-10 flex flex-col items-start justify-between gap-6 px-6 py-10 sm:px-10 lg:flex-row lg:items-center lg:py-12">
            <div className="max-w-xl">
              <h2 className="rk-section-title text-2xl sm:text-3xl">
                {t("title")}
              </h2>
              <p className="mt-2 text-sm text-[#AEB7C5] sm:text-base">
                {t("subtitle")}
              </p>
              <p className="mt-3 text-xs text-[#8C97A8] sm:text-sm">
                {t("unavailable")}
              </p>
            </div>

            <Link
              href="/help#contact"
              className="rk-btn-gold inline-flex h-12 shrink-0 items-center justify-center px-6 text-sm"
            >
              {t("contactCta")}
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
