"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/routing";
import { MarketplaceFooter } from "@/components/marketplace/marketplace-footer";
import { BROKER_SPECIALTIES, type BrokerProfile, type BrokerSpecialty } from "../types";
import { BrokerCard } from "./broker-card";

type Props = {
  brokers: BrokerProfile[];
};

export function CorredoresPage({ brokers }: Props) {
  const t = useTranslations("corredores");
  const [query, setQuery] = useState("");
  const [city, setCity] = useState("");
  const [specialty, setSpecialty] = useState<BrokerSpecialty | "">("");

  const cities = useMemo(() => {
    const unique = [...new Set(brokers.map((item) => item.city).filter(Boolean))];
    return unique.sort((a, b) => a.localeCompare(b));
  }, [brokers]);

  const results = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return brokers.filter((broker) => {
      if (city && broker.city !== city) return false;
      if (specialty && !broker.specialties.includes(specialty)) return false;
      if (!needle) return true;
      const haystack = [
        broker.name,
        broker.companyName,
        broker.city,
        broker.state,
        broker.country,
        broker.creci,
        broker.role,
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(needle);
    });
  }, [brokers, city, query, specialty]);

  return (
    <div className="bg-[#F4F7FA] text-[#0B1220]">
      <div className="rk-container py-4">
        <nav className="text-xs text-[#6B7285]">
          <Link href="/" className="hover:text-[#2BB8A8]">
            {t("breadcrumbHome")}
          </Link>
          <span className="mx-1.5">›</span>
          <span>{t("breadcrumb")}</span>
        </nav>

        <div className="mt-2 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="min-w-0">
            <h1 className="rk-display text-xl font-bold tracking-tight sm:text-2xl">
              {t("title")}
            </h1>
            <p className="mt-0.5 text-sm text-[#6B7285]">{t("subtitle")}</p>
          </div>
          <Link
            href="/empresa/cadastro"
            className="hidden h-[72px] w-[220px] shrink-0 overflow-hidden rounded-lg bg-[#0B1220] lg:block"
          >
            <div className="relative flex h-full flex-col justify-center p-3">
              <p className="text-xs font-bold leading-snug text-white">{t("joinTitle")}</p>
              <span className="mt-1.5 inline-flex w-fit rounded-md bg-[#2BB8A8] px-2 py-1 text-[10px] font-bold text-[#070B14]">
                {t("joinCta")}
              </span>
            </div>
          </Link>
        </div>

        <div className="mt-4 grid gap-2 sm:grid-cols-[minmax(0,1fr)_160px_180px]">
          <label className="relative block">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#9CA3AF]" />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={t("searchPlaceholder")}
              className="h-11 w-full rounded-lg bg-white pl-10 pr-3 text-sm text-[#0B1220] outline-none ring-1 ring-[#E5E7EB] placeholder:text-[#9CA3AF] focus:ring-[#2BB8A8]"
            />
          </label>
          <select
            value={city}
            onChange={(event) => setCity(event.target.value)}
            className="h-11 rounded-lg bg-white px-3 text-sm text-[#0B1220] outline-none ring-1 ring-[#E5E7EB] focus:ring-[#2BB8A8]"
          >
            <option value="">{t("allCities")}</option>
            {cities.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          <select
            value={specialty}
            onChange={(event) =>
              setSpecialty(event.target.value as BrokerSpecialty | "")
            }
            className="h-11 rounded-lg bg-white px-3 text-sm text-[#0B1220] outline-none ring-1 ring-[#E5E7EB] focus:ring-[#2BB8A8]"
          >
            <option value="">{t("allSpecialties")}</option>
            {BROKER_SPECIALTIES.map((item) => (
              <option key={item} value={item}>
                {t(`specialty.${item}`)}
              </option>
            ))}
          </select>
        </div>

        <p className="mt-4 text-sm font-semibold">{t("count", { count: results.length })}</p>

        {results.length === 0 ? (
          <div className="mt-4 rounded-xl bg-white px-6 py-12 text-center">
            <p className="font-semibold">{t("empty")}</p>
            <p className="mt-1 text-sm text-[#6B7285]">{t("emptyHint")}</p>
          </div>
        ) : (
          <div className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {results.map((broker) => (
              <BrokerCard key={broker.id} broker={broker} />
            ))}
          </div>
        )}

        <div className="mt-8 rounded-xl bg-[#0B1220] px-6 py-8 text-white sm:flex sm:items-center sm:justify-between">
          <div>
            <p className="rk-display text-lg font-bold">{t("joinTitle")}</p>
            <p className="mt-1 max-w-xl text-sm text-white/60">{t("joinText")}</p>
          </div>
          <Link
            href="/empresa/cadastro"
            className="mt-4 inline-flex h-10 items-center rounded-md bg-[#2BB8A8] px-4 text-sm font-bold text-[#070B14] hover:bg-[#3DCCBC] sm:mt-0"
          >
            {t("joinCta")}
          </Link>
        </div>
      </div>

      <MarketplaceFooter />
    </div>
  );
}
