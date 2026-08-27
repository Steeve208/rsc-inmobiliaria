"use client";

import { BadgeCheck, MapPin, Star } from "lucide-react";
import { useTranslations } from "next-intl";
import { ListingImage } from "@/components/listing-image";
import { CountryFlag } from "@/components/marketplace/country-flag";
import { ListingPropertyCard } from "@/components/marketplace/properties/listing-card";
import { MarketplaceFooter } from "@/components/marketplace/marketplace-footer";
import { Link } from "@/lib/i18n/routing";
import { listingLocation } from "@/lib/marketplace/format";
import { initials } from "@/components/marketplace/properties/listing-utils";
import type { PropertyListing } from "@/features/imoveis/types";
import type { BrokerProfile } from "../types";
import { BrokerContactActions } from "./broker-contact-actions";

type Props = {
  broker: BrokerProfile;
  listings: PropertyListing[];
};

export function BrokerDetailPage({ broker, listings }: Props) {
  const t = useTranslations("corredores");
  const location = listingLocation([broker.city, broker.state, broker.country]);

  return (
    <div className="bg-[#F4F7FA] text-[#0B1220]">
      <div className="relative h-44 overflow-hidden bg-[#0B1220] sm:h-56">
        <ListingImage
          src={broker.coverImage}
          alt=""
          fill
          variant="hero"
          className="object-cover opacity-55"
          sizes="100vw"
        />
      </div>

      <div className="rk-container pb-10">
        <div className="-mt-12 grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
          <section className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-black/[0.04] sm:p-6">
            <nav className="text-xs text-[#6B7285]">
              <Link href="/" className="hover:text-[#2BB8A8]">
                {t("breadcrumbHome")}
              </Link>
              <span className="mx-1.5">›</span>
              <Link href="/corredores" className="hover:text-[#2BB8A8]">
                {t("breadcrumb")}
              </Link>
              <span className="mx-1.5">›</span>
              <span>{broker.name}</span>
            </nav>

            <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-end">
              {broker.photo ? (
                <div className="relative size-24 shrink-0 overflow-hidden rounded-full ring-4 ring-white sm:size-28">
                  <ListingImage
                    src={broker.photo}
                    alt={broker.name}
                    fill
                    variant="thumb"
                    className="object-cover"
                    sizes="112px"
                  />
                </div>
              ) : (
                <div className="flex size-24 shrink-0 items-center justify-center rounded-full bg-[#0B1220] text-2xl font-bold text-[#2BB8A8] ring-4 ring-white sm:size-28">
                  {initials(broker.name)}
                </div>
              )}
              <div className="min-w-0 flex-1 pb-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="rk-display text-2xl font-bold tracking-tight">
                    {broker.name}
                  </h1>
                  {broker.verified ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-[#2BB8A8]/15 px-2 py-0.5 text-[11px] font-bold uppercase text-[#B45309]">
                      <BadgeCheck className="size-3.5" />
                      {t("verified")}
                    </span>
                  ) : null}
                </div>
                <p className="mt-1 text-sm text-[#6B7285]">
                  {broker.role}
                  {broker.companyName ? ` · ${broker.companyName}` : ""}
                </p>
                {location ? (
                  <p className="mt-1.5 flex items-center gap-1 text-sm text-[#6B7285]">
                    <CountryFlag country={broker.country} className="text-[15px]" />
                    <MapPin className="size-3.5 text-[#2BB8A8]" />
                    {location}
                  </p>
                ) : null}
              </div>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <Stat label={t("statListings")} value={broker.listingsCount} />
              <Stat label={t("statYears")} value={broker.yearsActive} />
              <Stat label={t("statSold")} value={broker.soldCount} />
              <div className="rounded-lg bg-[#F4F7FA] px-3 py-2.5">
                <p className="text-[11px] font-medium uppercase tracking-wide text-[#9CA3AF]">
                  {t("statRating")}
                </p>
                <p className="mt-0.5 inline-flex items-center gap-1 text-lg font-bold">
                  <Star className="size-4 fill-[#2BB8A8] text-[#2BB8A8]" />
                  {broker.rating > 0 ? broker.rating.toFixed(1) : "—"}
                </p>
              </div>
            </div>

            {broker.bio ? (
              <div className="mt-6">
                <h2 className="text-sm font-bold">{t("about")}</h2>
                <p className="mt-2 text-sm leading-relaxed text-[#4B5563]">{broker.bio}</p>
              </div>
            ) : null}

            {broker.specialties.length > 0 ? (
              <div className="mt-6">
                <h2 className="text-sm font-bold">{t("specialties")}</h2>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {broker.specialties.map((specialty) => (
                    <span
                      key={specialty}
                      className="rounded-full bg-[#F4F7FA] px-3 py-1 text-xs font-medium text-[#4B5563]"
                    >
                      {t(`specialty.${specialty}`)}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}

            {broker.languages.length > 0 ? (
              <div className="mt-6">
                <h2 className="text-sm font-bold">{t("languages")}</h2>
                <p className="mt-2 text-sm text-[#4B5563]">{broker.languages.join(" · ")}</p>
              </div>
            ) : null}

            <div className="mt-8">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-sm font-bold">{t("activeListings")}</h2>
                {listings.length > 0 ? (
                  <Link
                    href={
                      broker.city
                        ? `/imoveis?city=${encodeURIComponent(broker.city)}&locationLabel=${encodeURIComponent(broker.city)}`
                        : "/imoveis"
                    }
                    className="text-xs font-semibold text-[#B45309] hover:underline"
                  >
                    {t("seeAllListings")}
                  </Link>
                ) : null}
              </div>
              {listings.length === 0 ? (
                <p className="mt-3 text-sm text-[#6B7285]">{t("noListings")}</p>
              ) : (
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  {listings.map((item) => (
                    <ListingPropertyCard key={item.id} item={item} />
                  ))}
                </div>
              )}
            </div>
          </section>

          <aside className="sticky top-24 space-y-3">
            <div className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-black/[0.04]">
              <p className="text-xs font-semibold uppercase tracking-wider text-[#9CA3AF]">
                {t("contact")}
              </p>
              {broker.creci ? (
                <p className="mt-3 text-sm text-[#4B5563]">
                  <span className="font-semibold text-[#0B1220]">{t("license")}</span>{" "}
                  {broker.creci}
                </p>
              ) : null}
              {broker.phone ? (
                <p className="mt-1 text-sm text-[#4B5563]">{broker.phone}</p>
              ) : null}
              {broker.email ? (
                <p className="mt-1 truncate text-sm text-[#4B5563]">{broker.email}</p>
              ) : null}
              <BrokerContactActions broker={broker} variant="panel" className="mt-4" />
              <p className="mt-3 flex items-center gap-2 text-xs text-[#6B7285]">
                <span className="size-2 rounded-full bg-emerald-500" />
                {t("online")}
              </p>
            </div>

            <div className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-black/[0.04]">
              <p className="text-xs font-semibold uppercase tracking-wider text-[#9CA3AF]">
                {t("agency")}
              </p>
              <p className="mt-2 font-semibold">{broker.companyName}</p>
              <Link
                href="/empresa/cadastro"
                className="mt-4 inline-flex h-9 w-full items-center justify-center rounded-md bg-[#2BB8A8] text-xs font-bold text-[#070B14] hover:bg-[#3DCCBC]"
              >
                {t("joinCta")}
              </Link>
            </div>
          </aside>
        </div>
      </div>

      <MarketplaceFooter />
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg bg-[#F4F7FA] px-3 py-2.5">
      <p className="text-[11px] font-medium uppercase tracking-wide text-[#9CA3AF]">
        {label}
      </p>
      <p className="mt-0.5 text-lg font-bold">{value || "—"}</p>
    </div>
  );
}
