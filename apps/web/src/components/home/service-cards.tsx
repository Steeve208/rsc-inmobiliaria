"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import {
  Building2,
  Car,
  Home,
  KeyRound,
  Landmark,
  Tag,
} from "lucide-react";
import { Link } from "@/lib/i18n/routing";

const cards = [
  { key: "buy", icon: Home, href: "/imoveis?transaction=buy" },
  { key: "rent", icon: KeyRound, href: "/imoveis?transaction=rent" },
  { key: "vehicles", icon: Car, href: "/veiculos" },
  { key: "sell", icon: Tag, href: "/cadastrar" },
  { key: "financing", icon: Landmark, href: "/financing" },
  { key: "companies", icon: Building2, href: "/para-empresas" },
] as const;

const cardClassName =
  "group flex h-full items-start gap-4 rounded-[18px] border border-[rgba(255,255,255,.08)] bg-[#111827] p-[30px] transition-all duration-300 hover:-translate-y-1 hover:border-[#D6A62E] hover:bg-[#161F31] hover:shadow-[0_25px_60px_rgba(0,0,0,.35)]";

export function ServiceCards() {
  const t = useTranslations("landing.services");

  return (
    <section className="pt-[50px]">
      <div className="rk-container grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card, index) => {
          const Icon = card.icon;
          const body = (
            <>
              <div className="flex size-[50px] shrink-0 items-center justify-center rounded-[14px] bg-[#D6A62E]/12 text-[#D6A62E] transition-colors duration-300 group-hover:bg-[#D6A62E]/20">
                <Icon className="size-6" strokeWidth={1.75} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">{t(`${card.key}.title`)}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#8C97A8]">
                  {t(`${card.key}.description`)}
                </p>
              </div>
            </>
          );

          return (
            <motion.div
              key={card.key}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: index * 0.06 }}
            >
              <Link href={card.href} className={cardClassName}>
                {body}
              </Link>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
