"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Bath, BedDouble, MapPin, Maximize2 } from "lucide-react";
import { Link } from "@/lib/i18n/routing";

export type FeaturedPropertyCard = {
  id: string;
  title: string;
  place: string;
  priceLabel: string;
  beds: number;
  baths: number;
  area: number;
  badge: "premium" | "new" | null;
  image: string;
};

type Props = {
  items: FeaturedPropertyCard[];
};

export function FeaturedProperties({ items }: Props) {
  const t = useTranslations("landing.featured");

  if (items.length === 0) return null;

  return (
    <section className="pt-[70px]">
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

        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {items.map((item, index) => (
            <motion.article
              key={item.id}
              className="group overflow-hidden rounded-[20px] border border-[rgba(255,255,255,.08)] bg-[#101725] shadow-[0_15px_40px_rgba(0,0,0,.30)] transition-all duration-300 hover:-translate-y-1.5 hover:scale-[1.02] hover:shadow-[0_25px_60px_rgba(0,0,0,.35)]"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: index * 0.08 }}
            >
              <Link href={`/imoveis/${item.id}`}>
                <div className="relative aspect-[16/10] overflow-hidden rounded-t-[20px]">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width:768px) 100vw, 25vw"
                  />
                  {item.badge ? (
                    <span className="absolute left-3 top-3 rounded-full bg-[#D4A62A] px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-[#070B14]">
                      {t(`badges.${item.badge}`)}
                    </span>
                  ) : null}
                </div>
                <div className="p-5">
                  <h3 className="font-semibold text-white">{item.title}</h3>
                  <p className="mt-1.5 flex items-center gap-1 text-sm text-[#8C97A8]">
                    <MapPin className="size-4 text-[#C8D0DD]" strokeWidth={1.75} />
                    {item.place}
                  </p>
                  <div className="mt-4 flex items-center gap-4 text-sm text-[#C8D0DD]">
                    <span className="inline-flex items-center gap-1.5">
                      <BedDouble className="size-4" strokeWidth={1.75} /> {item.beds}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Bath className="size-4" strokeWidth={1.75} /> {item.baths}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Maximize2 className="size-4" strokeWidth={1.75} /> {item.area} m²
                    </span>
                  </div>
                  <p className="mt-5 text-right text-lg font-bold text-[#D4A62A]">
                    {item.priceLabel}
                  </p>
                </div>
              </Link>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
