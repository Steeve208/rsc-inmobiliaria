"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Building2, Home, MapPin, Sparkles, Users } from "lucide-react";
import { Link } from "@/lib/i18n/routing";
import { HeroSearchBar } from "@/components/home/hero-search-bar";

const floatingCards = [
  {
    titleKey: "card1.title",
    placeKey: "card1.place",
    price: "USD 850,000",
    image:
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=400&q=80",
    top: "12%",
    right: "5%",
  },
  {
    titleKey: "card2.title",
    placeKey: "card2.place",
    price: "USD 420,000",
    image:
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&q=80",
    top: "48%",
    right: "12%",
  },
] as const;

const heroStats = [
  { key: "properties", icon: Home },
  { key: "companies", icon: Building2 },
  { key: "services", icon: Sparkles },
  { key: "users", icon: Users },
] as const;

export function HeroSection() {
  const t = useTranslations("landing");

  return (
    <section className="relative">
      <div className="relative h-[300px] overflow-hidden sm:h-[320px] lg:h-[340px]">
        <Image
          src="/hero-bg.png"
          alt=""
          fill
          priority
          className="object-cover object-[center_40%]"
          sizes="100vw"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, rgba(5,8,15,.90), rgba(5,8,15,.55), rgba(5,8,15,.28))",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#070B14] via-transparent to-transparent" />

        {floatingCards.map((card, i) => (
          <motion.div
            key={card.titleKey}
            className="pointer-events-none absolute z-10 hidden w-[168px] overflow-hidden rounded-2xl border border-white/15 bg-[#070B14]/70 shadow-[0_12px_36px_rgba(0,0,0,.35)] backdrop-blur-md lg:block"
            style={{ top: card.top, right: card.right }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: [0, -5, 0] }}
            transition={{
              opacity: { duration: 0.45, delay: 0.2 + i * 0.1 },
              y: {
                duration: 5 + i * 0.7,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.6 + i * 0.25,
              },
            }}
          >
            <div className="relative h-16">
              <Image
                src={card.image}
                alt={t(`hero.floating.${card.titleKey}`)}
                fill
                className="object-cover"
                sizes="168px"
              />
              <div className="absolute -left-1 top-2 flex size-5 items-center justify-center rounded-full bg-[#D4A62A] text-[#070B14] shadow-lg">
                <MapPin className="size-2.5" fill="currentColor" />
              </div>
            </div>
            <div className="p-2.5">
              <p className="text-xs font-semibold text-white">
                {t(`hero.floating.${card.titleKey}`)}
              </p>
              <p className="mt-0.5 text-[10px] text-[#8C97A8]">
                {t(`hero.floating.${card.placeKey}`)}
              </p>
              <p className="mt-1 text-xs font-bold text-[#D4A62A]">{card.price}</p>
            </div>
          </motion.div>
        ))}

        <div className="rk-container relative z-20 flex h-full flex-col justify-center pb-14 pt-6">
          <div className="w-full max-w-xl lg:max-w-[52%]">
            <motion.h1
              className="rk-display text-[1.75rem] font-bold leading-[1.15] tracking-tight text-white sm:text-3xl lg:text-[2.25rem] lg:leading-[1.12]"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
            >
              {t("hero.title")}
            </motion.h1>

            <motion.p
              className="mt-2 max-w-lg text-sm leading-snug text-[#AEB7C5] sm:text-[15px]"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.05 }}
            >
              {t("hero.subtitle")}
            </motion.p>

            <motion.div
              className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.1 }}
            >
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                {heroStats.map((stat) => {
                  const Icon = stat.icon;
                  return (
                    <div
                      key={stat.key}
                      className="inline-flex items-center gap-1.5 text-xs text-[#C8D0DD] sm:text-[13px]"
                    >
                      <Icon
                        className="size-3.5 text-[#D4A62A]"
                        strokeWidth={1.75}
                      />
                      <span className="font-semibold text-white">
                        {t(`hero.stats.${stat.key}.value`)}
                      </span>
                      <span className="text-[#8C97A8]">
                        {t(`hero.stats.${stat.key}.label`)}
                      </span>
                    </div>
                  );
                })}
              </div>
              <Link
                href="/imoveis"
                className="rk-btn-gold inline-flex h-9 shrink-0 items-center justify-center px-4 text-xs"
              >
                {t("hero.ctaExplore")}
              </Link>
            </motion.div>
          </div>
        </div>
      </div>

      <HeroSearchBar />
    </section>
  );
}
