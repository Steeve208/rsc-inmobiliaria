"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Building2,
  Car,
  Home,
  Shield,
  TrendingUp,
} from "lucide-react";
import { Link } from "@/lib/i18n/routing";
import { cn } from "@/lib/utils";

const cards = [
  {
    key: "properties",
    icon: Home,
    href: "/imoveis",
    border: "border-[#3b82f6]/30",
    gradient: "from-[#3b82f6]/15 via-[#0f172a] to-[#020617]",
    iconBox: "bg-[#3b82f6]/20 text-[#60a5fa]",
    link: "text-[#60a5fa]",
  },
  {
    key: "vehicles",
    icon: Car,
    href: "/veiculos",
    border: "border-[#22c55e]/30",
    gradient: "from-[#22c55e]/15 via-[#0f172a] to-[#020617]",
    iconBox: "bg-[#22c55e]/20 text-[#4ade80]",
    link: "text-[#4ade80]",
  },
  {
    key: "financing",
    icon: TrendingUp,
    href: "/financing",
    border: "border-[#a855f7]/30",
    gradient: "from-[#a855f7]/15 via-[#0f172a] to-[#020617]",
    iconBox: "bg-[#a855f7]/20 text-[#c084fc]",
    link: "text-[#c084fc]",
  },
  {
    key: "insurance",
    icon: Shield,
    href: "/services",
    border: "border-[#d4a017]/30",
    gradient: "from-[#d4a017]/15 via-[#0f172a] to-[#020617]",
    iconBox: "bg-[#d4a017]/20 text-[#fbbf24]",
    link: "text-[#fbbf24]",
  },
  {
    key: "companies",
    icon: Building2,
    href: "/para-empresas",
    border: "border-[#1e40af]/30",
    gradient: "from-[#1e40af]/15 via-[#0f172a] to-[#020617]",
    iconBox: "bg-[#1e40af]/20 text-[#93c5fd]",
    link: "text-[#93c5fd]",
  },
] as const;

export function ServiceCards() {
  const t = useTranslations("landing.services");

  return (
    <section className="px-6 py-8 lg:px-8 lg:py-9">
      <div className="mx-auto grid max-w-[1440px] gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {cards.map((card, index) => {
          const Icon = card.icon;
          return (
            <motion.article
              key={card.key}
              className={cn(
                "group flex min-h-[132px] flex-col rounded-xl border bg-gradient-to-b px-4 py-3.5 transition-all hover:scale-[1.01]",
                card.border,
                card.gradient,
              )}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
            >
              <div
                className={cn(
                  "mb-2.5 flex size-10 items-center justify-center rounded-lg",
                  card.iconBox,
                )}
              >
                <Icon className="size-4.5" strokeWidth={1.5} />
              </div>
              <h3 className="text-[1rem] font-semibold text-white">
                {t(`${card.key}.title`)}
              </h3>
              <p className="mt-1.5 flex-1 text-xs leading-relaxed text-white/65">
                {t(`${card.key}.description`)}
              </p>
              <Link
                href={card.href}
                className={cn(
                  "mt-1 inline-flex items-center gap-1.5 text-xs font-medium transition-opacity group-hover:opacity-80",
                  card.link,
                )}
              >
                {t(`${card.key}.link`)}
                <ArrowRight className="size-3.5" />
              </Link>
            </motion.article>
          );
        })}
      </div>
    </section>
  );
}
