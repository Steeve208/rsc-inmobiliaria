"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Flag,
  Fuel,
  Gauge,
  Heart,
  MapPin,
  MessageCircle,
  RotateCw,
  Share2,
  ShieldCheck,
  Star,
  Zap,
  ChevronRight as BreadcrumbChevron,
} from "lucide-react";
import { Link } from "@/lib/i18n/routing";
import { cn } from "@/lib/utils";
import { VehicleMap } from "./vehicle-map";
import { VehicleCard } from "./vehicle-card";
import { ListingContactPanel } from "@/features/contact";
import type { VehicleDetail, VehicleListing } from "../types";

type Props = {
  vehicle: VehicleDetail;
  similar: VehicleListing[];
};

const mediaTabs = ["photos", "video", "tour360"] as const;

function formatPrice(price: number, currency: string, fractionDigits = 0) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency,
    maximumFractionDigits: fractionDigits,
    minimumFractionDigits: fractionDigits,
  }).format(price);
}

export function VehicleDetailPage({ vehicle, similar }: Props) {
  const t = useTranslations("veiculos.detail");
  const tc = useTranslations("veiculos.categories");
  const [activeImage, setActiveImage] = useState(0);
  const [mediaTab, setMediaTab] = useState<(typeof mediaTabs)[number]>("photos");
  const [expandedDesc, setExpandedDesc] = useState(false);
  const [downPct, setDownPct] = useState(20);
  const [termMonths, setTermMonths] = useState(48);
  const [interestRate, setInterestRate] = useState(1.49);

  const downPayment = Math.round(vehicle.price * (downPct / 100));
  const monthlyRate = interestRate / 100;
  const principal = vehicle.price - downPayment;
  const estimatedInstallment = useMemo(() => {
    if (monthlyRate === 0) return principal / termMonths;
    const factor = Math.pow(1 + monthlyRate, termMonths);
    return (principal * monthlyRate * factor) / (factor - 1);
  }, [principal, monthlyRate, termMonths]);

  const sidebarInstallment = Math.round(vehicle.price * 0.005);
  const sidebarDown = Math.round(vehicle.price * 0.2);

  const prevImage = () =>
    setActiveImage((i) => (i === 0 ? vehicle.images.length - 1 : i - 1));
  const nextImage = () =>
    setActiveImage((i) => (i === vehicle.images.length - 1 ? 0 : i + 1));

  return (
    <div className="mx-auto max-w-[1440px] px-4 py-6 sm:px-6 lg:px-8">
      <nav className="mb-6 flex flex-wrap items-center gap-1 text-xs text-white/45">
        <Link href="/" className="hover:text-white/70">
          {t("breadcrumbHome")}
        </Link>
        <BreadcrumbChevron className="size-3" />
        <Link href="/veiculos" className="hover:text-white/70">
          {t("breadcrumbVehicles")}
        </Link>
        <BreadcrumbChevron className="size-3" />
        <span>{tc(vehicle.type)}</span>
        <BreadcrumbChevron className="size-3" />
        <span>{vehicle.state}</span>
        <BreadcrumbChevron className="size-3" />
        <span className="text-white/70">{vehicle.make} {vehicle.model}</span>
      </nav>

      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-bold text-white sm:text-3xl">
              {vehicle.make} {vehicle.model} {vehicle.year}
            </h1>
            {vehicle.verified && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#22c55e] px-3 py-1 text-xs font-semibold text-white">
                <ShieldCheck className="size-3.5" />
                {t("verifiedBadge")}
              </span>
            )}
          </div>
          <p className="mt-2 flex flex-wrap items-center gap-2 text-sm text-white/55">
            <MapPin className="size-4 shrink-0 text-white/40" />
            {vehicle.city} - {vehicle.state}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-lg bg-[#111d2f] px-4 py-2 text-sm text-white/80 transition-colors hover:bg-white/5"
          >
            <Share2 className="size-4" />
            {t("share")}
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-lg bg-[#111d2f] px-4 py-2 text-sm text-white/80 transition-colors hover:bg-white/5"
          >
            <Heart className="size-4" />
            {t("save")}
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-lg bg-[#111d2f] px-4 py-2 text-sm text-white/80 transition-colors hover:bg-white/5"
          >
            <Flag className="size-4" />
            {t("report")}
          </button>
        </div>
      </div>

      <div className="grid gap-8 xl:grid-cols-[1fr_360px]">
        <div className="min-w-0 space-y-8">
          {/* Gallery / Video / 360 */}
          <section>
            {mediaTab === "photos" && (
              <>
                <div className="relative aspect-[16/9] overflow-hidden rounded-xl">
                  <Image
                    src={vehicle.images[activeImage] ?? vehicle.image}
                    alt={vehicle.title}
                    fill
                    priority
                    className="object-cover"
                    sizes="(max-width:1280px) 100vw, 900px"
                  />
                  <button
                    type="button"
                    onClick={prevImage}
                    className="absolute left-3 top-1/2 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm hover:bg-black/70"
                    aria-label={t("prevPhoto")}
                  >
                    <ChevronLeft className="size-5" />
                  </button>
                  <button
                    type="button"
                    onClick={nextImage}
                    className="absolute right-3 top-1/2 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm hover:bg-black/70"
                    aria-label={t("nextPhoto")}
                  >
                    <ChevronRight className="size-5" />
                  </button>
                </div>
                <div className="mt-3 grid grid-cols-6 gap-2">
                  {vehicle.images.slice(0, 6).map((src, idx) => (
                    <button
                      key={src}
                      type="button"
                      onClick={() => setActiveImage(idx)}
                      className={cn(
                        "relative aspect-[4/3] overflow-hidden rounded-lg ring-2",
                        activeImage === idx
                          ? "ring-[#22c55e]"
                          : "ring-transparent opacity-80 hover:opacity-100",
                      )}
                    >
                      <Image src={src} alt="" fill className="object-cover" sizes="120px" />
                    </button>
                  ))}
                </div>
              </>
            )}
            {mediaTab === "video" && vehicle.videoUrl && (
              <div className="aspect-video overflow-hidden rounded-xl">
                <iframe
                  src={vehicle.videoUrl}
                  title={vehicle.title}
                  className="size-full"
                  allowFullScreen
                />
              </div>
            )}
            {mediaTab === "tour360" && (
              <div className="flex aspect-[16/9] flex-col items-center justify-center gap-4 rounded-xl bg-[#111d2f]/60">
                <RotateCw className="size-12 text-[#86efac]" />
                <p className="text-sm text-white/60">{t("tour360Placeholder")}</p>
              </div>
            )}

            <div className="mt-4 flex flex-wrap gap-2">
              {mediaTabs.map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setMediaTab(tab)}
                  className={cn(
                    "rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
                    mediaTab === tab
                      ? "bg-[#22c55e] text-white"
                      : "bg-[#111d2f] text-white/60 hover:bg-white/10 hover:text-white",
                  )}
                >
                  {t(`media.${tab}`)}
                </button>
              ))}
            </div>
          </section>

          {/* Quick specs */}
          <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { icon: Calendar, label: t("year"), value: String(vehicle.year) },
              { icon: Gauge, label: t("mileage"), value: `${vehicle.mileage.toLocaleString("pt-BR")} km` },
              { icon: Fuel, label: t("fuel"), value: vehicle.fuel },
              { icon: Zap, label: t("engine"), value: vehicle.engine },
            ].map(({ icon: Icon, label, value }) => (
              <div
                key={label}
                className="rounded-xl bg-[#111d2f]/60 p-4 text-center"
              >
                <Icon className="mx-auto size-5 text-[#86efac]" />
                <p className="mt-2 text-base font-semibold text-white">{value}</p>
                <p className="text-xs text-white/45">{label}</p>
              </div>
            ))}
          </section>

          {/* Description */}
          <section className="rounded-xl bg-[#111d2f]/60 p-6">
            <h2 className="text-lg font-semibold text-white">{t("descriptionTitle")}</h2>
            <p className={cn("mt-3 text-sm leading-relaxed text-white/65", !expandedDesc && "line-clamp-3")}>
              {vehicle.description}
            </p>
            <button
              type="button"
              onClick={() => setExpandedDesc((v) => !v)}
              className="mt-3 text-sm font-medium text-[#86efac] hover:underline"
            >
              {expandedDesc ? t("readLess") : t("readMore")}
            </button>
          </section>

          {/* Ficha técnica */}
          <section className="rounded-xl bg-[#111d2f]/60 p-6">
            <h2 className="text-lg font-semibold text-white">{t("specsTitle")}</h2>
            <dl className="mt-4 grid gap-3 sm:grid-cols-2">
              {Object.entries(vehicle.specs).map(([key, value]) => (
                <div key={key} className="flex justify-between py-2 text-sm">
                  <dt className="text-white/45">{key}</dt>
                  <dd className="font-medium text-white">{value}</dd>
                </div>
              ))}
            </dl>
          </section>

          {/* Historial */}
          <section className="rounded-xl bg-[#111d2f]/60 p-6">
            <h2 className="text-lg font-semibold text-white">{t("historyTitle")}</h2>
            <ul className="mt-4 space-y-2">
              {vehicle.history.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-white/65">
                  <ShieldCheck className="mt-0.5 size-4 shrink-0 text-[#22c55e]" />
                  {item}
                </li>
              ))}
            </ul>
          </section>

          {/* Equipamiento */}
          <section className="rounded-xl bg-[#111d2f]/60 p-6">
            <h2 className="text-lg font-semibold text-white">{t("equipmentTitle")}</h2>
            <ul className="mt-4 grid gap-2 sm:grid-cols-2">
              {vehicle.equipment.map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm text-white/65">
                  <span className="size-1.5 rounded-full bg-[#22c55e]" />
                  {item}
                </li>
              ))}
            </ul>
          </section>

          {/* Consumo + Garantía + Motor */}
          <section className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl bg-[#111d2f]/60 p-5">
              <h3 className="text-sm font-semibold text-white">{t("consumptionTitle")}</h3>
              <p className="mt-2 text-sm text-white/60">{vehicle.consumption}</p>
            </div>
            <div className="rounded-xl bg-[#111d2f]/60 p-5">
              <h3 className="text-sm font-semibold text-white">{t("warrantyTitle")}</h3>
              <p className="mt-2 text-sm text-white/60">{vehicle.warranty}</p>
            </div>
            <div className="rounded-xl bg-[#111d2f]/60 p-5">
              <h3 className="text-sm font-semibold text-white">{t("engineTitle")}</h3>
              <p className="mt-2 text-sm text-white/60">{vehicle.engine} · {vehicle.transmission}</p>
            </div>
          </section>

          {/* Mapa */}
          <section className="rounded-xl bg-[#111d2f]/60 p-6">
            <h2 className="text-lg font-semibold text-white">{t("locationTitle")}</h2>
            <p className="mt-2 text-sm text-white/55">{vehicle.address}</p>
            <div className="mt-4 h-[280px] overflow-hidden rounded-xl">
              <VehicleMap items={[vehicle]} className="h-full w-full" />
            </div>
          </section>

          {/* Financiación simulator */}
          <section className="rounded-xl bg-[#111d2f]/60 p-6">
            <h2 className="text-lg font-semibold text-white">{t("simulatorTitle")}</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="text-xs text-white/45">{t("simulator.vehicleValue")}</span>
                <input
                  readOnly
                  value={formatPrice(vehicle.price, vehicle.currency)}
                  className="mt-1.5 w-full rounded-lg bg-[#0a111f] px-3 py-2.5 text-sm text-white outline-none focus:bg-[#0d1528]"
                />
              </label>
              <label className="block">
                <span className="text-xs text-white/45">{t("simulator.downPayment")}</span>
                <div className="mt-1.5 flex gap-2">
                  <input
                    readOnly
                    value={formatPrice(downPayment, vehicle.currency)}
                    className="flex-1 rounded-lg bg-[#0a111f] px-3 py-2.5 text-sm text-white outline-none focus:bg-[#0d1528]"
                  />
                  <select
                    value={downPct}
                    onChange={(e) => setDownPct(Number(e.target.value))}
                    className="rounded-lg bg-[#0a111f] px-3 py-2.5 text-sm text-white outline-none focus:bg-[#0d1528]"
                  >
                    {[10, 20, 30, 40, 50].map((p) => (
                      <option key={p} value={p}>{p}%</option>
                    ))}
                  </select>
                </div>
              </label>
              <label className="block">
                <span className="text-xs text-white/45">{t("simulator.term")}</span>
                <input
                  type="number"
                  value={termMonths}
                  onChange={(e) => setTermMonths(Number(e.target.value))}
                  className="mt-1.5 w-full rounded-lg bg-[#0a111f] px-3 py-2.5 text-sm text-white outline-none focus:bg-[#0d1528]"
                />
              </label>
              <label className="block">
                <span className="text-xs text-white/45">{t("simulator.interestRate")}</span>
                <input
                  type="number"
                  step="0.01"
                  value={interestRate}
                  onChange={(e) => setInterestRate(Number(e.target.value))}
                  className="mt-1.5 w-full rounded-lg bg-[#0a111f] px-3 py-2.5 text-sm text-white outline-none focus:bg-[#0d1528]"
                />
              </label>
            </div>
            <p className="mt-5 text-lg font-bold text-[#86efac]">
              {t("simulator.estimatedInstallment")}{" "}
              {formatPrice(estimatedInstallment, vehicle.currency)}
              {t("simulator.perMonth")}
            </p>
          </section>

          {/* Similares */}
          {similar.length > 0 && (
            <section>
              <h2 className="mb-4 text-lg font-semibold text-white">{t("similarVehicles")}</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {similar.map((item) => (
                  <VehicleCard key={item.id} item={item} variant="gallery" />
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Sidebar */}
        <aside className="space-y-4 xl:sticky xl:top-24 xl:self-start">
          <div className="rounded-xl bg-[#111d2f]/80 p-6">
            <p className="text-3xl font-bold text-white">
              {formatPrice(vehicle.price, vehicle.currency)}
            </p>
            <p className="mt-1 text-sm text-white/50">
              {t("downFrom")} {formatPrice(sidebarDown, vehicle.currency)}
            </p>
            <p className="mt-1 text-sm text-[#86efac]">
              {t("installmentsFrom")} {formatPrice(sidebarInstallment, vehicle.currency)}/mes
            </p>
            <button
              type="button"
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-[#22c55e] py-3 text-sm font-semibold text-white hover:bg-[#16a34a]"
            >
              <Zap className="size-4" />
              {t("simulateFinancing")}
            </button>
            <div className="mt-3">
              <ListingContactPanel
                listing={{
                  listingId: vehicle.id,
                  listingTitle: vehicle.title,
                  listingCategory: "vehicles",
                  companyId: vehicle.companyId,
                  companyName: vehicle.company,
                  whatsappNumber: vehicle.whatsappNumber,
                  agentName: vehicle.agent.name,
                }}
              />
            </div>
          </div>

          {/* Concesionaria */}
          <div className="rounded-xl bg-[#111d2f]/80 p-6">
            <h3 className="text-sm font-semibold text-white">{t("dealershipTitle")}</h3>
            <p className="mt-1 text-lg font-bold text-white">{vehicle.company}</p>
            <div className="mt-3 flex items-center gap-1 text-sm text-[#d4a017]">
              <Star className="size-4 fill-current" />
              {vehicle.dealershipRating} · {vehicle.dealershipReviews} {t("reviews")}
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
              <div>
                <p className="font-bold text-white">{vehicle.dealershipYears}</p>
                <p className="text-white/45">{t("years")}</p>
              </div>
              <div>
                <p className="font-bold text-white">{vehicle.dealershipActive}</p>
                <p className="text-white/45">{t("active")}</p>
              </div>
              <div>
                <p className="font-bold text-white">{vehicle.dealershipSold}</p>
                <p className="text-white/45">{t("sold")}</p>
              </div>
            </div>
            <div className="mt-5 flex items-center gap-3 pt-5">
              <Image
                src={vehicle.agent.photo}
                alt={vehicle.agent.name}
                width={48}
                height={48}
                className="size-12 rounded-full object-cover"
              />
              <div>
                <p className="font-medium text-white">{vehicle.agent.name}</p>
                <p className="text-xs text-white/45">{vehicle.agent.role}</p>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
