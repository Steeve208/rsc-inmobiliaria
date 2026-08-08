"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";

const brands = [
  { key: "group", emphasis: true },
  { key: "reeskova", emphasis: true },
  { key: "bank", emphasis: false },
  { key: "capital", emphasis: false },
  { key: "ora", emphasis: false },
  { key: "chain", emphasis: false },
] as const;

export function RscGroupSection() {
  const t = useTranslations("landing.rscGroup");

  return (
    <section id="partners" className="bg-[#070B14] py-16 sm:py-20">
      <div className="rk-container">
        <motion.div
          className="mx-auto max-w-2xl text-center"
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
        >
          <p className="text-xs font-semibold tracking-[0.22em] text-[#D4A62A] uppercase">
            {t("eyebrow")}
          </p>
          <h2 className="rk-display mt-3 text-3xl font-bold text-white lg:text-[2.2rem]">
            {t("title")}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-[#AEB7C5] sm:text-base">
            {t("subtitle")}
          </p>
        </motion.div>

        <motion.div
          className="mx-auto mt-12 grid max-w-4xl gap-4 sm:grid-cols-2 lg:grid-cols-3"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.08 }}
        >
          {brands.map((brand) => (
            <div
              key={brand.key}
              className={
                brand.emphasis
                  ? "rounded-[18px] border border-[#D4A62A]/25 bg-[#101725] px-5 py-6 text-center"
                  : "rounded-[18px] border border-white/[0.06] bg-[#0E1422] px-5 py-6 text-center"
              }
            >
              <p
                className={
                  brand.emphasis
                    ? "rk-display text-lg font-bold tracking-[0.08em] text-white"
                    : "rk-display text-base font-semibold tracking-[0.06em] text-[#8C97A8]"
                }
              >
                {t(`brands.${brand.key}.name`)}
              </p>
              <p className="mt-1.5 text-xs tracking-[0.04em] text-[#AEB7C5]">
                {t(`brands.${brand.key}.role`)}
              </p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
