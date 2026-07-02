"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import {
  Building2,
  Car,
  Check,
  ChevronDown,
  MapPin,
  Rocket,
  Search,
} from "lucide-react";
import { useRouter } from "@/lib/i18n/routing";
import { useMarket } from "@/lib/providers/market-provider";
import { cn } from "@/lib/utils";

type SearchTab = "properties" | "vehicles" | "launches";

export function HeroSection() {
  const t = useTranslations("landing");
  const tMarkets = useTranslations("markets");
  const { market, marketId } = useMarket();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<SearchTab>("properties");
  const [location, setLocation] = useState("");
  const [query, setQuery] = useState("");

  const tabs: { id: SearchTab; label: string }[] = [
    { id: "properties", label: t("search.tabs.properties") },
    { id: "vehicles", label: t("search.tabs.vehicles") },
    { id: "launches", label: t("search.tabs.launches") },
  ];

  const propertyFilters = [
    t("search.filters.houses"),
    t("search.filters.apartments"),
    t("search.filters.land"),
    t("search.filters.commercial"),
  ];

  const vehicleFilters = [
    t("search.filters.cars"),
    t("search.filters.motorcycles"),
    t("search.filters.trucks"),
  ];

  const locationPlaceholder = tMarkets(`searchLocation.${market.defaultLocale}`);

  const goToSearch = (extra?: { type?: string }) => {
    const params = new URLSearchParams();
    if (location) params.set("city", location);
    if (query) params.set("q", query);
    if (extra?.type) params.set("type", extra.type);

    if (activeTab === "properties") {
      router.push(`/imoveis${params.toString() ? `?${params.toString()}` : ""}`);
      return;
    }

    if (activeTab === "vehicles") {
      router.push(`/veiculos${params.toString() ? `?${params.toString()}` : ""}`);
      return;
    }

    params.set("category", activeTab);
    router.push(`/search?${params.toString()}`);
  };

  return (
    <section className="relative overflow-hidden">
      <Image
        src="/hero-bg.png"
        alt=""
        fill
        priority
        className="object-cover object-[center_35%] brightness-[1.15] saturate-[1.05]"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#020617]/75 via-[#020617]/35 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#020617]/80 via-transparent to-transparent" />

      <div className="relative mx-auto max-w-[1440px] px-6 pb-10 pt-5 lg:px-8 lg:pb-12 lg:pt-6">
        <div
          className={cn(
            "grid items-start gap-6",
            market.creditAvailable
              ? "lg:grid-cols-[1fr_320px] xl:grid-cols-[1fr_340px]"
              : "lg:grid-cols-1",
          )}
        >
          <div>
            <motion.h1
              className="max-w-3xl text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-[2.75rem] lg:leading-[1.15]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {t("hero.titleStart")}{" "}
              <span className="text-[#d4a017]">{t("hero.titleHighlight")}</span>{" "}
              {t("hero.titleEnd")}
            </motion.h1>

            <motion.p
              className="mt-4 max-w-2xl text-sm leading-relaxed text-white/75 sm:text-base"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              {t("hero.subtitle")}
            </motion.p>

            <motion.div
              className="mt-5 max-w-3xl"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="overflow-hidden rounded-t-xl bg-[#0f172a]/90 backdrop-blur-sm">
                <div className="flex">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveTab(tab.id)}
                      className={cn(
                        "flex flex-1 items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-colors",
                        activeTab === tab.id
                          ? "bg-[#1d4ed8] text-white"
                          : "text-white/70 hover:bg-white/5 hover:text-white",
                      )}
                    >
                      {tab.id === "properties" && (
                        <Building2 className="size-4" />
                      )}
                      {tab.id === "vehicles" && <Car className="size-4" />}
                      {tab.id === "launches" && <Rocket className="size-4" />}
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="rounded-b-xl rounded-tr-xl bg-white p-2 shadow-2xl sm:p-3">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                  <div className="flex flex-1 items-center gap-2 rounded-lg border border-gray-200 px-3 py-2.5">
                    <MapPin className="size-4 shrink-0 text-gray-400" />
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder={locationPlaceholder}
                      className="w-full bg-transparent text-sm text-gray-800 outline-none placeholder:text-gray-400"
                    />
                    <ChevronDown className="size-4 shrink-0 text-gray-400" />
                  </div>
                  <div className="flex flex-1 items-center gap-2 rounded-lg border border-gray-200 px-3 py-2.5">
                    <Search className="size-4 shrink-0 text-gray-400" />
                    <input
                      type="text"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder={t("search.queryPlaceholder")}
                      className="w-full bg-transparent text-sm text-gray-800 outline-none placeholder:text-gray-400"
                    />
                    <ChevronDown className="size-4 shrink-0 text-gray-400" />
                  </div>
                  <button
                    type="button"
                    onClick={() => goToSearch()}
                    className="h-11 shrink-0 rounded-lg bg-[#1d4ed8] px-8 text-sm font-semibold text-white transition-colors hover:bg-[#1e40af] sm:h-full sm:min-h-[44px]"
                  >
                    {t("search.submit")}
                  </button>
                </div>
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-x-1 gap-y-1 text-xs text-white/60 sm:text-sm">
                {propertyFilters.map((filter, i) => (
                  <span key={filter} className="inline-flex items-center">
                    {i > 0 && <span className="mx-1.5">·</span>}
                    <button
                      type="button"
                      className="transition-colors hover:text-white"
                    >
                      {filter}
                    </button>
                  </span>
                ))}
                <span className="mx-2 hidden text-white/30 sm:inline">|</span>
                {vehicleFilters.map((filter, i) => (
                  <span key={filter} className="inline-flex items-center">
                    {i > 0 && <span className="mx-1.5">·</span>}
                    <button
                      type="button"
                      className="transition-colors hover:text-white"
                    >
                      {filter}
                    </button>
                  </span>
                ))}
              </div>
            </motion.div>
          </div>

          {market.creditAvailable && (
            <motion.aside
              className="rounded-2xl border border-white/10 bg-[#0f172a]/80 p-6 backdrop-blur-md lg:mt-3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <h2 className="text-lg font-semibold text-white">
                {t("credit.title")}
              </h2>
              <ul className="mt-4 space-y-3">
                {[0, 1, 2].map((i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2.5 text-sm text-white/80"
                  >
                    <Check className="mt-0.5 size-4 shrink-0 text-[#3b82f6]" />
                    {t(`credit.benefits.${i}`)}
                  </li>
                ))}
              </ul>
              <button
                type="button"
                className="mt-6 w-full rounded-lg bg-[#1d4ed8] py-3 text-sm font-semibold text-white transition-colors hover:bg-[#1e40af]"
              >
                {t("credit.cta")}
              </button>
            </motion.aside>
          )}
        </div>
      </div>
    </section>
  );
}
