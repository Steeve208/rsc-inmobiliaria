"use client";

import { BadgeCheck, MapPin, Star } from "lucide-react";
import { useTranslations } from "next-intl";
import { ListingImage } from "@/components/listing-image";
import { CountryFlag } from "@/components/marketplace/country-flag";
import { Link } from "@/lib/i18n/routing";
import { listingLocation } from "@/lib/marketplace/format";
import { initials } from "@/components/marketplace/properties/listing-utils";
import { cn } from "@/lib/utils";
import type { BrokerProfile } from "../types";
import { BrokerContactActions } from "./broker-contact-actions";

type Props = {
  broker: BrokerProfile;
};

export function BrokerCard({ broker }: Props) {
  const t = useTranslations("corredores");
  const location = listingLocation([broker.city, broker.state, broker.country]);
  const href = `/corredores/${broker.id}`;

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-lg bg-white ring-1 ring-black/[0.05] transition hover:-translate-y-0.5 hover:shadow-[0_16px_32px_rgba(15,23,42,.1)]">
      <Link href={href} className="relative block">
        <div className="relative h-[72px] overflow-hidden bg-[#0B1220]">
          <ListingImage
            src={broker.coverImage}
            alt=""
            fill
            variant="thumb"
            className="object-cover opacity-70 transition duration-500 group-hover:scale-105"
            sizes="400px"
          />
          {broker.verified ? (
            <span className="absolute right-2 top-2 inline-flex items-center gap-1 rounded-full bg-[#2BB8A8] px-2 py-0.5 text-[10px] font-bold uppercase text-[#070B14]">
              <BadgeCheck className="size-3" />
              {t("verified")}
            </span>
          ) : null}
        </div>
        <div className="absolute -bottom-10 left-4">
          {broker.photo ? (
            <div className="relative size-20 overflow-hidden rounded-full ring-4 ring-white">
              <ListingImage
                src={broker.photo}
                alt={broker.name}
                fill
                variant="thumb"
                className="object-cover"
                sizes="80px"
              />
            </div>
          ) : (
            <div className="flex size-20 items-center justify-center rounded-full bg-[#0B1220] text-lg font-bold text-[#2BB8A8] ring-4 ring-white">
              {initials(broker.name)}
            </div>
          )}
        </div>
      </Link>

      <div className="flex flex-1 flex-col px-4 pb-4 pt-12">
        <Link href={href} className="min-w-0">
          <h2 className="rk-display truncate text-[15px] font-semibold text-[#0B1220]">
            {broker.name}
          </h2>
          <p className="mt-0.5 line-clamp-1 text-xs text-[#6B7285]">
            {broker.role}
            {broker.companyName ? ` · ${broker.companyName}` : ""}
          </p>
          {location ? (
            <p className="mt-1.5 flex items-center gap-1 text-xs text-[#6B7285]">
              <CountryFlag country={broker.country} className="text-[13px]" />
              <MapPin className="size-3 shrink-0 text-[#2BB8A8]" />
              <span className="line-clamp-1">{location}</span>
            </p>
          ) : null}
          {broker.creci ? (
            <p className="mt-1 text-[11px] font-medium text-[#9CA3AF]">
              {t("license")} {broker.creci}
            </p>
          ) : null}
        </Link>

        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-[#6B7285]">
          {broker.rating > 0 ? (
            <span className="inline-flex items-center gap-0.5 font-semibold text-[#0B1220]">
              <Star className="size-3 fill-[#2BB8A8] text-[#2BB8A8]" />
              {broker.rating.toFixed(1)}
            </span>
          ) : null}
          <span>{t("listings", { count: broker.listingsCount })}</span>
          {broker.yearsActive > 0 ? (
            <span>{t("years", { count: broker.yearsActive })}</span>
          ) : null}
        </div>

        {broker.specialties.length > 0 ? (
          <div className="mt-3 flex flex-wrap gap-1">
            {broker.specialties.slice(0, 3).map((specialty) => (
              <span
                key={specialty}
                className="rounded-full bg-[#F4F7FA] px-2 py-0.5 text-[10px] font-medium text-[#4B5563]"
              >
                {t(`specialty.${specialty}`)}
              </span>
            ))}
          </div>
        ) : null}

        <div className="mt-auto pt-4">
          <BrokerContactActions broker={broker} />
          <Link
            href={href}
            className={cn(
              "mt-2 inline-flex h-8 w-full items-center justify-center rounded-md text-[11px] font-semibold",
              "text-[#0B1220] ring-1 ring-[#E5E7EB] hover:bg-[#F9FAFB]",
            )}
          >
            {t("viewProfile")}
          </Link>
        </div>
      </div>
    </article>
  );
}
