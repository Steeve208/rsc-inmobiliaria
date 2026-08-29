"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { MapPin, ShieldCheck } from "lucide-react";
import { Link } from "@/lib/i18n/routing";
import { ListingImage } from "@/components/listing-image";
import { ListingCodeBadge } from "@/components/marketplace/listing-code-badge";
import { MarketplaceFooter } from "@/components/marketplace/marketplace-footer";
import { ListingContactPanel } from "@/features/contact";
import { formatMarketplacePrice, listingLocation } from "@/lib/marketplace/format";
import type { PropertyListing } from "@/features/imoveis/types";
import type { ProjectListing } from "../types";
import { bedsLabel } from "@/components/marketplace/projects/listing-utils";

type Props = {
  id: string;
};

export function ProjectDetailPage({ id }: Props) {
  const t = useTranslations("marketplace.projects");
  const [item, setItem] = useState<ProjectListing | null | undefined>(undefined);
  const [units, setUnits] = useState<PropertyListing[]>([]);

  useEffect(() => {
    fetch("/api/listings/projects")
      .then((r) => r.json())
      .then((data: ProjectListing[]) => {
        const catalog = Array.isArray(data) ? data : [];
        const project =
          catalog.find((entry) => entry.id === id || entry.propertyId === id) ?? null;
        setItem(project);

        const unitIds = project?.unitListingIds?.filter(Boolean) ?? [];
        if (unitIds.length === 0) {
          setUnits([]);
          return;
        }
        return fetch(`/api/listings/properties?ids=${unitIds.join(",")}`)
          .then((response) => response.json())
          .then((rows: PropertyListing[]) => {
            setUnits(Array.isArray(rows) ? rows : []);
          });
      })
      .catch(() => {
        setItem(null);
        setUnits([]);
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
      <div className="bg-[#F4F7FA] px-4 py-16 text-center">
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
  const companyId =
    item.companyId || item.developer.toLowerCase().replace(/\s+/g, "-") || "reeskova";
  const financingHref = `/financing?price=${item.price}&down=20&listingId=${item.id}&title=${encodeURIComponent(item.title)}&category=properties&currency=${item.currency}&companyId=${encodeURIComponent(companyId)}`;

  return (
    <div className="bg-[#F4F7FA] text-[#0B1220]">
      <div className="rk-container py-6">
        <nav className="text-xs text-[#6B7285]">
          <Link href="/" className="hover:text-[#EBAD5B]">
            {t("breadcrumbHome")}
          </Link>
          <span className="mx-1.5">›</span>
          <Link href="/projetos" className="hover:text-[#EBAD5B]">
            {t("breadcrumbProjects")}
          </Link>
          <span className="mx-1.5">›</span>
          <span>{item.title}</span>
        </nav>

        <div className="mt-4 grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_360px]">
          <div className="overflow-hidden rounded-xl bg-white ring-1 ring-black/[0.04]">
            <div className="relative aspect-[16/10]">
              <ListingImage
                src={item.image}
                alt={item.title}
                fill
                variant="hero"
                className="object-cover"
              />
            </div>
            <div className="p-5 sm:p-6">
              <p className="text-xs font-semibold uppercase tracking-wide text-[#6B7285]">
                {t(`statuses.${item.status}`)} · {t(`types.${item.type}`)}
              </p>
              <h1 className="rk-display mt-1 text-2xl font-bold sm:text-3xl">{item.title}</h1>
              <ListingCodeBadge
                id={item.id}
                code={item.code}
                kind="project"
                className="mt-2 inline-flex bg-[#0B1220] px-2 py-0.5"
              />
              <p className="mt-3 flex items-center gap-1 text-sm text-[#6B7285]">
                <MapPin className="size-4 text-[#EBAD5B]" />
                {location}
              </p>
              <dl className="mt-5 grid gap-3 text-sm sm:grid-cols-2">
                <div className="rounded-lg bg-[#F4F7FA] p-3">
                  <dt className="text-xs text-[#6B7285]">{t("developer")}</dt>
                  <dd className="mt-0.5 font-semibold">{item.developer}</dd>
                </div>
                <div className="rounded-lg bg-[#F4F7FA] p-3">
                  <dt className="text-xs text-[#6B7285]">{t("deliveryDate")}</dt>
                  <dd className="mt-0.5 font-semibold">{item.delivery}</dd>
                </div>
                <div className="rounded-lg bg-[#F4F7FA] p-3 sm:col-span-2">
                  <dt className="text-xs text-[#6B7285]">{t("propertyType")}</dt>
                  <dd className="mt-0.5 font-semibold">
                    {[t(`units.${item.unitType}`), beds ? t("bedsRange", { range: beds }) : ""]
                      .filter(Boolean)
                      .join(" · ")}
                  </dd>
                </div>
              </dl>
              {item.propertyId && units.length === 0 ? (
                <Link
                  href={`/imoveis/${item.propertyId}`}
                  className="mt-5 inline-flex text-sm font-semibold text-[#2563EB] hover:underline"
                >
                  {t("viewUnit")}
                </Link>
              ) : null}
              {units.length > 0 ? (
                <div className="mt-6">
                  <p className="text-sm font-semibold text-[#0B1220]">{t("linkedUnits")}</p>
                  <ul className="mt-2 space-y-2">
                    {units.map((unit) => (
                      <li key={unit.id}>
                        <Link
                          href={`/imoveis/${unit.id}`}
                          className="text-sm font-semibold text-[#2563EB] hover:underline"
                        >
                          {unit.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          </div>

          <aside className="h-fit space-y-4 lg:sticky lg:top-24">
            <div className="rounded-xl bg-white p-5 ring-1 ring-black/[0.04]">
              <p className="text-xs font-semibold uppercase text-[#6B7285]">
                {t("from")}
              </p>
              <p className="mt-1 text-2xl font-bold text-[#0B1220]">
                {t("priceFrom", {
                  price: formatMarketplacePrice(item.price, item.currency),
                })}
              </p>
              <p className="mt-1 flex items-center gap-2 text-sm font-semibold">
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
              <div className="mt-5">
                <ListingContactPanel
                  listing={{
                    listingId: item.id,
                    listingTitle: item.title,
                    listingCategory: "properties",
                    companyId,
                    companyName: item.developer,
                    whatsappNumber: "",
                  }}
                  variant="light"
                  mode="project"
                  financingHref={financingHref}
                />
              </div>
            </div>
          </aside>
        </div>
      </div>
      <MarketplaceFooter />
    </div>
  );
}
