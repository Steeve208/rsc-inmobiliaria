"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";

const steps = ["find", "finance", "protect", "transform"] as const;

export function EcosystemJourney() {
  const t = useTranslations("landing.ecosystemJourney");

  return (
    <section className="bg-[#F7F5F0] pt-16 sm:pt-20">
      <div className="rk-container">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <h2 className="rk-display text-3xl font-bold tracking-tight text-[#121826] lg:text-[2.35rem]">
            {t("title")}
          </h2>
        </div>

        <div className="mx-auto flex max-w-3xl flex-col gap-0">
          {steps.map((step, index) => (
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: index * 0.06 }}
              className="relative"
            >
              <div className="rounded-[20px] bg-white px-6 py-7 shadow-[0_6px_24px_rgba(15,20,30,.05)] ring-1 ring-black/[0.04] sm:px-8">
                <p className="text-xs font-bold tracking-[0.2em] text-[#D4A62A] uppercase">
                  {t(`steps.${step}.label`)}
                </p>
                <p className="mt-2 text-base leading-relaxed text-[#4B5565] sm:text-[17px]">
                  {t(`steps.${step}.description`)}
                </p>
              </div>
              {index < steps.length - 1 ? (
                <div className="flex justify-center py-3 text-[#D4A62A]" aria-hidden>
                  <ArrowDown className="size-5" strokeWidth={1.75} />
                </div>
              ) : null}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
