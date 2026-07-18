"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import { Link } from "@/lib/i18n/routing";
import { HeroSearchBar } from "@/components/home/hero-search-bar";

const floatingCards = [
  {
    title: "Casa moderna",
    place: "Miami, Florida",
    price: "USD 850,000",
    image:
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=400&q=80",
    top: "16%",
    right: "6%",
  },
  {
    title: "Apartamento Premium",
    place: "São Paulo, Brasil",
    price: "USD 420,000",
    image:
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&q=80",
    top: "48%",
    right: "14%",
  },
] as const;

export function HeroSection() {
  const t = useTranslations("landing");

  return (
    <section className="relative">
      <div className="relative h-[420px] overflow-hidden sm:h-[460px] lg:h-[520px]">
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
              "linear-gradient(90deg, rgba(5,8,15,.88), rgba(5,8,15,.45), rgba(5,8,15,.22))",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#070B14] via-transparent to-transparent" />

        {floatingCards.map((card, i) => (
          <motion.div
            key={card.title}
            className="pointer-events-none absolute z-10 hidden w-[200px] overflow-hidden rounded-[20px] border border-white/15 bg-[#070B14]/70 shadow-[0_16px_48px_rgba(0,0,0,.35)] backdrop-blur-md lg:block"
            style={{ top: card.top, right: card.right }}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: [0, -6, 0] }}
            transition={{
              opacity: { duration: 0.55, delay: 0.25 + i * 0.1 },
              y: {
                duration: 5.5 + i * 0.8,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.7 + i * 0.3,
              },
            }}
          >
            <div className="relative h-24">
              <Image
                src={card.image}
                alt={card.title}
                fill
                className="object-cover"
                sizes="200px"
              />
              <div className="absolute -left-1 top-2.5 flex size-6 items-center justify-center rounded-full bg-[#D4A62A] text-[#070B14] shadow-lg">
                <MapPin className="size-3" fill="currentColor" />
              </div>
            </div>
            <div className="p-3">
              <p className="text-sm font-semibold text-white">{card.title}</p>
              <p className="mt-0.5 text-xs text-[#8C97A8]">{card.place}</p>
              <p className="mt-1 text-sm font-bold text-[#D4A62A]">{card.price}</p>
            </div>
          </motion.div>
        ))}

        <div className="rk-container relative z-20 flex h-full flex-col justify-center pb-20 pt-8">
          <div className="w-full max-w-xl lg:max-w-[48%]">
            <motion.h1
              className="rk-display max-w-xl text-[2rem] font-bold leading-[1.15] tracking-tight text-white sm:text-4xl lg:text-[48px] lg:leading-[1.1]"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
            >
              {t("hero.titleStart")}{" "}
              <span className="text-[#D4A62A]">{t("hero.titleHighlight")}</span>
            </motion.h1>

            <motion.p
              className="mt-4 max-w-md text-base leading-relaxed text-[#AEB7C5] sm:text-lg"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.08 }}
            >
              {t("hero.subtitle")}
            </motion.p>

            <motion.div
              className="mt-7 flex flex-wrap gap-3"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.16 }}
            >
              <Link
                href="/imoveis?transaction=buy"
                className="rk-btn-gold inline-flex h-12 items-center justify-center px-7 text-sm"
              >
                {t("hero.ctaBuy")}
              </Link>
              <Link
                href="/imoveis?transaction=rent"
                className="rk-btn-ghost inline-flex h-12 items-center justify-center px-7 text-sm"
              >
                {t("hero.ctaRent")}
              </Link>
            </motion.div>
          </div>
        </div>
      </div>

      <HeroSearchBar />
    </section>
  );
}
