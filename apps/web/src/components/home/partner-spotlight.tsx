"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { AnimatePresence, motion } from "framer-motion";
import { Award, Building2, Globe2, Landmark, LineChart } from "lucide-react";
import { Link } from "@/lib/i18n/routing";
import { cn } from "@/lib/utils";

const ROTATE_MS = 6000;

const slides = [
  {
    id: "ecosystem",
    logoLabel: "RSC",
    icon: Globe2,
    href: "/imoveis",
    ctaKey: "ctaExplore" as const,
  },
  {
    id: "credit",
    logoLabel: "RSC",
    icon: Landmark,
    href: "/financing",
    ctaKey: "ctaCredit" as const,
  },
  {
    id: "business",
    logoLabel: "RSC",
    icon: Building2,
    href: "/para-empresas",
    ctaKey: "ctaBusiness" as const,
  },
  {
    id: "invest",
    logoLabel: "RSC",
    icon: LineChart,
    href: "#inversion",
    ctaKey: "ctaInvest" as const,
  },
] as const;

export function PartnerSpotlight() {
  const t = useTranslations("landing.partnerSpotlight");
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const id = window.setInterval(() => {
      setActive((prev) => (prev + 1) % slides.length);
    }, ROTATE_MS);
    return () => window.clearInterval(id);
  }, [paused]);

  const slide = slides[active];
  const Icon = slide.icon;

  return (
    <section className="pt-[80px]">
      <div className="rk-container">
        <motion.div
          className="relative min-h-[300px] overflow-hidden rounded-[24px] px-6 py-10 sm:min-h-[320px] sm:px-10 lg:min-h-[340px] lg:px-14 lg:py-12"
          style={{
            background: "linear-gradient(90deg, #1B1840, #23155A, #111827)",
          }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <div className="pointer-events-none absolute -right-8 top-1/2 hidden h-72 w-72 -translate-y-1/2 rounded-full bg-[#D6A62E]/20 blur-3xl lg:block" />
          <div className="pointer-events-none absolute right-8 top-1/2 hidden -translate-y-1/2 lg:block" aria-hidden>
            <div className="relative flex size-48 items-center justify-center rounded-full border border-[#D6A62E]/35 bg-[#D6A62E]/10 shadow-[0_0_80px_rgba(214,166,46,0.28)]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={slide.id}
                  className="flex flex-col items-center gap-3"
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.92 }}
                  transition={{ duration: 0.35 }}
                >
                  <div className="flex size-20 items-center justify-center rounded-2xl bg-[#070B14]/70 text-[#D6A62E] ring-1 ring-[#D6A62E]/40">
                    <Icon className="size-10" strokeWidth={1.5} />
                  </div>
                  <span className="rk-display text-xl font-bold tracking-wide text-white">
                    {slide.logoLabel}
                  </span>
                </motion.div>
              </AnimatePresence>
              <span className="absolute -bottom-3 rounded-full bg-[#D6A62E] px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#070B14]">
                {t("badge")}
              </span>
            </div>
          </div>

          <div className="relative flex h-full min-h-[260px] max-w-2xl flex-col justify-center lg:min-h-[280px]">
            <p className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-[#D6A62E]">
              <Award className="size-4" strokeWidth={1.75} />
              {t("eyebrow")}
            </p>

            <AnimatePresence mode="wait">
              <motion.div
                key={slide.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.35 }}
              >
                <h2 className="rk-section-title mt-3 text-3xl lg:text-4xl">
                  {t(`items.${slide.id}.title`)}
                </h2>
                <p className="mt-2 text-lg font-semibold text-white">
                  {t(`items.${slide.id}.brand`)}
                </p>
                <p className="mt-3 max-w-xl text-base leading-relaxed text-[#C8D0DD]">
                  {t(`items.${slide.id}.description`)}
                </p>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  {slide.href.startsWith("#") ? (
                    <a
                      href={slide.href}
                      className="rk-btn-gold inline-flex h-[52px] items-center justify-center px-7 text-sm"
                    >
                      {t(slide.ctaKey)}
                    </a>
                  ) : (
                    <Link
                      href={slide.href}
                      className="rk-btn-gold inline-flex h-[52px] items-center justify-center px-7 text-sm"
                    >
                      {t(slide.ctaKey)}
                    </Link>
                  )}
                  <Link
                    href="/para-empresas"
                    className="rk-btn-ghost inline-flex h-[52px] items-center justify-center px-7 text-sm"
                  >
                    {t("ctaSecondary")}
                  </Link>
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="mt-8 flex items-center gap-2" role="tablist" aria-label={t("eyebrow")}>
              {slides.map((item, index) => (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  aria-selected={index === active}
                  aria-label={t(`items.${item.id}.brand`)}
                  onClick={() => setActive(index)}
                  className={cn(
                    "size-2.5 rounded-full transition-all duration-300",
                    index === active
                      ? "w-6 bg-[#D6A62E]"
                      : "bg-white/25 hover:bg-white/45",
                  )}
                />
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
