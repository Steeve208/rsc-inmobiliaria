"use client";

import { ListingImage } from "@/components/listing-image";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { ArrowRight, Bath, BedDouble, Car, Heart, MapPin } from "lucide-react";
import { Link } from "@/lib/i18n/routing";
import { useFavoriteButton } from "@/hooks/use-favorites";
import { cn } from "@/lib/utils";

export type FeaturedPropertyCard = {
  id: string;
  title: string;
  place: string;
  priceLabel: string;
  beds: number;
  baths: number;
  area: number;
  garage: number;
  transaction: "buy" | "rent" | null;
  badge: "premium" | "new" | "featured" | null;
  image: string;
};

type Props = {
  items: FeaturedPropertyCard[];
};

function PropertyCard({
  item,
  index,
}: {
  item: FeaturedPropertyCard;
  index: number;
}) {
  const t = useTranslations("landing.featured");
  const { active, handleClick } = useFavoriteButton("property", item.id);

  const transactionLabel =
    item.transaction === "rent" ? t("badges.rent") : t("badges.sale");

  return (
    <motion.article
      className="group relative overflow-hidden rounded-[22px] bg-white shadow-[0_8px_30px_rgba(15,20,30,.06)] ring-1 ring-black/[0.04] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_22px_50px_rgba(15,20,30,.12)]"
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <Link href={`/imoveis/${item.id}`} className="absolute inset-0 block">
          <ListingImage
            src={item.image}
            alt={item.title}
            fill
            variant="card"
            className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
            sizes="(max-width:768px) 100vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-black/10" />
        </Link>

        <div className="pointer-events-none absolute left-3 top-3 z-10 flex flex-wrap gap-2">
          <span className="rounded-md bg-[#0B1220]/85 px-2.5 py-1 text-[10px] font-bold tracking-[0.12em] text-white uppercase backdrop-blur-sm">
            {transactionLabel}
          </span>
          {item.badge ? (
            <span className="rounded-md bg-[#D4A62A] px-2.5 py-1 text-[10px] font-bold tracking-[0.1em] text-[#070B14] uppercase">
              {t(`badges.${item.badge}`)}
            </span>
          ) : null}
        </div>

        <button
          type="button"
          onClick={handleClick}
          className={cn(
            "absolute right-3 top-3 z-10 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold backdrop-blur-md transition-colors",
            active
              ? "bg-[#D4A62A] text-[#070B14]"
              : "bg-white/90 text-[#1A1F2B] hover:bg-white",
          )}
          aria-label={t("save")}
        >
          <Heart className={cn("size-3.5", active && "fill-current")} />
          {t("save")}
        </button>
      </div>

      <Link href={`/imoveis/${item.id}`} className="block p-5">
        <h3 className="rk-display line-clamp-1 text-lg font-semibold text-[#121826]">
          {item.title}
        </h3>
        <p className="mt-1.5 flex items-center gap-1.5 text-sm text-[#6B7285]">
          <MapPin className="size-3.5 shrink-0 text-[#D4A62A]" strokeWidth={1.75} />
          <span className="line-clamp-1">{item.place}</span>
        </p>

        <p className="mt-4 text-xl font-bold tracking-tight text-[#0B1220]">
          {item.priceLabel}
        </p>

        <p className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-[13px] text-[#6B7285]">
          {item.beds > 0 ? (
            <span className="inline-flex items-center gap-1">
              <BedDouble className="size-3.5" strokeWidth={1.75} />
              {t("specs.beds", { count: item.beds })}
            </span>
          ) : null}
          {item.beds > 0 && item.baths > 0 ? (
            <span className="text-[#D4C9AE]">·</span>
          ) : null}
          {item.baths > 0 ? (
            <span className="inline-flex items-center gap-1">
              <Bath className="size-3.5" strokeWidth={1.75} />
              {t("specs.baths", { count: item.baths })}
            </span>
          ) : null}
          {(item.beds > 0 || item.baths > 0) && item.garage > 0 ? (
            <span className="text-[#D4C9AE]">·</span>
          ) : null}
          {item.garage > 0 ? (
            <span className="inline-flex items-center gap-1">
              <Car className="size-3.5" strokeWidth={1.75} />
              {t("specs.garage", { count: item.garage })}
            </span>
          ) : null}
        </p>

        <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-[#D4A62A] opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:opacity-100">
          {t("viewProperty")}
          <ArrowRight className="size-4" strokeWidth={2} />
        </span>
      </Link>
    </motion.article>
  );
}

export function FeaturedProperties({ items }: Props) {
  const t = useTranslations("landing.featured");

  if (items.length === 0) return null;

  return (
    <section className="bg-[#F7F5F0] pt-14 pb-4 sm:pt-16">
      <div className="rk-container">
        <div className="mb-9 flex flex-col gap-3 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-xl">
            <p className="text-xs font-semibold tracking-[0.18em] text-[#D4A62A] uppercase">
              {t("eyebrow")}
            </p>
            <h2 className="rk-display mt-2 text-3xl font-bold tracking-tight text-[#121826] lg:text-[2.35rem]">
              {t("title")}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-[#6B7285] sm:text-[15px]">
              {t("subtitle")}
            </p>
          </div>
          <Link
            href="/imoveis?featured=1"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#0B1220] transition-colors duration-300 hover:text-[#D4A62A]"
          >
            {t("viewAll")}
            <ArrowRight className="size-4" />
          </Link>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {items.map((item, index) => (
            <PropertyCard key={item.id} item={item} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
