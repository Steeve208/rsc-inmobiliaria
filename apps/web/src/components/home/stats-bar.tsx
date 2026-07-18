"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import {
  ArrowLeftRight,
  Building2,
  Globe2,
  LayoutGrid,
  Megaphone,
  ShieldOff,
} from "lucide-react";
import { cn } from "@/lib/utils";

const stats = [
  { key: "marketplace", icon: LayoutGrid, valueKey: "marketplace" },
  { key: "direct", icon: ArrowLeftRight, valueKey: "direct" },
  { key: "noPaper", icon: ShieldOff, valueKey: "noPaper" },
  { key: "publish", icon: Megaphone, valueKey: "publish" },
  { key: "companies", icon: Building2, valueKey: "companies" },
  { key: "markets", icon: Globe2, valueKey: "markets" },
] as const;

export function StatsBar() {
  const t = useTranslations("landing.stats");

  return (
    <section className="pt-[50px]">
      <div className="rk-container">
        <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 xl:grid-cols-6 xl:gap-0">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.key}
                className={cn(
                  "flex min-w-0 items-start gap-3 rounded-[16px] border border-[rgba(255,255,255,.06)] bg-[#0E1422]/60 px-4 py-4 xl:rounded-none xl:border-0 xl:border-l xl:border-[rgba(255,255,255,.05)] xl:bg-transparent xl:px-5 xl:py-2",
                  index === 0 && "xl:border-l-0 xl:pl-0",
                )}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <div className="flex size-11 shrink-0 items-center justify-center rounded-[14px] bg-[#D6A62E]/12 text-[#D6A62E]">
                  <Icon className="size-5" strokeWidth={1.75} />
                </div>
                <div className="min-w-0">
                  <p className="rk-display text-[1.35rem] font-bold leading-tight text-white sm:text-[1.5rem]">
                    {t(`${stat.valueKey}.value`)}
                  </p>
                  <p className="mt-1.5 text-sm leading-snug text-[#8C97A8]">
                    {t(`${stat.valueKey}.label`)}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
        <p className="mt-6 text-center text-sm text-[#8C97A8]">
          {t("disclaimer")}
        </p>
      </div>
    </section>
  );
}
