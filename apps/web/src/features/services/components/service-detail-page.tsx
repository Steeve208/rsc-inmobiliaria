"use client";

import { useTranslations } from "next-intl";
import { MapPin, ShieldCheck, Star } from "lucide-react";
import { Link } from "@/lib/i18n/routing";
import { ListingImage } from "@/components/listing-image";
import { MarketplaceFooter } from "@/components/marketplace/marketplace-footer";
import { formatServicePrice } from "@/components/marketplace/services/listing-utils";
import { listingLocation } from "@/lib/marketplace/format";
import { serviceListings } from "../mock-data";

type Props = { id: string };

export function ServiceDetailPage({ id }: Props) {
  const t = useTranslations("marketplace.services");
  const item = serviceListings.find((service) => service.id === id);

  if (!item) {
    return (
      <div className="bg-[#F4F4F5] px-4 py-16 text-center">
        <p className="font-semibold">{t("empty")}</p>
        <Link href="/services" className="mt-4 inline-block text-sm font-semibold text-[#C9972A]">
          {t("breadcrumbServices")}
        </Link>
      </div>
    );
  }

  const location = listingLocation([item.city, item.state, item.country]);
  const price = formatServicePrice(item, {
    from: t("priceFrom"),
    month: t("perMonth"),
    quote: t("requestQuote"),
  });

  return (
    <div className="bg-[#F4F4F5] text-[#0B1220]">
      <div className="rk-container py-6">
        <nav className="text-xs text-[#6B7285]">
          <Link href="/" className="hover:text-[#E8A84A]">
            {t("breadcrumbHome")}
          </Link>
          <span className="mx-1.5">›</span>
          <Link href="/services" className="hover:text-[#E8A84A]">
            {t("breadcrumbServices")}
          </Link>
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
              <p className="mt-3 flex items-center gap-1 text-sm font-semibold">
                <Star className="size-4 fill-[#E8A84A] text-[#E8A84A]" />
                {item.rating.toFixed(1)}
                <span className="font-normal text-[#6B7285]">({item.reviews})</span>
              </p>
              <p className="mt-4 text-2xl font-bold text-[#EA580C]">{price}</p>
              <p className="mt-4 text-sm leading-relaxed text-[#4B5563]">{item.description}</p>
            </div>
          </div>
          <aside className="h-fit rounded-xl bg-white p-5">
            <p className="text-xs font-semibold uppercase text-[#6B7285]">{t("provider")}</p>
            <p className="mt-1 flex items-center gap-2 text-base font-bold">
              {item.provider}
              {item.verified ? <ShieldCheck className="size-4 text-[#2563EB]" /> : null}
            </p>
            {item.verified ? (
              <p className="mt-1 text-xs font-semibold text-[#2563EB]">{t("verifiedProvider")}</p>
            ) : null}
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
