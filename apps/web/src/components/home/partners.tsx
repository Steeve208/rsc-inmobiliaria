"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";

const partners = [
  "RSC Group",
  "RSC Bank",
  "RSC Capital",
  "Ora Technology",
  "Reesk Chain",
] as const;

export function Partners() {
  const t = useTranslations("landing.partners");

  return (
    <section className="py-[60px]">
      <div className="rk-container">
        <motion.p
          className="mb-10 text-center text-xs font-semibold uppercase tracking-[0.2em] text-[#8C97A8]"
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
        >
          {t("title")}
        </motion.p>

        <motion.div
          className="flex flex-wrap items-center justify-center gap-x-10 gap-y-6 sm:gap-x-14"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {partners.map((name) => (
            <span
              key={name}
              className="rk-display text-lg font-bold tracking-[0.06em] text-[#8C97A8]/45 transition-colors duration-300 hover:text-[#D4A62A] sm:text-xl"
            >
              {name}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
