"use client";

import { useMemo, useRef, useState, useEffect, Suspense } from "react";
import Image from "next/image";
import { ListingImage } from "@/components/listing-image";
import { ListingVideo } from "@/components/listing-video";
import { useTranslations } from "next-intl";
import {
  AirVent,
  Bath,
  BedDouble,
  Car,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Dumbbell,
  Eye,
  Fence,
  Heart,
  MapPin,
  Maximize2,
  Share2,
  ShieldCheck,
  Shirt,
  Sofa,
  Sparkles,
  Star,
  Trees,
  UtensilsCrossed,
  Waves,
  Wifi,
  X,
  Calendar,
} from "lucide-react";
import { Link } from "@/lib/i18n/routing";
import { ListingCodeBadge } from "@/components/marketplace/listing-code-badge";
import { MarketplaceFooter } from "@/components/marketplace/marketplace-footer";
import { cn } from "@/lib/utils";
import { useMarket } from "@/lib/providers/market-provider";
import { VirtualTourEmbed } from "@/features/listings/components/virtual-tour-embed";
import { FloorPlanViewer } from "@/features/listings/components/floor-plan-viewer";
import { ListingContactPanel } from "@/features/contact";
import { useFavoriteButton } from "@/hooks/use-favorites";
import { shareListing } from "@/lib/listings/share-listing";
import { PropertyMapLazy } from "./property-map-lazy";
import { PropertyCard } from "./property-card";
import { ReportListingModal } from "./report-listing-modal";
import { PropertyMatchPanel } from "@/features/match";
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

