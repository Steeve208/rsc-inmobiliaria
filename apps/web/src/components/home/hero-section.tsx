"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Link } from "@/lib/i18n/routing";
import { HeroSearchBar } from "@/components/home/hero-search-bar";

const pillars = ["buy", "sell", "finance", "list"] as const;

export function HeroSection() {
  const t = useTranslations("landing");

  return (
    <section className="relative bg-[#F7F5F0] pb-0">
      <div className="relative h-[340px] overflow-hidden sm:h-[360px] lg:h-[380px]">
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
              "linear-gradient(105deg, rgba(5,8,15,.92) 0%, rgba(5,8,15,.72) 42%, rgba(5,8,15,.38) 100%)",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#070B14] via-transparent to-black/20" />

        <div className="rk-container relative z-20 flex h-full flex-col justify-center pb-16 pt-8">
          <div className="w-full max-w-2xl">
            <motion.h1
              className="rk-display text-[1.85rem] font-bold leading-[1.12] tracking-tight text-white sm:text-4xl lg:text-[2.6rem] lg:leading-[1.1]"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              {t("hero.title")}
            </motion.h1>

            <motion.p
              className="mt-3 max-w-xl text-[15px] leading-relaxed text-[#C8D0DD] sm:text-base"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.05 }}
            >
              {t("hero.subtitle")}
            </motion.p>

            <motion.div
              className="mt-6 flex flex-wrap items-center gap-3"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <Link
                href="/imoveis"
                className="rk-btn-gold inline-flex h-11 items-center justify-center px-5 text-sm"
              >
                {t("hero.ctaProperty")}
              </Link>
              <Link
                href="/veiculos"
                className="rk-btn-ghost inline-flex h-11 items-center justify-center px-5 text-sm"
              >
                {t("hero.ctaVehicle")}
              </Link>
            </motion.div>

            <motion.p
              className="mt-5 text-[11px] font-semibold tracking-[0.22em] text-[#D4A62A]/90 uppercase sm:text-xs"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.45, delay: 0.18 }}
            >
              {pillars.map((key, index) => (
                <span key={key}>
                  {index > 0 ? (
                    <span className="mx-2 text-white/25" aria-hidden>
                      •
                    </span>
                  ) : null}
                  {t(`hero.pillars.${key}`)}
                </span>
              ))}
            </motion.p>
          </div>
        </div>
      </div>

      <HeroSearchBar />
    </section>
  );
}
