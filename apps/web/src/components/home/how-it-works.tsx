"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import {
  ChevronRight,
  DollarSign,
  FileText,
  Key,
  Search,
  ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";

const steps = [
  {
    key: "find",
    icon: Search,
    color: "border-[#3b82f6]/60 text-[#60a5fa] bg-[#3b82f6]/10",
    numColor: "text-[#60a5fa]",
  },
  {
    key: "choose",
    icon: FileText,
    color: "border-[#22c55e]/60 text-[#4ade80] bg-[#22c55e]/10",
    numColor: "text-[#4ade80]",
  },
  {
    key: "simulate",
    icon: DollarSign,
    color: "border-[#a855f7]/60 text-[#c084fc] bg-[#a855f7]/10",
    numColor: "text-[#c084fc]",
  },
  {
    key: "approve",
    icon: ShieldCheck,
    color: "border-[#d4a017]/60 text-[#fbbf24] bg-[#d4a017]/10",
    numColor: "text-[#fbbf24]",
  },
  {
    key: "achieve",
    icon: Key,
    color: "border-[#38bdf8]/60 text-[#38bdf8] bg-[#38bdf8]/10",
    numColor: "text-[#38bdf8]",
  },
] as const;

export function HowItWorks() {
  const t = useTranslations("landing.howItWorks");

  return (
    <section className="px-6 py-8 lg:px-8 lg:py-10">
      <div className="mx-auto max-w-[1440px]">
        <h2 className="text-center text-3xl font-bold text-white sm:text-[2rem]">
          {t("title")}
        </h2>

        <div className="mt-7 grid gap-4 lg:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr_auto_1fr]">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={step.key} className="contents">
                <motion.div
                  className="flex items-start gap-3 rounded-xl border border-white/8 bg-[#081128]/45 p-3"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <div
                    className={cn(
                      "flex size-[52px] shrink-0 items-center justify-center rounded-xl border-2",
                      step.color,
                    )}
                  >
                    <Icon className="size-5" strokeWidth={1.5} />
                  </div>
                  <div className="min-w-0 pt-0.5">
                    <h3 className="text-base font-semibold text-white">
                      <span className={cn("mr-1.5", step.numColor)}>
                        {index + 1}
                      </span>
                      {t(`steps.${step.key}.title`)}
                    </h3>
                    <p className="mt-1.5 text-xs leading-relaxed text-white/65">
                      {t(`steps.${step.key}.description`)}
                    </p>
                  </div>
                </motion.div>

                {index < steps.length - 1 && (
                  <div
                    className="hidden items-center justify-center lg:flex"
                    aria-hidden
                  >
                    <div className="flex items-center gap-0 text-white/30">
                      <ChevronRight className="size-3.5" />
                      <ChevronRight className="-ml-2 size-3.5" />
                      <ChevronRight className="-ml-2 size-3.5" />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
