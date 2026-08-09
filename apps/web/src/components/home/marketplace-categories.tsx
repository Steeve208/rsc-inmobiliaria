"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import {
  Building2,
  Car,
  CreditCard,
  HardHat,
  Home,
  Shield,
} from "lucide-react";
import { Link } from "@/lib/i18n/routing";
import { useMarket } from "@/lib/providers/market-provider";

const categories = [
  { key: "properties", icon: Home, href: "/imoveis" },
  { key: "vehicles", icon: Car, href: "/veiculos" },
  { key: "companies", icon: Building2, href: "/para-empresas" },
  { key: "launches", icon: HardHat, href: "/imoveis?launch=1" },
  { key: "financing", icon: CreditCard, href: "/financing", brazilOnly: true },
  { key: "services", icon: Shield, href: "/services" },
] as const;

export function MarketplaceCategories() {
  const t = useTranslations("landing.categories");
  const { market } = useMarket();
  const visibleCategories = categories.filter(
    (category) =>
      !("brazilOnly" in category && category.brazilOnly) || market.creditAvailable,
  );

  return (
    <section id="categorias" className="scroll-mt-28 bg-[#F7F5F0] pt-14 sm:pt-16">
      <div className="rk-container">
        <div className="mb-8 max-w-xl">
          <h2 className="rk-display text-3xl font-bold tracking-tight text-[#121826] lg:text-[2.1rem]">
            {t("title")}
          </h2>
          <p className="mt-2 text-sm text-[#6B7285] sm:text-[15px]">{t("subtitle")}</p>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6 lg:gap-4">
          {visibleCategories.map((category, index) => {
            const Icon = category.icon;
            return (
              <motion.div
                key={category.key}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.04 }}
              >
                <Link
                  href={category.href}
                  className="group flex h-full flex-col items-center gap-3 rounded-[18px] bg-white px-3 py-6 text-center shadow-[0_4px_20px_rgba(15,20,30,.04)] ring-1 ring-black/[0.04] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_14px_34px_rgba(15,20,30,.08)] hover:ring-[#D4A62A]/35"
                >
                  <span className="flex size-12 items-center justify-center rounded-2xl bg-[#0B1220] text-[#D4A62A] transition-colors group-hover:bg-[#121A2B]">
                    <Icon className="size-5" strokeWidth={1.6} />
                  </span>
                  <span className="text-sm font-semibold text-[#121826]">
                    {t(`items.${category.key}.title`)}
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
