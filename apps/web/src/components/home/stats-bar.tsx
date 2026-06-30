"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Car, Headphones, Home, UserCircle, Users } from "lucide-react";
import { cn } from "@/lib/utils";

const stats = [
  {
    key: "agencies",
    icon: Users,
    iconClass: "bg-[#3b82f6]/15 text-[#60a5fa]",
  },
  {
    key: "dealerships",
    icon: UserCircle,
    iconClass: "bg-[#22c55e]/15 text-[#4ade80]",
  },
  {
    key: "users",
    icon: Headphones,
    iconClass: "bg-[#a855f7]/15 text-[#c084fc]",
  },
  {
    key: "properties",
    icon: Home,
    iconClass: "bg-[#d4a017]/15 text-[#fbbf24]",
  },
  {
    key: "vehicles",
    icon: Car,
    iconClass: "bg-[#3b82f6]/15 text-[#60a5fa]",
  },
] as const;

export function StatsBar() {
  const t = useTranslations("landing.stats");

  return (
    <section className="px-6 pb-8 pt-3 lg:px-8 lg:pb-10">
      <motion.div
        className="mx-auto max-w-[1440px] rounded-xl border border-white/10 bg-[#081128]/80 px-4 py-4 backdrop-blur-sm sm:px-6 sm:py-5"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.45 }}
      >
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5 lg:gap-0">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.key}
                className={cn(
                  "flex items-center gap-3 py-2 lg:px-4",
                  index !== 0 && "lg:border-l lg:border-white/10",
                )}
              >
                <div
                  className={cn(
                    "flex size-9 shrink-0 items-center justify-center rounded-lg",
                    stat.iconClass,
                  )}
                >
                  <Icon className="size-4.5" strokeWidth={1.5} />
                </div>
                <div className="min-w-0">
                  <p className="text-[1.6rem] font-semibold leading-[1] text-white">
                    {t(`${stat.key}.value`)}
                  </p>
                  <p className="mt-1 text-xs leading-snug text-white/55">
                    {t(`${stat.key}.label`)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
}
