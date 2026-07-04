"use client";

import { useMemo, useRef, useState, useEffect } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import {
  Bath,
  BedDouble,
  Building2,
  Calendar,
  Car,
  ChevronLeft,
  ChevronRight,
  Flame,
  Flag,
  Heart,
  Home,
  MapPin,
  Maximize2,
  Share2,
  ShieldCheck,
  Star,
  UtensilsCrossed,
  WashingMachine,
  ChevronRight as BreadcrumbChevron,
} from "lucide-react";
import { Link } from "@/lib/i18n/routing";
import { cn } from "@/lib/utils";
import { VirtualTourEmbed } from "@/features/listings/components/virtual-tour-embed";
import { FloorPlanViewer } from "@/features/listings/components/floor-plan-viewer";
import { ListingContactPanel } from "@/features/contact";
import { useFavoriteButton } from "@/hooks/use-favorites";
import { isDirectVideoUrl, toVideoEmbedUrl } from "@/lib/storage/listing-media-utils";
import { shareListing } from "@/lib/listings/share-listing";
import { PropertyMap } from "./property-map";
import { PropertyCard } from "./property-card";
import { ReportListingModal } from "./report-listing-modal";
import type { PropertyDetail, PropertyListing } from "../types";

type Props = {
  property: PropertyDetail;
  similar: PropertyListing[];
  agencyListings?: PropertyListing[];
};

const mediaTabs = ["photos", "video", "tour", "floorPlan"] as const;

function formatPrice(price: number, currency: string, fractionDigits = 0) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency,
    maximumFractionDigits: fractionDigits,
    minimumFractionDigits: fractionDigits,
  }).format(price);
}

