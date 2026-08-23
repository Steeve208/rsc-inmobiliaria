"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { MapPin, ShieldCheck } from "lucide-react";
import { Link } from "@/lib/i18n/routing";
import { ListingImage } from "@/components/listing-image";
import { MarketplaceFooter } from "@/components/marketplace/marketplace-footer";
import { formatMarketplacePrice, listingLocation } from "@/lib/marketplace/format";
import { mergeProjectCatalog } from "@/lib/marketplace/home-project-mocks";
import type { PropertyListing } from "@/features/imoveis/types";
import type { ProjectListing } from "../types";
import { bedsLabel } from "@/components/marketplace/projects/listing-utils";

type Props = {
  id: string;
};

export function ProjectDetailPage({ id }: Props) {
  const t = useTranslations("marketplace.projects");
  const [item, setItem] = useState<ProjectListing | null | undefined>(undefined);

  useEffect(() => {
    fetch("/api/listings/properties?section=launch")
      .then((r) => r.json())
      .then((data: PropertyListing[]) => {
        const catalog = mergeProjectCatalog(Array.isArray(data) ? data : []);
        setItem(
          catalog.find((project) => project.id === id || project.propertyId === id) ??
            null,
        );
      })
      .catch(() => {
        const catalog = mergeProjectCatalog([]);
        setItem(
          catalog.find((project) => project.id === id || project.propertyId === id) ??
            null,
        );
      });
  }, [id]);

  if (item === undefined) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-[#6B7285]">
        Loading...
      </div>
    );
  }

  if (!item) {
    return (
      <div className="bg-[#F4F4F5] px-4 py-16 text-center">
        <p className="font-semibold text-[#0B1220]">{t("empty")}</p>
        <Link href="/projetos" className="mt-4 inline-block text-sm font-semibold text-[#C9972A]">
          {t("breadcrumbProjects")}
        </Link>
      </div>
    );
  }

  const location = listingLocation([
    item.neighborhood,
    item.city,
    item.state,
    item.country,
  ]);
  const beds = bedsLabel(item);

  return (
    <div className="bg-[#F4F4F5] text-[#0B1220]">
      <div className="rk-container py-6">
        <nav className="text-xs text-[#6B7285]">
          <Link href="/" className="hover:text-[#E8A84A]">
            {t("breadcrumbHome")}
          </Link>
          <span className="mx-1.5">›</span>
          <Link href="/projetos" className="hover:text-[#E8A84A]">
            {t("breadcrumbProjects")}
          </Link>
          <span className="mx-1.5">›</span>
          <span>{item.title}</span>
        </nav>

        <div className="mt-4 grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_360px]">
          <div className="overflow-hidden rounded-xl bg-white">
            <div className="relative aspect-[16/10]">
              <ListingImage
                src={item.image}
                alt={item.title}
                fill
                variant="hero"
                className="object-cover"
              />
            </div>
            <div className="p-5">
              <p className="text-xs font-semibold uppercase text-[#6B7285]">
                {t(`statuses.${item.status}`)} · {t(`types.${item.type}`)}
              </p>
              <h1 className="rk-display mt-1 text-2xl font-bold">{item.title}</h1>
              <p className="mt-2 flex items-center gap-1 text-sm text-[#6B7285]">
                <MapPin className="size-4 text-[#E8A84A]" />
                {location}
              </p>
              <p className="mt-3 text-sm text-[#4B5563]">
                {[t(`units.${item.unitType}`), beds ? t("bedsRange", { range: beds }) : ""]
                  .filter(Boolean)
                  .join(" • ")}
              </p>
              <p className="mt-4 text-2xl font-bold text-[#EA580C]">
                {t("priceFrom", {
                  price: formatMarketplacePrice(item.price, item.currency),
                })}
              </p>
              <p className="mt-2 text-sm text-[#6B7285]">
                {t("delivery", { date: item.delivery })}
              </p>
            </div>
          </div>

          <aside className="h-fit rounded-xl bg-white p-5">
            <p className="text-xs font-semibold uppercase text-[#6B7285]">
              {t("developer")}
            </p>
            <p className="mt-1 flex items-center gap-2 text-base font-bold">
              {item.developer}
              {item.verified ? (
                <ShieldCheck className="size-4 text-[#2563EB]" />
              ) : null}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {item.paymentPlan ? (
                <span className="rounded-full bg-[#EEF2FF] px-3 py-1 text-xs font-semibold text-[#4338CA]">
                  {t("pills.plan")}
                </span>
              ) : null}
              {item.highRoi ? (
                <span className="rounded-full bg-[#ECFDF5] px-3 py-1 text-xs font-semibold text-[#0F766E]">
                  {t("pills.roi")}
                </span>
              ) : null}
              {item.luxury ? (
                <span className="rounded-full bg-[#F8F4EA] px-3 py-1 text-xs font-semibold text-[#C9972A]">
                  {t("pills.luxury")}
                </span>
              ) : null}
              {item.sustainable ? (
                <span className="rounded-full bg-[#F0FDF4] px-3 py-1 text-xs font-semibold text-[#15803D]">
                  {t("pills.eco")}
                </span>
              ) : null}
            </div>
            <Link
              href={item.propertyId ? `/imoveis/${item.propertyId}` : "/empresa/cadastro"}
              className="mt-6 flex h-11 items-center justify-center rounded-xl bg-[#E8A84A] text-sm font-bold text-[#070B14]"
            >
              {t("promoCta")}
            </Link>
          </aside>
        </div>
      </div>
      <MarketplaceFooter />
    </div>
  );
}
