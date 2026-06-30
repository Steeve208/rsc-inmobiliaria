"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { ShieldCheck, Star } from "lucide-react";
import { marketplace } from "@/lib/layout/marketplace";
import { premiumDealerships } from "../mock-data";

export function PremiumDealersSection() {
  const t = useTranslations("veiculos.dealers");

  return (
    <section className="market-section">
      <div className={marketplace.container}>
        <div className={marketplace.headerGap}>
          <span className="mb-3 inline-block rounded-full bg-[#d4a017]/15 px-3 py-1 text-xs font-semibold text-[#d4a017]">
            {t("badge")}
          </span>
          <h2 className={marketplace.title}>{t("title")}</h2>
          <p className={marketplace.subtitle}>{t("subtitle")}</p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {premiumDealerships.map((dealer) => (
            <article
              key={dealer.id}
              className="group overflow-hidden rounded-2xl bg-[#081128]/60 transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#081128]/80 hover:shadow-xl hover:shadow-black/20"
            >
              <div className="relative h-32 overflow-hidden">
                <Image
                  src={dealer.logo}
                  alt={dealer.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="300px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
                {dealer.verified && (
                  <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-[#22c55e] px-2 py-0.5 text-[10px] font-semibold text-white">
                    <ShieldCheck className="size-3" />
                    {t("verified")}
                  </span>
                )}
              </div>
              <div className="p-5">
                <h3 className="font-semibold text-white">{dealer.name}</h3>
                <p className="mt-1 text-xs text-white/50">{dealer.city}</p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-xs text-white/45">
                    {t("listings", { count: dealer.listings })}
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs text-[#d4a017]">
                    <Star className="size-3 fill-current" />
                    4.8
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
