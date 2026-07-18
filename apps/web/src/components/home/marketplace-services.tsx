"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import {
  Armchair,
  CreditCard,
  Package,
  Shield,
  Sun,
  Wifi,
} from "lucide-react";
import { Link } from "@/lib/i18n/routing";

const services = [
  {
    key: "financing",
    icon: CreditCard,
    href: "/financing",
    image:
      "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=700&q=80",
  },
  {
    key: "insurance",
    icon: Shield,
    href: "/services#insurance",
    image:
      "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=700&q=80",
  },
  {
    key: "moving",
    icon: Package,
    href: "/services",
    image:
      "https://images.unsplash.com/photo-1600518464441-9154a4dea21b?w=700&q=80",
  },
  {
    key: "decor",
    icon: Armchair,
    href: "/services",
    image:
      "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=700&q=80",
  },
  {
    key: "solar",
    icon: Sun,
    href: "/services",
    image:
      "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=700&q=80",
  },
  {
    key: "internet",
    icon: Wifi,
    href: "/services",
    image:
      "https://images.unsplash.com/photo-1544197150-b99a580bb7a2?w=700&q=80",
  },
] as const;

export function MarketplaceServices() {
  const t = useTranslations("landing.marketplaceServices");

  return (
    <section className="pt-[70px]">
      <div className="rk-container">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="h-8 w-1 rounded-full bg-[#D4A62A]" />
            <h2 className="rk-section-title text-3xl lg:text-4xl">{t("title")}</h2>
          </div>
          <Link
            href="/services"
            className="text-sm font-semibold text-[#D4A62A] transition-colors duration-300 hover:text-[#E7BA4A]"
          >
            {t("viewAll")}
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={service.key}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: index * 0.05 }}
              >
                <Link
                  href={service.href}
                  className="group relative flex aspect-[4/5] overflow-hidden rounded-[20px] border border-white/[0.08]"
                >
                  <Image
                    src={service.image}
                    alt={t(`items.${service.key}.title`)}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width:768px) 50vw, 16vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/15" />
                  <div className="relative z-10 mt-auto p-4">
                    <span className="mb-3 flex size-9 items-center justify-center rounded-lg bg-[#D4A62A]/20 text-[#D4A62A]">
                      <Icon className="size-4" strokeWidth={1.75} />
                    </span>
                    <h3 className="text-sm font-semibold text-white">
                      {t(`items.${service.key}.title`)}
                    </h3>
                    <p className="mt-1 text-xs leading-relaxed text-[#AEB7C5]">
                      {t(`items.${service.key}.description`)}
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
