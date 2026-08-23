"use client";

import { useTranslations } from "next-intl";
import { MapPin, ShieldCheck } from "lucide-react";
import { Link } from "@/lib/i18n/routing";
import { ListingImage } from "@/components/listing-image";
import { MarketplaceFooter } from "@/components/marketplace/marketplace-footer";
import { formatMarketplacePrice, listingLocation } from "@/lib/marketplace/format";
import { businessListings } from "../mock-data";

type Props = { id: string };

export function BusinessDetailPage({ id }: Props) {
  const t = useTranslations("marketplace.businesses");
  const item = businessListings.find((business) => business.id === id);

  if (!item) {
    return (
      <div className="bg-[#F4F4F5] px-4 py-16 text-center">
        <p className="font-semibold">{t("empty")}</p>
        <Link href="/negocios" className="mt-4 inline-block text-sm font-semibold text-[#C9972A]">
          {t("breadcrumbBusinesses")}
        </Link>
      </div>
    );
  }

  const location = listingLocation([item.neighborhood, item.city, item.state, item.country]);

  return (
    <div className="bg-[#F4F4F5] text-[#0B1220]">
      <div className="rk-container py-6">
        <nav className="text-xs text-[#6B7285]">
          <Link href="/" className="hover:text-[#E8A84A]">{t("breadcrumbHome")}</Link>
          <span className="mx-1.5">›</span>
          <Link href="/negocios" className="hover:text-[#E8A84A]">{t("breadcrumbBusinesses")}</Link>
          <span className="mx-1.5">›</span>
          <span>{item.title}</span>
        </nav>
        <div className="mt-4 grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_360px]">
          <div className="overflow-hidden rounded-xl bg-white">
            <div className="relative aspect-[16/10]">
              <ListingImage src={item.image} alt={item.title} fill variant="hero" className="object-cover" />
            </div>
            <div className="p-5">
              <p className="text-xs font-semibold uppercase text-[#6B7285]">{t(`types.${item.type}`)}</p>
              <h1 className="rk-display mt-1 text-2xl font-bold">{item.title}</h1>
              <p className="mt-2 flex items-center gap-1 text-sm text-[#6B7285]">
                <MapPin className="size-4 text-[#E8A84A]" />
                {location}
              </p>
              <p className="mt-4 text-2xl font-bold text-[#EA580C]">
                {formatMarketplacePrice(item.price, item.currency)}
              </p>
              <dl className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
                <div>
                  <dt className="text-[#6B7285]">{t("revenue")}</dt>
                  <dd className="font-semibold">{formatMarketplacePrice(item.revenue, item.currency)}</dd>
                </div>
                <div>
                  <dt className="text-[#6B7285]">{t("cashFlow")}</dt>
                  <dd className="font-semibold">{formatMarketplacePrice(item.cashFlow, item.currency)}</dd>
                </div>
              </dl>
            </div>
          </div>
          <aside className="h-fit rounded-xl bg-white p-5">
            <p className="text-xs font-semibold uppercase text-[#6B7285]">{t("broker")}</p>
            <p className="mt-1 flex items-center gap-2 text-base font-bold">
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
            <Link
              href="/empresa/cadastro"
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
