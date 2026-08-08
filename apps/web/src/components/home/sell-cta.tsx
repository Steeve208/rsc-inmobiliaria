"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Link } from "@/lib/i18n/routing";

const channels = ["properties", "vehicles", "companies", "projects"] as const;

export function SellCta() {
  const t = useTranslations("landing.sellCta");

  return (
    <section className="bg-[#F7F5F0] py-16 sm:py-20">
      <div className="rk-container">
        <motion.div
          className="relative overflow-hidden rounded-[28px] bg-[#0B1220] px-6 py-12 sm:px-10 lg:px-14 lg:py-14"
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
        >
          <div
            className="pointer-events-none absolute inset-0 opacity-40"
            style={{
              background:
                "radial-gradient(circle at 85% 20%, rgba(212,166,42,.22), transparent 40%), radial-gradient(circle at 10% 80%, rgba(255,255,255,.06), transparent 35%)",
            }}
          />
          <div className="relative z-10 mx-auto max-w-2xl text-center">
            <h2 className="rk-display text-3xl font-bold tracking-tight text-white lg:text-[2.35rem]">
              {t("title")}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-[#AEB7C5] sm:text-base">
              {t("subtitle")}
            </p>
            <Link
              href="/para-empresas"
              className="rk-btn-gold mt-8 inline-flex h-12 items-center justify-center px-7 text-sm"
            >
              {t("cta")}
            </Link>
            <p className="mt-8 text-xs font-semibold tracking-[0.16em] text-[#8C97A8] uppercase">
              {channels.map((key, index) => (
                <span key={key}>
                  {index > 0 ? (
                    <span className="mx-2 text-white/20" aria-hidden>
                      |
                    </span>
                  ) : null}
                  {t(`channels.${key}`)}
                </span>
              ))}
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
