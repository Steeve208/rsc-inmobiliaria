"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";

const partners = [
  "RE/MAX",
  "CBRE",
  "Century 21",
  "KW",
  "Colliers",
  "JLL",
  "Savills",
  "Zillow",
] as const;

function PartnerLogo({ name }: { name: string }) {
  return (
    <span className="rk-partners-logo rk-display inline-flex shrink-0 items-center px-8 text-xl font-bold tracking-[0.04em] text-[#8C97A8]/40 transition-colors duration-300 hover:text-[#D6A62E] sm:px-12 sm:text-2xl">
      {name}
    </span>
  );
}

export function Partners() {
  const t = useTranslations("landing.partners");
  const loop = [...partners, ...partners];

  return (
    <section className="overflow-hidden py-[60px]">
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
      </div>

      <motion.div
        className="rk-partners-marquee relative"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-[#070B14] to-transparent sm:w-28" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-[#070B14] to-transparent sm:w-28" />

        <div className="rk-partners-track flex w-max items-center py-4">
          {loop.map((name, index) => (
            <PartnerLogo key={`${name}-${index}`} name={name} />
          ))}
        </div>
      </motion.div>
    </section>
  );
}
