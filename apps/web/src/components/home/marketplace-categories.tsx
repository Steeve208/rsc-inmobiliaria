"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import {
  Briefcase,
  Building2,
  Car,
  CreditCard,
  HardHat,
  Home,
} from "lucide-react";
import { Link } from "@/lib/i18n/routing";

const categories = [
  {
    key: "properties",
    icon: Home,
    href: "/imoveis",
    image:
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80",
  },
  {
    key: "vehicles",
    icon: Car,
    href: "/veiculos",
    image:
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80",
  },
  {
    key: "launches",
    icon: HardHat,
    href: "/imoveis?launch=1",
    image:
      "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800&q=80",
  },
  {
    key: "companies",
    icon: Building2,
    href: "/para-empresas",
    image:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80",
  },
  {
    key: "financing",
    icon: CreditCard,
    href: "/financing",
    image:
      "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&q=80",
  },
  {
    key: "services",
    icon: Briefcase,
    href: "/services",
    image:
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80",
  },
] as const;

export function MarketplaceCategories() {
  const t = useTranslations("landing.categories");

  return (
    <section id="categorias" className="scroll-mt-28 pt-[70px]">
      <div className="rk-container">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="h-8 w-1 rounded-full bg-[#D4A62A]" />
            <h2 className="rk-section-title text-3xl lg:text-4xl">{t("title")}</h2>
          </div>
          <Link
            href="/imoveis"
            className="text-sm font-semibold text-[#D4A62A] transition-colors duration-300 hover:text-[#E7BA4A]"
          >
            {t("viewAll")}
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {categories.map((category, index) => {
            const Icon = category.icon;
            return (
              <motion.div
                key={category.key}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: index * 0.05 }}
              >
                <Link
                  href={category.href}
                  className="group relative flex aspect-[3/4] overflow-hidden rounded-[20px] border border-white/[0.08]"
                >
                  <Image
                    src={category.image}
                    alt={t(`items.${category.key}.title`)}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width:768px) 50vw, 16vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/10" />
                  <div className="relative z-10 mt-auto flex w-full flex-col p-4">
                    <span className="mb-3 flex size-10 items-center justify-center rounded-xl bg-[#D4A62A]/20 text-[#D4A62A] backdrop-blur-sm">
                      <Icon className="size-5" strokeWidth={1.75} />
                    </span>
                    <h3 className="text-base font-semibold text-white">
                      {t(`items.${category.key}.title`)}
                    </h3>
                    <p className="mt-1 text-xs leading-relaxed text-[#C8D0DD]">
                      {t(`items.${category.key}.description`)}
                    </p>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
