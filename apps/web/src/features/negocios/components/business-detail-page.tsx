"use client";

import { useTranslations } from "next-intl";
import { MapPin, ShieldCheck } from "lucide-react";
import { Link } from "@/lib/i18n/routing";
import { ListingImage } from "@/components/listing-image";
import { ListingCodeBadge } from "@/components/marketplace/listing-code-badge";
import { MarketplaceFooter } from "@/components/marketplace/marketplace-footer";
import { ListingContactPanel } from "@/features/contact";
import { formatMarketplacePrice, listingLocation } from "@/lib/marketplace/format";
import { businessListings } from "../mock-data";

type Props = { id: string };

export function BusinessDetailPage({ id }: Props) {
  const t = useTranslations("marketplace.businesses");
  const item = businessListings.find((business) => business.id === id);

  if (!item) {
    return (
      <div className="bg-[#F4F7FA] px-4 py-16 text-center">
        <p className="font-semibold">{t("empty")}</p>
        <Link href="/negocios" className="mt-4 inline-block text-sm font-semibold text-[#C9972A]">
          {t("breadcrumbBusinesses")}
        </Link>
      </div>
    );
  }

  const location = listingLocation([item.neighborhood, item.city, item.state, item.country]);
  const companyId = item.broker.toLowerCase().replace(/\s+/g, "-") || "reeskova";

  return (
    <div className="bg-[#F4F7FA] text-[#0B1220]">
      <div className="rk-container py-6">
        <nav className="text-xs text-[#6B7285]">
          <Link href="/" className="hover:text-[#EBAD5B]">{t("breadcrumbHome")}</Link>
          <span className="mx-1.5">›</span>
          <Link href="/negocios" className="hover:text-[#EBAD5B]">{t("breadcrumbBusinesses")}</Link>
          <span className="mx-1.5">›</span>
          <span>{item.title}</span>
        </nav>
        <div className="mt-4 grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_360px]">
          <div className="overflow-hidden rounded-xl bg-white ring-1 ring-black/[0.04]">
            <div className="relative aspect-[16/10]">
              <ListingImage src={item.image} alt={item.title} fill variant="hero" className="object-cover" />
            </div>
            <div className="p-5 sm:p-6">
              <p className="text-xs font-semibold uppercase text-[#6B7285]">{t(`types.${item.type}`)}</p>
              <h1 className="rk-display mt-1 text-2xl font-bold sm:text-3xl">{item.title}</h1>
              <ListingCodeBadge
                id={item.id}
                code={item.code}
                kind="business"
                className="mt-2 inline-flex bg-[#0B1220] px-2 py-0.5"
              />
              <p className="mt-3 flex items-center gap-1 text-sm text-[#6B7285]">
                <MapPin className="size-4 text-[#EBAD5B]" />
                {location}
              </p>
              <dl className="mt-5 grid gap-3 text-sm sm:grid-cols-2">
                <div className="rounded-lg bg-[#F4F7FA] p-3">
                  <dt className="text-xs text-[#6B7285]">{t("revenue")}</dt>
                  <dd className="mt-0.5 font-semibold">{formatMarketplacePrice(item.revenue, item.currency)}</dd>
                </div>
                <div className="rounded-lg bg-[#F4F7FA] p-3">
                  <dt className="text-xs text-[#6B7285]">{t("cashFlow")}</dt>
                  <dd className="mt-0.5 font-semibold">{formatMarketplacePrice(item.cashFlow, item.currency)}</dd>
                </div>
              </dl>
            </div>
          </div>
          <aside className="h-fit space-y-4 lg:sticky lg:top-24">
            <div className="rounded-xl bg-white p-5 ring-1 ring-black/[0.04]">
              <p className="text-2xl font-bold">{formatMarketplacePrice(item.price, item.currency)}</p>
              <p className="mt-1 flex items-center gap-2 text-sm font-semibold">
                {item.broker}
                {item.verified ? <ShieldCheck className="size-4 text-[#2563EB]" /> : null}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {item.profitable ? (
                  <span className="rounded-full bg-[#ECFDF5] px-3 py-1 text-xs font-semibold text-[#059669]">
                    {t("badges.profitable")}
                  </span>
                ) : null}
                {item.franchise ? (
                  <span className="rounded-full bg-[#EFF6FF] px-3 py-1 text-xs font-semibold text-[#2563EB]">
                    {t("badges.franchise")}
                  </span>
                ) : null}
                {item.equipment ? (
                  <span className="rounded-full bg-[#FFF7ED] px-3 py-1 text-xs font-semibold text-[#EA580C]">
                    {t("badges.equipment")}
                  </span>
                ) : null}
                {item.sellerFinancing ? (
                  <span className="rounded-full bg-[#F8F4EA] px-3 py-1 text-xs font-semibold text-[#C9972A]">
                    {t("pills.financing")}
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
                    companyName: item.broker,
                    whatsappNumber: "",
                  }}
                  variant="light"
                  mode="business"
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
