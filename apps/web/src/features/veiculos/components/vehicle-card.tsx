"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Gauge, GitCompare, Heart, MapPin, ShieldCheck, Zap } from "lucide-react";
import { Link } from "@/lib/i18n/routing";
import { cn } from "@/lib/utils";
import { useFavoriteButton } from "@/hooks/use-favorites";
import { useVehicleCompare } from "@/hooks/use-vehicle-compare-state";
import type { VehicleListing } from "../types";

type Props = {
  item: VehicleListing;
  variant?: "list" | "gallery" | "compact";
  highlighted?: boolean;
  onHover?: () => void;
  onLeave?: () => void;
};

function formatPrice(price: number, currency: string) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(price);
}

function estimateInstallment(price: number) {
  return Math.round(price * 0.005);
}

export function VehicleCard({
  item,
  variant = "list",
  highlighted,
  onHover,
  onLeave,
}: Props) {
  const t = useTranslations("veiculos.card");
  const { active, handleClick } = useFavoriteButton("vehicle", item.id);
  const { isCompared, toggle } = useVehicleCompare();
  const installment = estimateInstallment(item.price);

  const cardContent = (
    <>
      <div
        className={cn(
          "relative overflow-hidden",
          variant === "list" ? "h-48 w-full shrink-0 sm:h-auto sm:w-56" : "aspect-[4/3]",
        )}
      >
        <Image
          src={item.image}
          alt={item.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes={variant === "list" ? "224px" : "(max-width:768px) 100vw, 33vw"}
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-black/5 to-transparent" />
        <div className="absolute right-3 top-3 flex gap-2">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggle(item.id);
            }}
            className={cn(
              "flex size-8 items-center justify-center rounded-full backdrop-blur-sm transition-colors",
              isCompared(item.id)
                ? "bg-[#22c55e] text-white"
                : "bg-black/40 text-white hover:bg-black/60",
            )}
            aria-label={t("compare")}
          >
            <GitCompare className="size-3.5" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleClick(e);
            }}
            className={cn(
              "flex size-8 items-center justify-center rounded-full backdrop-blur-sm transition-colors",
              active
                ? "bg-[#d4a017] text-[#000a1a]"
                : "bg-black/40 text-white hover:bg-black/60",
            )}
            aria-label={t("favorite")}
          >
            <Heart className={cn("size-4", active && "fill-current")} />
          </button>
        </div>
        {item.verified && (
          <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-[#22c55e] px-2.5 py-1 text-[10px] font-semibold text-white">
            <ShieldCheck className="size-3" />
            {t("verified")}
          </span>
        )}
      </div>

      <div className={cn("p-5", variant === "list" && "flex flex-1 flex-col justify-between")}>
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-[#22c55e]">
            {item.make}
          </p>
          <h3 className="line-clamp-1 text-base font-semibold text-white">
            {item.model} {item.year}
          </h3>
          <p className="mt-1 flex items-center gap-1 text-xs text-white/50">
            <MapPin className="size-3" />
            {item.city}, {item.state}
          </p>
          <p className="mt-2 text-xl font-bold text-white">
            {formatPrice(item.price, item.currency)}
          </p>
          <p className="mt-1 text-xs text-white/45">
            {t("installmentFrom")}{" "}
            <span className="font-medium text-[#86efac]">
              {formatPrice(installment, item.currency)}/mes
            </span>
          </p>
        </div>

        <div className="mt-3 flex flex-wrap gap-2 text-xs text-white/55">
          <span className="flex items-center gap-1">
            <Gauge className="size-3" />
            {item.mileage.toLocaleString("pt-BR")} km
          </span>
          <span className="rounded-full bg-white/[0.06] px-2 py-0.5">{item.fuel}</span>
          <span className="rounded-full bg-white/[0.06] px-2 py-0.5">{item.transmission}</span>
        </div>

        <div className="mt-3 flex gap-2">
          <button
            type="button"
            onClick={(e) => e.preventDefault()}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-white/[0.06] py-2 text-xs font-medium text-white/70 transition-colors hover:bg-white/10 hover:text-white"
          >
            <Heart className="size-3.5" />
            {t("save")}
          </button>
          <button
            type="button"
            onClick={(e) => e.preventDefault()}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-[#22c55e]/10 py-2 text-xs font-medium text-[#86efac] transition-colors hover:bg-[#22c55e]/15"
          >
            <Zap className="size-3.5" />
            {t("simulate")}
          </button>
        </div>
      </div>
    </>
  );

  if (variant === "gallery" || variant === "compact") {
    return (
      <Link href={`/veiculos/${item.id}`} className="block">
        <article
          className={cn(
            "group overflow-hidden rounded-2xl bg-[#081128]/60 transition-all duration-300",
            highlighted
              ? "shadow-xl shadow-[#22c55e]/20 ring-2 ring-[#22c55e]/50"
              : "hover:bg-[#081128]/80 hover:shadow-xl hover:shadow-black/20",
          )}
          onMouseEnter={onHover}
          onMouseLeave={onLeave}
        >
          {cardContent}
        </article>
      </Link>
    );
  }

  return (
    <Link href={`/veiculos/${item.id}`} className="block">
      <article
        className={cn(
          "group flex flex-col overflow-hidden rounded-2xl bg-[#081128]/60 transition-all duration-300 sm:flex-row",
          highlighted
            ? "shadow-xl shadow-[#22c55e]/20 ring-2 ring-[#22c55e]/50"
            : "hover:bg-[#081128]/80 hover:shadow-xl hover:shadow-black/20",
        )}
        onMouseEnter={onHover}
        onMouseLeave={onLeave}
      >
        {cardContent}
      </article>
    </Link>
  );
}
