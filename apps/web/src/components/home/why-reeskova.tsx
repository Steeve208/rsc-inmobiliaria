"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";

const reasons = ["one", "two", "three"] as const;

export function WhyReeskova() {
  const t = useTranslations("landing.whyReeskova");

  return (
    <section className="bg-[#F7F5F0] pt-16 sm:pt-20">
      <div className="rk-container">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <h2 className="rk-display text-3xl font-bold tracking-tight text-[#121826] lg:text-[2.35rem]">
            {t("title")}
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {reasons.map((key, index) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: index * 0.07 }}
              className="rounded-[20px] bg-white px-6 py-8 shadow-[0_6px_24px_rgba(15,20,30,.05)] ring-1 ring-black/[0.04] sm:px-7"
            >
              <p className="rk-display text-sm font-bold tracking-[0.16em] text-[#D4A62A]">
                {t(`items.${key}.number`)}
              </p>
              <h3 className="rk-display mt-3 text-xl font-semibold text-[#121826]">
                {t(`items.${key}.title`)}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-[#6B7285] sm:text-[15px]">
                {t(`items.${key}.description`)}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
