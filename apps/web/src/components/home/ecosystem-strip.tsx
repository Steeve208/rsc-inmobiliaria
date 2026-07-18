"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import {
  Armchair,
  Car,
  CreditCard,
  Home,
  Package,
  Shield,
  Sun,
} from "lucide-react";
import { Link } from "@/lib/i18n/routing";

const items = [
  { key: "properties", icon: Home, href: "/imoveis" },
  { key: "vehicles", icon: Car, href: "/veiculos" },
  { key: "financing", icon: CreditCard, href: "/financing" },
  { key: "insurance", icon: Shield, href: "/services#insurance" },
  { key: "solar", icon: Sun, href: "/services" },
  { key: "moving", icon: Package, href: "/services" },
  { key: "furniture", icon: Armchair, href: "/services" },
] as const;

export function EcosystemStrip() {
  const t = useTranslations("landing.ecosystem");

  return (
    <section className="border-b border-white/[0.04] pb-10 pt-4 lg:pb-14 lg:pt-6">
      <div className="rk-container">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="mb-6 max-w-xl lg:mb-8"
        >
          <h2 className="rk-display text-xl font-bold text-white sm:text-2xl">
            {t("title")}
          </h2>
          <p className="mt-2 text-sm text-[#AEB7C5] sm:text-base">{t("subtitle")}</p>
        </motion.div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 lg:gap-4">
          {items.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.key}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: index * 0.04 }}
              >
                <Link
                  href={item.href}
                  className="group flex h-full flex-col items-center gap-3 rounded-2xl border border-white/[0.08] bg-[#111827]/80 px-3 py-5 text-center transition-all duration-300 hover:-translate-y-1 hover:border-[#D4A62A]/50 hover:bg-[#161F31] hover:shadow-[0_18px_40px_rgba(0,0,0,.35)]"
                >
                  <span className="flex size-11 items-center justify-center rounded-xl bg-[#D4A62A]/10 text-[#D4A62A] transition-colors group-hover:bg-[#D4A62A]/18">
                    <Icon className="size-5" strokeWidth={1.75} />
                  </span>
                  <span className="text-[13px] font-medium leading-snug text-white">
                    {t(`items.${item.key}`)}
                  </span>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
