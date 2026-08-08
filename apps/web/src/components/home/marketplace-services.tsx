"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import {
  Armchair,
  ArrowRight,
  CreditCard,
  Package,
  Shield,
  Sun,
  Wifi,
} from "lucide-react";
import { Link } from "@/lib/i18n/routing";

const services = [
  { key: "financing", icon: CreditCard, href: "/financing" },
  { key: "insurance", icon: Shield, href: "/services#insurance" },
  { key: "moving", icon: Package, href: "/services" },
  { key: "decor", icon: Armchair, href: "/services" },
  { key: "solar", icon: Sun, href: "/services" },
  { key: "internet", icon: Wifi, href: "/services" },
] as const;

export function MarketplaceServices() {
  const t = useTranslations("landing.marketplaceServices");

  return (
    <section className="bg-[#F7F5F0] pt-16 sm:pt-20">
      <div className="rk-container">
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-xl">
            <h2 className="rk-display text-3xl font-bold tracking-tight text-[#121826] lg:text-[2.1rem]">
              {t("title")}
            </h2>
            <p className="mt-2 text-sm text-[#6B7285] sm:text-[15px]">{t("subtitle")}</p>
          </div>
          <Link
            href="/services"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#0B1220] transition-colors duration-300 hover:text-[#D4A62A]"
          >
            {t("viewAll")}
            <ArrowRight className="size-4" />
          </Link>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={service.key}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.04 }}
              >
                <Link
                  href={service.href}
                  className="group flex h-full flex-col rounded-[18px] bg-white px-4 py-5 shadow-[0_4px_20px_rgba(15,20,30,.04)] ring-1 ring-black/[0.04] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_14px_34px_rgba(15,20,30,.08)] hover:ring-[#D4A62A]/30"
                >
                  <span className="mb-3 flex size-10 items-center justify-center rounded-xl bg-[#0B1220] text-[#D4A62A]">
                    <Icon className="size-4" strokeWidth={1.7} />
                  </span>
                  <h3 className="text-sm font-semibold text-[#121826]">
                    {t(`items.${service.key}.title`)}
                  </h3>
                  <p className="mt-1 text-xs leading-relaxed text-[#6B7285]">
                    {t(`items.${service.key}.description`)}
                  </p>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
