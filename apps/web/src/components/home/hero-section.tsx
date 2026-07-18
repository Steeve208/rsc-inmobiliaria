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
    top: "18%",
    right: "7%",
  },
  {
    title: "Apartamento Premium",
    place: "São Paulo, Brasil",
    price: "USD 420,000",
    image:
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&q=80",
    top: "52%",
    right: "16%",
  },
] as const;

export function HeroSection() {
  const t = useTranslations("landing");

  return (
    <section className="relative">
      <div className="relative h-[640px] overflow-hidden lg:h-[780px]">
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
              "linear-gradient(90deg, rgba(5,8,15,.85), rgba(5,8,15,.40), rgba(5,8,15,.20))",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#070B14] via-transparent to-transparent" />

        {floatingCards.map((card, i) => (
          <motion.div
            key={card.title}
            className="pointer-events-none absolute z-10 hidden w-[230px] overflow-hidden rounded-[24px] border border-white/15 bg-[#070B14]/70 shadow-[0_20px_60px_rgba(0,0,0,.35)] backdrop-blur-md lg:block"
            style={{ top: card.top, right: card.right }}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: [0, -8, 0] }}
            transition={{
              opacity: { duration: 0.6, delay: 0.3 + i * 0.12 },
              y: {
                duration: 5.5 + i * 0.8,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.8 + i * 0.35,
              },
            }}
          >
            <div className="relative h-28">
              <Image
                src={card.image}
                alt={card.title}
                fill
                className="object-cover"
                sizes="230px"
              />
              <div className="absolute -left-1 top-3 flex size-7 items-center justify-center rounded-full bg-[#D4A62A] text-[#070B14] shadow-lg">
                <MapPin className="size-3.5" fill="currentColor" />
              </div>
            </div>
            <div className="p-3.5">
              <p className="text-sm font-semibold text-white">{card.title}</p>
              <p className="mt-0.5 text-xs text-[#8C97A8]">{card.place}</p>
              <p className="mt-1.5 text-sm font-bold text-[#D4A62A]">{card.price}</p>
            </div>
          </motion.div>
        ))}

        <div className="rk-container relative z-20 flex h-full flex-col justify-center pb-32 pt-12">
          <div className="w-full max-w-xl lg:max-w-[42%]">
            <motion.h1
              className="rk-display max-w-xl text-[2.5rem] font-bold leading-[1.12] tracking-tight text-white sm:text-5xl lg:text-[68px] lg:leading-[1.08]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {t("hero.titleStart")}{" "}
              <span className="text-[#D4A62A]">{t("hero.titleHighlight")}</span>
            </motion.h1>

            <motion.p
              className="mt-7 max-w-md text-lg leading-relaxed text-[#AEB7C5] sm:text-xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              {t("hero.subtitle")}
            </motion.p>

            <motion.div
              className="mt-10 flex flex-wrap gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Link
                href="/imoveis"
                className="rk-btn-gold inline-flex h-[62px] items-center justify-center px-10 text-[15px]"
              >
                {t("hero.ctaExplore")}
              </Link>
              <Link
                href="/empresa/painel"
                className="rk-btn-ghost inline-flex h-[62px] items-center justify-center px-10 text-[15px]"
              >
                {t("hero.ctaCompanies")}
              </Link>
            </motion.div>
          </div>
        </div>
      </div>

      <HeroSearchBar />
    </section>
  );
}