export function PropertyDetailPage({ property, similar, agencyListings = [] }: Props) {
  const t = useTranslations("imoveis.detail");
  const tc = useTranslations("imoveis.categories");
  const { active: isFavorite, handleClick: handleFavoriteClick } = useFavoriteButton(
    "property",
    property.id,
  );
  const [activeImage, setActiveImage] = useState(0);
  const [mediaTab, setMediaTab] = useState<(typeof mediaTabs)[number]>("photos");
  const [expandedDesc, setExpandedDesc] = useState(false);
  const [downPct, setDownPct] = useState(20);
  const [termMonths, setTermMonths] = useState(360);
  const [interestRate, setInterestRate] = useState(0.89);
  const [shareMessage, setShareMessage] = useState("");
  const [reportOpen, setReportOpen] = useState(false);
  const locationRef = useRef<HTMLElement>(null);

  const financingHref = `/financing?price=${property.price}&down=${downPct}&listingId=${property.id}&title=${encodeURIComponent(property.title)}&category=properties&currency=${property.currency}`;

  const downPayment = Math.round(property.price * (downPct / 100));
  const monthlyRate = interestRate / 100;
  const principal = property.price - downPayment;
  const estimatedInstallment = useMemo(() => {
    if (monthlyRate === 0) return principal / termMonths;
    const factor = Math.pow(1 + monthlyRate, termMonths);
    return (principal * monthlyRate * factor) / (factor - 1);
  }, [principal, monthlyRate, termMonths]);

  const sidebarInstallment = Math.round(property.price * 0.005);
  const sidebarDown = Math.round(property.price * 0.2);

  const characteristics = [
    { icon: Maximize2, label: t("builtArea"), value: `${property.area} m²` },
    { icon: Home, label: t("landArea"), value: `${property.landArea} m²` },
    {
      icon: BedDouble,
      label: t("suites"),
      value: String(property.suites),
    },
    {
      icon: Bath,
      label: t("bathrooms"),
      value: String(property.bathrooms ?? 0),
    },
    { icon: Car, label: t("garage"), value: String(property.garage) },
    {
      icon: Building2,
      label: t("livingRooms"),
      value: String(property.livingRooms),
    },
    { icon: UtensilsCrossed, label: t("kitchen"), value: String(property.kitchen) },
    {
      icon: WashingMachine,
      label: t("laundry"),
      value: String(property.laundry),
    },
    { icon: Flame, label: t("heating"), value: property.heating },
    {
      icon: Calendar,
      label: t("yearBuilt"),
      value: String(property.yearBuilt),
    },
  ];

  const thumbnails = property.images.slice(0, 4);
  const totalPhotos = property.images.length;
  const heroImage = property.images[activeImage] ?? property.images[0] ?? property.image;
  const videoSrc = property.videoUrl ? toVideoEmbedUrl(property.videoUrl) : "";

  const availableMediaTabs = useMemo(() => {
    const tabs: (typeof mediaTabs)[number][] = ["photos"];
    if (videoSrc) tabs.push("video");
    if (property.virtualTourUrl) tabs.push("tour");
    if (property.floorPlanUrl) tabs.push("floorPlan");
    return tabs;
  }, [videoSrc, property.virtualTourUrl, property.floorPlanUrl]);

  useEffect(() => {
    if (!availableMediaTabs.includes(mediaTab)) {
      setMediaTab("photos");
    }
  }, [availableMediaTabs, mediaTab]);

  async function handleShare() {
    const url = typeof window !== "undefined" ? window.location.href : "";
    const result = await shareListing(url, property.title);
    if (result === "copied") setShareMessage(t("shareCopied"));
    else if (result === "shared") setShareMessage(t("shareDone"));
    setTimeout(() => setShareMessage(""), 2500);
  }

  function scrollToMap() {
    locationRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  const prevImage = () =>
    setActiveImage((i) => (i === 0 ? property.images.length - 1 : i - 1));
  const nextImage = () =>
    setActiveImage((i) => (i === property.images.length - 1 ? 0 : i + 1));

  return (
    <div className="mx-auto max-w-[1440px] px-4 py-6 sm:px-6 lg:px-8">
      {/* Breadcrumbs */}
      <nav className="mb-6 flex flex-wrap items-center gap-1 text-xs text-white/45">
        <Link href="/" className="hover:text-white/70">
          {t("breadcrumbHome")}
        </Link>
        <BreadcrumbChevron className="size-3" />
        <Link href="/imoveis" className="hover:text-white/70">
          {t("breadcrumbProperties")}
        </Link>
        <BreadcrumbChevron className="size-3" />
        <span>{tc(property.type)}</span>
        <BreadcrumbChevron className="size-3" />
        <span>{property.state}</span>
        <BreadcrumbChevron className="size-3" />
        <span>{property.city}</span>
        <BreadcrumbChevron className="size-3" />
        <span className="text-white/70">{t("breadcrumbProperty")}</span>
      </nav>

      {/* Title row */}
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-bold text-white sm:text-3xl">
              {property.title}
            </h1>
            {property.verified && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#1d4ed8] px-3 py-1 text-xs font-semibold text-white">
                <ShieldCheck className="size-3.5" />
                {t("verifiedBadge")}
              </span>
            )}
          </div>
          <p className="mt-2 flex flex-wrap items-center gap-2 text-sm text-white/55">
            <MapPin className="size-4 shrink-0 text-white/40" />
            {t("neighborhoodLabel", { neighborhood: property.neighborhood })},{" "}
            {property.city} - {property.state}
            <button
              type="button"
              onClick={scrollToMap}
              className="text-[#60a5fa] hover:underline"
            >
              {t("viewOnMap")}
            </button>
          </p>
          {shareMessage ? (
            <p className="mt-2 text-xs text-emerald-400">{shareMessage}</p>
          ) : null}
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={handleShare}
            className="inline-flex items-center gap-2 rounded-lg bg-[#111d2f] px-4 py-2 text-sm text-white/80 transition-colors hover:bg-white/5"
          >
            <Share2 className="size-4" />
            {t("share")}
          </button>
          <button
            type="button"
            onClick={handleFavoriteClick}
            className={cn(
              "inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm transition-colors",
              isFavorite
                ? "bg-[#d4a017] text-[#000a1a]"
                : "bg-[#111d2f] text-white/80 hover:bg-white/5",
            )}
          >
            <Heart className={cn("size-4", isFavorite && "fill-current")} />
            {t("save")}
          </button>
          <button
            type="button"
            onClick={() => setReportOpen(true)}
            className="inline-flex items-center gap-2 rounded-lg bg-[#111d2f] px-4 py-2 text-sm text-white/80 transition-colors hover:bg-white/5"
          >
            <Flag className="size-4" />
            {t("report")}
          </button>
        </div>
      </div>

      <div className="grid gap-8 xl:grid-cols-[1fr_360px]">
        {/* Main column */}
        <div className="min-w-0 space-y-8">
          {/* Gallery / video */}
          <section>
            {mediaTab === "photos" && (
              <>
            <div className="relative aspect-[16/9] overflow-hidden rounded-xl">
              <Image
                src={heroImage}
                alt={property.title}
                fill
                priority
                className="object-cover"
                sizes="(max-width:1280px) 100vw, 900px"
              />
              <button
                type="button"
                onClick={prevImage}
                className="absolute left-3 top-1/2 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition-colors hover:bg-black/70"
                aria-label={t("prevPhoto")}
              >
                <ChevronLeft className="size-5" />
              </button>
              <button
                type="button"
                onClick={nextImage}
                className="absolute right-3 top-1/2 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition-colors hover:bg-black/70"
                aria-label={t("nextPhoto")}
              >
                <ChevronRight className="size-5" />
              </button>
            </div>

            <div className="mt-3 grid grid-cols-5 gap-2">
              {thumbnails.map((src, idx) => (
                <button
                  key={src}
                  type="button"
                  onClick={() => setActiveImage(idx)}
                  className={cn(
                    "relative aspect-[4/3] overflow-hidden rounded-lg ring-2 transition-all",
                    activeImage === idx
                      ? "ring-[#1d4ed8]"
                      : "ring-transparent opacity-80 hover:opacity-100",
                  )}
                >
                  <Image
                    src={src}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="120px"
                  />
                </button>
              ))}
              {property.images.length > 4 ? (
                <button
                  type="button"
                  className="relative aspect-[4/3] overflow-hidden rounded-lg"
                >
                  <Image
                    src={property.images[4] ?? heroImage}
                    alt=""
                    fill
                    className="object-cover brightness-50"
                    sizes="120px"
                  />
                  <span className="absolute inset-0 flex items-center justify-center text-center text-xs font-medium text-white">
                    {t("viewAllPhotos", { count: totalPhotos })}
                  </span>
                </button>
              ) : null}
            </div>
              </>
            )}

            {mediaTab === "video" && videoSrc && (
              <div className="aspect-video overflow-hidden rounded-xl bg-black">
                {isDirectVideoUrl(videoSrc) ? (
                  <video
                    src={videoSrc}
                    controls
                    className="size-full object-contain"
                    playsInline
                  />
                ) : (
                  <iframe
                    src={videoSrc}
                    title={property.title}
                    className="size-full"
                    allowFullScreen
                  />
                )}
              </div>
            )}

            {mediaTab === "video" && !videoSrc && (
              <div className="flex aspect-video items-center justify-center rounded-xl bg-[#111d2f]/60 text-sm text-white/50">
                {t("media.noVideo")}
              </div>
            )}

            {mediaTab === "tour" && property.virtualTourUrl ? (
              <VirtualTourEmbed url={property.virtualTourUrl} title={property.title} />
            ) : null}

            {mediaTab === "floorPlan" && property.floorPlanUrl ? (
              <FloorPlanViewer url={property.floorPlanUrl} title={property.title} />
            ) : null}

            <div className="mt-4 flex flex-wrap gap-2">
              {availableMediaTabs.map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setMediaTab(tab)}
                  className={cn(
                    "rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
                    mediaTab === tab
                      ? "bg-[#1d4ed8] text-white"
                      : "bg-[#111d2f] text-white/60 hover:bg-white/10 hover:text-white",
                  )}
                >
                  {t(`media.${tab}`)}
                </button>
              ))}
            </div>
          </section>

          {/* Description */}
          <section className="rounded-xl bg-[#111d2f]/60 p-6">
            <h2 className="text-lg font-semibold text-white">
              {t("descriptionTitle")}
            </h2>
            {property.description ? (
              <>
                <p
                  className={cn(
                    "mt-3 text-sm leading-relaxed text-white/65",
                    !expandedDesc && "line-clamp-3",
                  )}
                >
                  {property.description}
                </p>
                <button
                  type="button"
                  onClick={() => setExpandedDesc((v) => !v)}
                  className="mt-3 text-sm font-medium text-[#60a5fa] hover:underline"
                >
                  {expandedDesc ? t("readLess") : t("readMore")}
                </button>
              </>
            ) : (
              <p className="mt-3 text-sm text-white/45">{t("noDescription")}</p>
            )}
          </section>

          {/* Characteristics */}
          <section className="rounded-xl bg-[#111d2f]/60 p-6">
            <h2 className="text-lg font-semibold text-white">
              {t("featuresTitle")}
            </h2>
            <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
              {characteristics.map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex flex-col gap-1">
                  <Icon className="size-5 text-[#60a5fa]" />
                  <span className="text-base font-semibold text-white">
                    {value}
                  </span>
                  <span className="text-xs text-white/45">{label}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Location */}
          <section ref={locationRef} className="rounded-xl bg-[#111d2f]/60 p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-lg font-semibold text-white">
                {t("locationTitle")}
              </h2>
              <button
                type="button"
                onClick={scrollToMap}
                className="text-sm text-[#60a5fa] hover:underline"
              >
                {t("viewOnMap")}
              </button>
            </div>
            <p className="mt-2 text-sm text-white/55">{property.address}</p>
            <div className="mt-4 h-[280px] overflow-hidden rounded-xl">
              <PropertyMap items={[property]} className="h-full w-full" />
            </div>
          </section>

          {/* Financing simulator */}
          <section className="rounded-xl bg-[#111d2f]/60 p-6">
            <h2 className="text-lg font-semibold text-white">
              {t("simulatorTitle")}
            </h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="text-xs text-white/45">
                  {t("simulator.propertyValue")}
                </span>
                <input
                  readOnly
                  value={formatPrice(property.price, property.currency)}
                  className="mt-1.5 w-full rounded-lg bg-[#0a111f] px-3 py-2.5 text-sm text-white outline-none focus:bg-[#0d1528]"
                />
              </label>
              <label className="block">
                <span className="text-xs text-white/45">
                  {t("simulator.downPayment")}
                </span>
                <div className="mt-1.5 flex gap-2">
                  <input
                    readOnly
                    value={formatPrice(downPayment, property.currency)}
                    className="flex-1 rounded-lg bg-[#0a111f] px-3 py-2.5 text-sm text-white outline-none focus:bg-[#0d1528]"
                  />
                  <select
                    value={downPct}
                    onChange={(e) => setDownPct(Number(e.target.value))}
                    className="rounded-lg bg-[#0a111f] px-3 py-2.5 text-sm text-white outline-none focus:bg-[#0d1528]"
                  >
                    {[10, 20, 30, 40, 50].map((p) => (
                      <option key={p} value={p}>
                        {p}%
                      </option>
                    ))}
                  </select>
                </div>
              </label>
              <label className="block">
                <span className="text-xs text-white/45">
                  {t("simulator.term")}
                </span>
                <input
                  type="number"
                  value={termMonths}
                  onChange={(e) => setTermMonths(Number(e.target.value))}
                  className="mt-1.5 w-full rounded-lg bg-[#0a111f] px-3 py-2.5 text-sm text-white outline-none focus:bg-[#0d1528]"
                />
              </label>
              <label className="block">
                <span className="text-xs text-white/45">
                  {t("simulator.interestRate")}
                </span>
                <input
                  type="number"
                  step="0.01"
                  value={interestRate}
                  onChange={(e) => setInterestRate(Number(e.target.value))}
                  className="mt-1.5 w-full rounded-lg bg-[#0a111f] px-3 py-2.5 text-sm text-white outline-none focus:bg-[#0d1528]"
                />
              </label>
            </div>
            <div className="mt-5 flex flex-wrap items-center justify-between gap-4 rounded-lg bg-[#1d4ed8]/10 px-4 py-3">
              <span className="text-sm text-white/70">
                {t("simulator.estimatedInstallment")}
              </span>
              <span className="text-xl font-bold text-white">
                {formatPrice(estimatedInstallment, property.currency, 2)}
                {t("simulator.perMonth")}
              </span>
            </div>
            <Link
              href={financingHref}
              className="mt-4 flex w-full items-center justify-center rounded-md bg-[#d4a017] px-4 py-2 text-sm font-semibold text-[#0a111f] transition-colors hover:bg-[#eebc49]"
            >
              {t("simulateNow")}
            </Link>
          </section>
        </div>

        {/* Sidebar */}
        <aside className="space-y-5 xl:sticky xl:top-24 xl:self-start">
          {/* Price card */}
          <div className="rounded-xl bg-[#111d2f] p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-white/40">
              {t("salePrice")}
            </p>
            <p className="mt-1 text-3xl font-bold text-white">
              {formatPrice(property.price, property.currency)}
            </p>
            <div className="mt-4 space-y-2 pt-4 text-sm">
              <div className="flex justify-between text-white/55">
                <span>{t("condoFee")}</span>
                <span className="text-white">
                  {formatPrice(property.condoFee, property.currency, 2)}
                </span>
              </div>
              <div className="flex justify-between text-white/55">
                <span>{t("iptu")}</span>
                <span className="text-white">
                  {formatPrice(property.iptu, property.currency, 2)}
                </span>
              </div>
            </div>
          </div>

          {/* Financing estimate */}
          <div className="rounded-xl bg-[#111d2f] p-5">
            <p className="text-sm text-white/55">
              {t("downFrom")}{" "}
              <span className="font-semibold text-white">
                {formatPrice(sidebarDown, property.currency)}
              </span>
            </p>
            <p className="mt-1 text-sm text-white/55">
              {t("installmentsFrom")}{" "}
              <span className="font-semibold text-white">
                {formatPrice(sidebarInstallment, property.currency)}
                {t("simulator.perMonth")}
              </span>
            </p>
            <Link
              href={financingHref}
              className="mt-4 flex w-full items-center justify-center rounded-md bg-[#d4a017] px-4 py-2 text-sm font-semibold text-[#0a111f] transition-colors hover:bg-[#eebc49]"
            >
              {t("simulateFinancing")}
            </Link>
          </div>

          {/* Contact */}
          <div className="rounded-xl bg-[#111d2f] p-5">
            <ListingContactPanel
              listing={{
                listingId: property.id,
                listingTitle: property.title,
                listingCategory: "properties",
                companyId: property.companyId,
                companyName: property.company,
                whatsappNumber: property.whatsappNumber,
                agentName: property.agent?.name,
              }}
            />
          </div>

          {/* Agency */}
          <div className="rounded-xl bg-[#111d2f] p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-white/40">
              {t("agency")}
            </p>
            <div className="mt-3 flex items-center gap-3">
              {property.companyLogoUrl ? (
                <div className="relative size-12 overflow-hidden rounded-lg">
                  <Image
                    src={property.companyLogoUrl}
                    alt={property.company}
                    fill
                    className="object-cover"
                    sizes="48px"
                  />
                </div>
              ) : (
                <div className="flex size-12 items-center justify-center rounded-lg bg-[#1d4ed8] text-sm font-bold text-white">
                  {property.company.slice(0, 3).toUpperCase()}
                </div>
              )}
              <div>
                <p className="font-semibold text-white">{property.company}</p>
                <div className="flex items-center gap-1 text-sm text-[#eebc49]">
                  <Star className="size-3.5 fill-current" />
                  {property.agencyRating > 0 ? property.agencyRating.toFixed(1) : "—"}
                  {property.agencyYears > 0 ? (
                    <span className="text-white/40">
                      · {t("yearsInMarket", { years: property.agencyYears })}
                    </span>
                  ) : null}
                </div>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
              <div className="rounded-lg bg-[#0a111f] px-2 py-2">
                <p className="font-bold text-white">{property.agencyActive}</p>
                <p className="text-white/40">{t("activeListings")}</p>
              </div>
              <div className="rounded-lg bg-[#0a111f] px-2 py-2">
                <p className="font-bold text-white">{property.agencySold}</p>
                <p className="text-white/40">{t("sold")}</p>
              </div>
              <div className="rounded-lg bg-[#0a111f] px-2 py-2">
                <p className="font-bold text-white">{property.agencyReviews}</p>
                <p className="text-white/40">{t("reviews")}</p>
              </div>
            </div>
          </div>

          {property.agent ? (
            <div className="rounded-xl bg-[#111d2f] p-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-white/40">
                {t("agent")}
              </p>
              <div className="mt-3 flex items-center gap-3">
                <div className="relative size-12 overflow-hidden rounded-full">
                  <Image
                    src={property.agent.photo}
                    alt={property.agent.name}
                    fill
                    className="object-cover"
                    sizes="48px"
                  />
                </div>
                <div>
                  <p className="font-semibold text-white">{property.agent.name}</p>
                  {property.agent.role ? (
                    <p className="text-xs text-white/45">{property.agent.role}</p>
                  ) : null}
                  {property.agent.creci ? (
                    <p className="text-xs text-white/35">CRECI {property.agent.creci}</p>
                  ) : null}
                </div>
              </div>
            </div>
          ) : null}

          {agencyListings.length > 0 ? (
            <div className="rounded-xl bg-[#111d2f] p-5">
              <p className="text-sm font-semibold text-white">{t("otherProperties")}</p>
              <div className="mt-3 flex gap-3 overflow-x-auto pb-1">
                {agencyListings.map((item) => (
                  <Link
                    key={item.id}
                    href={`/imoveis/${item.id}`}
                    className="block w-[140px] shrink-0"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover"
                        sizes="140px"
                      />
                    </div>
                    <p className="mt-1.5 truncate text-xs text-white/70">{item.title}</p>
                    <p className="text-xs font-bold text-white">
                      {formatPrice(item.price, item.currency)}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          ) : null}
        </aside>
      </div>

      {/* Similar properties */}
      {similar.length > 0 && (
        <section className="mt-16 pt-12">
          <h2 className="text-xl font-bold text-white">
            {t("similarProperties")}
          </h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {similar.map((item) => (
              <PropertyCard key={item.id} item={item} variant="gallery" />
            ))}
          </div>
        </section>
      )}

      <ReportListingModal
        open={reportOpen}
        onClose={() => setReportOpen(false)}
        listingId={property.id}
        listingTitle={property.title}
      />
    </div>
  );
}
