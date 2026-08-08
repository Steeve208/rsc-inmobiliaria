"use client";

import { ListingImage } from "@/components/listing-image";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { ArrowRight, Gauge, Heart } from "lucide-react";
import { Link } from "@/lib/i18n/routing";
import { useFavoriteButton } from "@/hooks/use-favorites";
import { cn } from "@/lib/utils";

export type FeaturedVehicleCard = {
  id: string;
  title: string;
  year: number;
  mileageLabel: string;
  priceLabel: string;
  image: string;
};

type Props = {
  items: FeaturedVehicleCard[];
};

function VehicleCard({
  item,
  index,
}: {
  item: FeaturedVehicleCard;
  index: number;
}) {
  const t = useTranslations("landing.featuredVehicles");
  const { active, handleClick } = useFavoriteButton("vehicle", item.id);

  return (
    <motion.article
      className="group overflow-hidden rounded-[22px] bg-white shadow-[0_8px_30px_rgba(15,20,30,.06)] ring-1 ring-black/[0.04] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_22px_50px_rgba(15,20,30,.12)]"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.35, delay: index * 0.08 }}
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <Link href={`/veiculos/${item.id}`} className="absolute inset-0 block">
          <ListingImage
            src={item.image}
            alt={item.title}
            fill
            variant="card"
            className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
            sizes="(max-width:768px) 100vw, 25vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
        </Link>
        <button
          type="button"
          onClick={handleClick}
          className={cn(
            "absolute right-3 top-3 z-10 inline-flex size-9 items-center justify-center rounded-full backdrop-blur-md transition-colors",
            active
              ? "bg-[#D4A62A] text-[#070B14]"
              : "bg-white/90 text-[#1A1F2B] hover:bg-white",
          )}
          aria-label={t("save")}
        >
          <Heart className={cn("size-4", active && "fill-current")} />
        </button>
      </div>
      <Link href={`/veiculos/${item.id}`} className="block p-5">
        <h3 className="rk-display line-clamp-1 text-base font-semibold text-[#121826]">
          {item.title}
        </h3>
        <p className="mt-1.5 flex items-center gap-1.5 text-sm text-[#6B7285]">
          <Gauge className="size-3.5 text-[#D4A62A]" strokeWidth={1.75} />
          {item.year} · {item.mileageLabel}
        </p>
        <p className="mt-4 text-lg font-bold text-[#0B1220]">{item.priceLabel}</p>
        <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-[#D4A62A] opacity-0 transition-all duration-300 group-hover:opacity-100">
          {t("viewVehicle")}
          <ArrowRight className="size-4" />
        </span>
      </Link>
    </motion.article>
  );
}

export function FeaturedVehicles({ items }: Props) {
  const t = useTranslations("landing.featuredVehicles");

  if (items.length === 0) return null;

  return (
    <section className="bg-[#F7F5F0] pt-14 sm:pt-16">
      <div className="rk-container">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <h2 className="rk-display text-3xl font-bold tracking-tight text-[#121826] lg:text-[2.1rem]">
              {t("title")}
            </h2>
            <p className="mt-2 text-sm text-[#6B7285]">{t("subtitle")}</p>
          </div>
          <Link
            href="/veiculos"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#0B1220] transition-colors duration-300 hover:text-[#D4A62A]"
          >
            {t("viewAll")}
            <ArrowRight className="size-4" />
          </Link>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {items.map((item, index) => (
            <VehicleCard key={item.id} item={item} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
