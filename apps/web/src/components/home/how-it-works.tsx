"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import {
  Handshake,
  MapPinned,
  MessageSquare,
  Search,
  Store,
  Users,
} from "lucide-react";

const steps = [
  { key: "search", icon: Search },
  { key: "contact", icon: MessageSquare },
  { key: "visit", icon: MapPinned },
  { key: "negotiate", icon: Handshake },
  { key: "close", icon: Users },
  { key: "publish", icon: Store },
] as const;

export function HowItWorks() {
  const t = useTranslations("landing.howItWorks");

  return (
    <section className="pt-[80px]">
      <div className="rk-container">
        <div className="mb-4 flex flex-col items-center gap-3 text-center">
          <div className="flex items-center gap-3">
            <span className="h-8 w-1 rounded-full bg-[#D6A62E]" />
            <h2 className="rk-section-title text-3xl lg:text-4xl">{t("title")}</h2>
          </div>
          <p className="max-w-2xl text-sm leading-relaxed text-[#8C97A8] sm:text-base">
            {t("subtitle")}
          </p>
        </div>

        <div className="relative mt-10 grid gap-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.key}
                className="relative flex flex-col items-center text-center"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.07 }}
              >
                {index < steps.length - 1 && (
                  <div
                    className="pointer-events-none absolute left-[calc(50%+30px)] top-7 hidden h-px w-[calc(100%-30px)] border-t border-dashed border-[#D6A62E]/35 xl:block"
                    aria-hidden
                  />
                )}
                <div className="relative z-10 flex size-14 items-center justify-center rounded-full border border-[#D6A62E]/45 bg-[#111827] text-[#D6A62E]">
                  <Icon className="size-5" strokeWidth={1.75} />
                </div>
                <p className="mt-3 text-xs font-semibold text-[#D6A62E]">{index + 1}</p>
                <h3 className="mt-1 text-base font-semibold text-white">
                  {t(`steps.${step.key}.title`)}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-[#8C97A8]">
                  {t(`steps.${step.key}.description`)}
                </p>
              </motion.div>
            );
          })}
        </div>

        <p className="mx-auto mt-10 max-w-3xl rounded-[16px] border border-[rgba(255,255,255,.08)] bg-[#0E1422] px-5 py-4 text-center text-sm leading-relaxed text-[#C8D0DD]">
          {t("disclaimer")}
        </p>
      </div>
    </section>
  );
}