export function PropertyDetailPage({
  property,
  similar,
  agencyListings = [],
}: Props) {
  const t = useTranslations("imoveis.detail");
  const { market } = useMarket();
  const { active: isFavorite, handleClick: handleFavoriteClick } =
    useFavoriteButton("property", property.id);
  const [activeImage, setActiveImage] = useState(0);
  const [mediaTab, setMediaTab] = useState<(typeof mediaTabs)[number]>("photos");
  const [expandedDesc, setExpandedDesc] = useState(false);
  const [downPct, setDownPct] = useState(20);
  const [termYears, setTermYears] = useState(30);
  const [lightbox, setLightbox] = useState(false);
  const [shareMessage, setShareMessage] = useState("");
  const [reportOpen, setReportOpen] = useState(false);
  const locationRef = useRef<HTMLElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);

  const termMonths = termYears * 12;
  const interestRate = 0.89;
  const financingHref = `/financing?price=${property.price}&down=${downPct}&listingId=${property.id}&title=${encodeURIComponent(property.title)}&category=properties&currency=${property.currency}&companyId=${encodeURIComponent(property.companyId)}`;

  const downPayment = Math.round(property.price * (downPct / 100));
  const monthlyRate = interestRate / 100;
  const principal = property.price - downPayment;
  const estimatedInstallment = useMemo(() => {
    if (monthlyRate === 0) return principal / termMonths;
    const factor = Math.pow(1 + monthlyRate, termMonths);
    return (principal * monthlyRate * factor) / (factor - 1);
  }, [principal, monthlyRate, termMonths]);

  const heroImage =
    property.images[activeImage] ?? property.images[0] ?? property.image;
  const videoSrc = property.videoUrl?.trim() ?? "";
  const thumbs = property.images.slice(0, 7);

  const availableMediaTabs = useMemo(() => {
    const tabs: (typeof mediaTabs)[number][] = ["photos"];
    if (videoSrc) tabs.push("video");
    if (property.virtualTourUrl) tabs.push("tour");
    if (property.floorPlanUrl) tabs.push("floorPlan");
    return tabs;
  }, [videoSrc, property.virtualTourUrl, property.floorPlanUrl]);

  useEffect(() => {
    if (!availableMediaTabs.includes(mediaTab)) setMediaTab("photos");
  }, [availableMediaTabs, mediaTab]);

  useEffect(() => {
    if (!lightbox) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setLightbox(false);
      if (event.key === "ArrowLeft") {
        setActiveImage((i) =>
          i === 0 ? Math.max(property.images.length - 1, 0) : i - 1,
        );
      }
      if (event.key === "ArrowRight") {
        setActiveImage((i) =>
          i === property.images.length - 1 ? 0 : i + 1,
        );
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox, property.images.length]);

  const quickSpecs = [
    {
      icon: BedDouble,
      label: t("bedrooms"),
      value: String(property.bedrooms || property.suites || 0),
    },
    {
      icon: Bath,
      label: t("bathrooms"),
      value: String(property.bathrooms ?? 0),
    },
    {
      icon: Maximize2,
      label: t("area"),
      value: `${property.area} m²`,
    },
    {
      icon: Car,
      label: t("garage"),
      value: String(property.garage ?? 0),
    },
    {
      icon: Calendar,
      label: t("yearBuilt"),
      value: String(property.yearBuilt || "—"),
    },
  ];

  const amenities = [
    {
      icon: AirVent,
      label: t("amenities.ac"),
      on: property.heating?.toLowerCase().includes("ar") || true,
    },
    { icon: Waves, label: t("amenities.balcony"), on: true },
    { icon: Shirt, label: t("amenities.wardrobes"), on: true },
    { icon: Waves, label: t("amenities.pool"), on: property.pool },
    { icon: Dumbbell, label: t("amenities.gym"), on: property.premium },
    { icon: Car, label: t("amenities.parking"), on: (property.garage ?? 0) > 0 },
    { icon: Wifi, label: t("amenities.wifi"), on: true },
    { icon: Fence, label: t("amenities.security"), on: property.verified },
    { icon: Trees, label: t("amenities.garden"), on: (property.landArea ?? 0) > property.area },
    { icon: UtensilsCrossed, label: t("amenities.kitchen"), on: (property.kitchen ?? 0) > 0 },
    { icon: Sofa, label: t("amenities.furnished"), on: property.condition === "new" },
    { icon: Sparkles, label: t("amenities.laundry"), on: (property.laundry ?? 0) > 0 },
  ].filter((item) => item.on);

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

  function scrollToContact() {
    contactRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function prevImage() {
    setActiveImage((i) =>
      i === 0 ? Math.max(property.images.length - 1, 0) : i - 1,
    );
  }

  function nextImage() {
    setActiveImage((i) =>
      i === property.images.length - 1 ? 0 : i + 1,
    );
  }

  const contactListing = {
    listingId: property.id,
    listingTitle: property.title,
    listingCategory: "properties" as const,
    companyId: property.companyId,
    companyName: property.company,
    whatsappNumber: property.whatsappNumber,
    agentName: property.agent?.name,
  };

  return (
    <div className="bg-[#F4F7FA] text-[#0B1220]">
      <div className="rk-container py-4 pb-28 lg:pb-10">
        <nav className="mb-4 flex flex-wrap items-center gap-1 text-xs text-[#6B7285]">
          <Link href="/" className="hover:text-[#EBAD5B]">
            {t("breadcrumbHome")}
          </Link>
          <span className="mx-1">›</span>
          <Link href="/imoveis" className="hover:text-[#EBAD5B]">
            {t("breadcrumbProperties")}
          </Link>
          <span className="mx-1">›</span>
          <span>{property.city}</span>
          <span className="mx-1">›</span>
          <span>{property.neighborhood}</span>
          <span className="mx-1">›</span>
          <span className="line-clamp-1 text-[#0B1220]/70">{property.title}</span>
        </nav>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px] xl:grid-cols-[minmax(0,1fr)_340px]">
          {/* Main */}
          <div className="min-w-0 space-y-6">
            {/* Gallery */}
            <section>
              {mediaTab === "photos" ? (
                <>
                  <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-[#0B1220]">
                    <ListingImage
                      src={heroImage}
                      alt={property.title}
                      fill
                      priority
                      variant="hero"
                      className="object-cover"
                    />
                    {property.featured || property.premium ? (
                      <span className="absolute left-3 top-3 rounded-md bg-[#059669] px-2.5 py-1 text-[11px] font-bold text-white">
                        {t("topRated")}
                      </span>
                    ) : null}
                    <div className="absolute right-3 top-3 flex gap-2">
                      <button
                        type="button"
                        onClick={handleFavoriteClick}
                        className={cn(
                          "inline-flex size-9 items-center justify-center rounded-full backdrop-blur-md",
                          isFavorite
                            ? "bg-[#EBAD5B] text-[#1A1205]"
                            : "bg-white/90 text-[#0B1220]",
                        )}
                        aria-label={t("save")}
                      >
                        <Heart
                          className={cn("size-4", isFavorite && "fill-current")}
                        />
                      </button>
                      <button
                        type="button"
                        onClick={handleShare}
                        className="inline-flex size-9 items-center justify-center rounded-full bg-white/90 text-[#0B1220]"
                        aria-label={t("share")}
                      >
                        <Share2 className="size-4" />
                      </button>
                    </div>
                    <span className="absolute bottom-3 left-3 rounded-md bg-black/55 px-2.5 py-1 text-xs font-semibold text-white">
                      {activeImage + 1} / {Math.max(property.images.length, 1)}
                    </span>
                    {property.images.length > 1 ? (
                      <>
                        <button
                          type="button"
                          onClick={prevImage}
                          className="absolute left-3 top-1/2 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/45 text-white hover:bg-black/65"
                          aria-label={t("prevPhoto")}
                        >
                          <ChevronLeft className="size-5" />
                        </button>
                        <button
                          type="button"
                          onClick={nextImage}
                          className="absolute right-3 top-1/2 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/45 text-white hover:bg-black/65"
                          aria-label={t("nextPhoto")}
                        >
                          <ChevronRight className="size-5" />
                        </button>
                      </>
                    ) : null}
                  </div>

                  {thumbs.length > 1 ? (
                    <div className="mt-2 flex gap-2 overflow-x-auto pb-1">
                      {thumbs.map((src, idx) => (
                        <button
                          key={`${src}-${idx}`}
                          type="button"
                          onClick={() => setActiveImage(idx)}
                          className={cn(
                            "relative h-16 w-24 shrink-0 overflow-hidden rounded-lg ring-2 transition",
                            activeImage === idx
                              ? "ring-[#EBAD5B]"
                              : "ring-transparent opacity-80 hover:opacity-100",
                          )}
                        >
                          <ListingImage
                            src={src}
                            alt=""
                            fill
                            variant="thumb"
                            className="object-cover"
                          />
                        </button>
                      ))}
                      {property.images.length > 7 ? (
                        <button
                          type="button"
                          onClick={() => setLightbox(true)}
                          className="relative flex h-16 w-24 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-[#0B1220] text-xs font-bold text-white"
                        >
                          <ListingImage
                            src={property.images[7] ?? heroImage}
                            alt=""
                            fill
                            variant="thumb"
                            className="object-cover opacity-40"
                          />
                          <span className="relative z-10">
                            +{property.images.length - 7}
                          </span>
                        </button>
                      ) : null}
                    </div>
                  ) : null}
                </>
              ) : null}

              {mediaTab === "video" && videoSrc ? (
                <ListingVideo url={videoSrc} title={property.title} />
              ) : null}
              {mediaTab === "tour" && property.virtualTourUrl ? (
                <VirtualTourEmbed
                  url={property.virtualTourUrl}
                  title={property.title}
                />
              ) : null}
              {mediaTab === "floorPlan" && property.floorPlanUrl ? (
                <FloorPlanViewer
                  url={property.floorPlanUrl}
                  title={property.title}
                />
              ) : null}

              {availableMediaTabs.length > 1 ? (
                <div className="mt-3 flex flex-wrap gap-2">
                  {availableMediaTabs.map((tab) => (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => setMediaTab(tab)}
                      className={cn(
                        "rounded-full px-3.5 py-1.5 text-xs font-semibold",
                        mediaTab === tab
                          ? "bg-[#0B1220] text-white"
                          : "bg-white text-[#4B5563] ring-1 ring-[#E5E7EB]",
                      )}
                    >
                      {t(`media.${tab}`)}
                    </button>
                  ))}
                </div>
              ) : null}
              {shareMessage ? (
                <p className="mt-2 text-xs text-[#059669]">{shareMessage}</p>
              ) : null}
            </section>

            {/* Header */}
            <section className="rounded-xl bg-white p-5 ring-1 ring-black/[0.04] sm:p-6">
              {property.verified ? (
                <p className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#059669]">
                  <CheckCircle2 className="size-4" />
                  {t("verified")}
                </p>
              ) : null}
              <h1 className="rk-display mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
                {property.title}
              </h1>
              <button
                type="button"
                onClick={scrollToMap}
                className="mt-2 inline-flex items-center gap-1.5 text-sm text-[#6B7285] hover:text-[#EBAD5B]"
              >
                <MapPin className="size-4 text-[#EBAD5B]" />
                {property.neighborhood}, {property.city}, {property.state}
                {property.country ? `, ${property.country}` : ""}
              </button>
              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#6B7285]">
                <span className="inline-flex items-center gap-1 font-semibold text-[#0B1220]">
                  <Star className="size-3.5 fill-[#EBAD5B] text-[#EBAD5B]" />
                  {property.agencyRating?.toFixed(1) || "4.8"}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Eye className="size-3.5" />
                  {t("viewsLabel", { count: 1250 })}
                </span>
                <ListingCodeBadge
                  id={property.id}
                  code={property.code}
                  kind="property"
                  className="bg-[#F3F4F6] text-[#4B5563]"
                />
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3 border-t border-[#EEF2F7] pt-5 sm:grid-cols-5">
                {quickSpecs.map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-center gap-2.5">
                    <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#F4F7FA] text-[#0B1220]">
                      <Icon className="size-4" strokeWidth={1.8} />
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-bold leading-tight">{value}</p>
                      <p className="text-[11px] text-[#6B7285]">{label}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <Suspense fallback={null}>
              <PropertyMatchPanel property={property} />
            </Suspense>

            {/* Description */}
            <section className="rounded-xl bg-white p-5 ring-1 ring-black/[0.04] sm:p-6">
              <h2 className="rk-display text-lg font-bold">{t("descriptionTitle")}</h2>
              {property.description ? (
                <>
                  <p
                    className={cn(
                      "mt-3 text-sm leading-relaxed text-[#4B5563]",
                      !expandedDesc && "line-clamp-4",
                    )}
                  >
                    {property.description}
                  </p>
                  <button
                    type="button"
                    onClick={() => setExpandedDesc((v) => !v)}
                    className="mt-2 text-sm font-semibold text-[#2563EB] hover:underline"
                  >
                    {expandedDesc ? t("readLess") : t("showMore")}
                  </button>
                </>
              ) : (
                <p className="mt-3 text-sm text-[#6B7285]">{t("noDescription")}</p>
              )}
            </section>

            {/* Amenities */}
            {amenities.length > 0 ? (
              <section className="rounded-xl bg-white p-5 ring-1 ring-black/[0.04] sm:p-6">
                <h2 className="rk-display text-lg font-bold">
                  {t("amenitiesTitle")}
                </h2>
                <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                  {amenities.map(({ icon: Icon, label }) => (
                    <div
                      key={label}
                      className="flex items-center gap-2.5 text-sm text-[#374151]"
                    >
                      <Icon className="size-4 shrink-0 text-[#0B1220]" strokeWidth={1.7} />
                      {label}
                    </div>
                  ))}
                </div>
              </section>
            ) : null}

            {/* Location */}
            <section
              ref={locationRef}
              className="rounded-xl bg-white p-5 ring-1 ring-black/[0.04] sm:p-6"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="rk-display text-lg font-bold">
                  {t("locationTitle")}
                </h2>
                <button
                  type="button"
                  onClick={scrollToMap}
                  className="text-sm font-semibold text-[#2563EB] hover:underline"
                >
                  {t("viewOnMap")}
                </button>
              </div>
              <p className="mt-2 text-sm text-[#6B7285]">{property.address}</p>
              <div className="mt-4 h-[280px] overflow-hidden rounded-xl">
                <PropertyMapLazy
                  items={[property]}
                  theme="light"
                  className="h-full w-full"
                />
              </div>
            </section>

            {/* About advertiser */}
            <section className="rounded-xl bg-white p-5 ring-1 ring-black/[0.04] sm:p-6">
              <h2 className="rk-display text-lg font-bold">
                {t("aboutAdvertiser")}
              </h2>
              <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative size-14 overflow-hidden rounded-full bg-[#0B1220]">
                    {property.companyLogoUrl ? (
                      <Image
                        src={property.companyLogoUrl}
                        alt={property.company}
                        fill
                        className="object-cover"
                        sizes="56px"
                      />
                    ) : (
                      <span className="flex size-full items-center justify-center text-sm font-bold text-[#EBAD5B]">
                        {property.company.slice(0, 2).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div>
                    <p className="flex items-center gap-1.5 font-bold">
                      {property.company}
                      {property.verified ? (
                        <ShieldCheck className="size-4 text-[#2563EB]" />
                      ) : null}
                    </p>
                    <p className="text-xs text-[#6B7285]">
                      {t("yearsInMarket", {
                        years: property.agencyYears || 3,
                      })}
                    </p>
                    <p className="mt-1 flex flex-wrap gap-3 text-xs text-[#6B7285]">
                      <span className="inline-flex items-center gap-1">
                        <Star className="size-3 fill-[#EBAD5B] text-[#EBAD5B]" />
                        {property.agencyRating?.toFixed(1) || "4.9"}
                      </span>
                      <span>
                        {t("activeListingsCount", {
                          count: property.agencyActive || agencyListings.length || 1,
                        })}
                      </span>
                      <span>{t("onlineNow")}</span>
                    </p>
                  </div>
                </div>
                <Link
                  href="/corredores"
                  className="inline-flex h-10 items-center justify-center rounded-lg border border-[#D1D5DB] px-4 text-sm font-semibold hover:border-[#EBAD5B]"
                >
                  {t("viewProfile")}
                </Link>
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
            <div
              ref={contactRef}
              className="rounded-xl bg-white p-5 ring-1 ring-black/[0.04]"
            >
              <p className="rk-display text-2xl font-bold tracking-tight sm:text-3xl">
                {formatPrice(property.price, property.currency)}
              </p>
              <p className="mt-1 text-sm text-[#6B7285]">
                {property.bedrooms} {t("bedrooms")} · {property.bathrooms ?? 0}{" "}
                {t("bathrooms")} · {property.area} m²
              </p>
              <p className="mt-1 text-xs text-[#6B7285]">
                {t("condoFee")}:{" "}
                {formatPrice(property.condoFee, property.currency, 2)} /{" "}
                {t("perMonth")}
              </p>
              <div className="mt-4">
                <ListingContactPanel
                  listing={contactListing}
                  variant="light"
                  mode="property"
                />
              </div>
            </div>

            {market.creditAvailable ? (
              <div className="rounded-xl bg-white p-5 ring-1 ring-black/[0.04]">
                <p className="text-sm font-bold">{t("mortgageTitle")}</p>
                <p className="mt-2 text-xl font-bold text-[#0B1220]">
                  {formatPrice(estimatedInstallment, property.currency, 0)}
                  <span className="text-sm font-medium text-[#6B7285]">
                    {t("simulator.perMonth")}
                  </span>
                </p>
                <label className="mt-4 block">
                  <span className="flex justify-between text-xs text-[#6B7285]">
                    <span>{t("simulator.downPayment")}</span>
                    <span className="font-semibold text-[#0B1220]">{downPct}%</span>
                  </span>
                  <input
                    type="range"
                    min={10}
                    max={50}
                    step={5}
                    value={downPct}
                    onChange={(e) => setDownPct(Number(e.target.value))}
                    className="mt-2 w-full accent-[#EBAD5B]"
                  />
                  <span className="mt-1 block text-xs text-[#6B7285]">
                    {formatPrice(downPayment, property.currency)}
                  </span>
                </label>
                <label className="mt-3 block">
                  <span className="text-xs text-[#6B7285]">
                    {t("loanTerm")}
                  </span>
                  <select
                    value={termYears}
                    onChange={(e) => setTermYears(Number(e.target.value))}
                    className="mt-1.5 h-10 w-full rounded-lg border border-[#E5E7EB] bg-white px-3 text-sm outline-none focus:border-[#EBAD5B]"
                  >
                    {[10, 15, 20, 25, 30].map((years) => (
                      <option key={years} value={years}>
                        {t("loanTermYears", { years })}
                      </option>
                    ))}
                  </select>
                </label>
                <Link
                  href={financingHref}
                  className="mt-4 inline-flex text-sm font-semibold text-[#2563EB] hover:underline"
                >
                  {t("viewFinancingOptions")}
                </Link>
              </div>
            ) : null}

            <div className="overflow-hidden rounded-xl bg-white ring-1 ring-black/[0.04]">
              <div className="h-40">
                <PropertyMapLazy
                  items={[property]}
                  theme="light"
                  className="h-full w-full"
                />
              </div>
              <div className="p-3">
                <p className="line-clamp-2 text-xs text-[#6B7285]">
                  {property.address}
                </p>
                <button
                  type="button"
                  onClick={scrollToMap}
                  className="mt-1 text-xs font-semibold text-[#2563EB] hover:underline"
                >
                  {t("viewLargerMap")}
                </button>
              </div>
            </div>

            <div className="rounded-xl bg-white p-5 ring-1 ring-black/[0.04]">
              <div className="flex items-center gap-3">
                <div className="relative size-12 overflow-hidden rounded-full bg-[#0B1220]">
                  {property.companyLogoUrl ? (
                    <Image
                      src={property.companyLogoUrl}
                      alt={property.company}
                      fill
                      className="object-cover"
                      sizes="48px"
                    />
                  ) : (
                    <span className="flex size-full items-center justify-center text-xs font-bold text-[#EBAD5B]">
                      {property.company.slice(0, 2).toUpperCase()}
                    </span>
                  )}
                </div>
                <div className="min-w-0">
                  <p className="flex items-center gap-1 truncate font-bold">
                    {property.company}
                    {property.verified ? (
                      <ShieldCheck className="size-3.5 shrink-0 text-[#2563EB]" />
                    ) : null}
                  </p>
                  <p className="text-xs text-[#6B7285]">
                    <Star className="mr-1 inline size-3 fill-[#EBAD5B] text-[#EBAD5B]" />
                    {property.agencyRating?.toFixed(1) || "4.9"}
                  </p>
                </div>
              </div>
              {property.companyInfo?.phone ? (
                <p className="mt-3 text-xs text-[#6B7285]">
                  {property.companyInfo.phone}
                </p>
              ) : null}
              <Link
                href="/imoveis"
                className="mt-4 inline-flex h-10 w-full items-center justify-center rounded-lg border border-[#D1D5DB] text-sm font-semibold hover:border-[#EBAD5B]"
              >
                {t("viewAllListings")}
              </Link>
            </div>
          </aside>
        </div>

        {/* Similar */}
        {similar.length > 0 ? (
          <section className="mt-10">
            <div className="mb-4 flex items-end justify-between gap-3">
              <h2 className="rk-display text-xl font-bold">
                {t("similarProperties")}
              </h2>
              <Link
                href="/imoveis"
                className="text-sm font-semibold text-[#2563EB] hover:underline"
              >
                {t("viewAll")}
              </Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {similar.slice(0, 4).map((item) => (
                <PropertyCard key={item.id} item={item} variant="gallery" />
              ))}
            </div>
          </section>
        ) : null}
      </div>

      {/* Sticky mobile/desktop CTA bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[#E5E7EB] bg-white/95 backdrop-blur-md lg:hidden">
        <div className="rk-container flex items-center justify-between gap-3 py-2.5">
          <div className="min-w-0">
            <p className="text-sm font-bold">
              {formatPrice(property.price, property.currency)}
            </p>
            <p className="truncate text-[11px] text-[#6B7285]">
              {property.title}
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={handleFavoriteClick}
              className="inline-flex size-10 items-center justify-center rounded-lg border border-[#E5E7EB]"
              aria-label={t("save")}
            >
              <Heart
                className={cn("size-4", isFavorite && "fill-[#EBAD5B] text-[#EBAD5B]")}
              />
            </button>
            <button
              type="button"
              onClick={scrollToContact}
              className="inline-flex h-10 items-center rounded-lg bg-[#EBAD5B] px-4 text-sm font-bold text-[#1A1205]"
            >
              {t("contactAdvertiser")}
            </button>
          </div>
        </div>
      </div>

      {/* Desktop sticky bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 hidden border-t border-[#E5E7EB] bg-white/95 backdrop-blur-md lg:block">
        <div className="rk-container flex items-center justify-between gap-4 py-3">
          <div className="min-w-0">
            <p className="text-base font-bold">
              {formatPrice(property.price, property.currency)}
            </p>
            <p className="truncate text-sm text-[#6B7285]">{property.title}</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleFavoriteClick}
              className="inline-flex h-10 items-center gap-2 rounded-lg border border-[#E5E7EB] px-3 text-sm font-semibold"
            >
              <Heart
                className={cn("size-4", isFavorite && "fill-[#EBAD5B] text-[#EBAD5B]")}
              />
              {t("save")}
            </button>
            <button
              type="button"
              onClick={handleShare}
              className="inline-flex h-10 items-center gap-2 rounded-lg border border-[#E5E7EB] px-3 text-sm font-semibold"
            >
              <Share2 className="size-4" />
              {t("share")}
            </button>
            <button
              type="button"
              onClick={scrollToContact}
              className="inline-flex h-10 items-center rounded-lg border border-[#E5E7EB] px-4 text-sm font-semibold"
            >
              {t("scheduleVisit")}
            </button>
            <button
              type="button"
              onClick={scrollToContact}
              className="inline-flex h-10 items-center rounded-lg bg-[#EBAD5B] px-5 text-sm font-bold text-[#1A1205]"
            >
              {t("contactAdvertiser")}
            </button>
          </div>
        </div>
      </div>

      {lightbox ? (
        <div className="fixed inset-0 z-50 flex flex-col bg-black/95">
          <div className="flex items-center justify-between px-4 py-3 text-white">
            <p className="text-sm font-semibold">
              {activeImage + 1} / {property.images.length}
            </p>
            <button
              type="button"
              onClick={() => setLightbox(false)}
              className="inline-flex size-10 items-center justify-center rounded-full bg-white/10"
              aria-label="Close"
            >
              <X className="size-5" />
            </button>
          </div>
          <div className="relative mx-auto flex min-h-0 w-full max-w-5xl flex-1 items-center px-4 pb-8">
            <button
              type="button"
              onClick={prevImage}
              className="absolute left-2 z-10 inline-flex size-11 items-center justify-center rounded-full bg-white/10 text-white"
            >
              <ChevronLeft className="size-6" />
            </button>
            <div className="relative mx-auto aspect-[16/10] w-full">
              <ListingImage
                src={heroImage}
                alt={property.title}
                fill
                variant="hero"
                className="object-contain"
              />
            </div>
            <button
              type="button"
              onClick={nextImage}
              className="absolute right-2 z-10 inline-flex size-11 items-center justify-center rounded-full bg-white/10 text-white"
            >
              <ChevronRight className="size-6" />
            </button>
          </div>
        </div>
      ) : null}

      <ReportListingModal
        open={reportOpen}
        onClose={() => setReportOpen(false)}
        listingId={property.id}
        listingTitle={property.title}
      />

      <MarketplaceFooter />
    </div>
  );
}
