"use client";

import { ArrowRight, ArrowUpRight, Building2, Car, Download } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { ListingImage } from "@/components/listing-image";
import { MarketplaceFooter } from "@/components/marketplace/marketplace-footer";
import { Link } from "@/lib/i18n/routing";
import type { MagazineIssue } from "../types";

type Props = {
  magazine: MagazineIssue;
  related?: MagazineIssue[];
};

export function MagazineDetailPage({ magazine, related = [] }: Props) {
  const t = useTranslations("revistas");
  const locale = useLocale();
  const paragraphs = magazine.body
    .split(/\n{2,}/)
    .map((part) => part.trim())
    .filter(Boolean);
  const dateLabel = new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(`${magazine.publishedAt}T12:00:00.000Z`));

  return (
    <div className="bg-[#070B14] text-white">
      <header className="relative min-h-[340px] overflow-hidden sm:min-h-[440px]">
        <ListingImage
          src={magazine.coverImage}
          alt={magazine.title}
          fill
          variant="hero"
          className="object-cover opacity-45"
          sizes="100vw"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#070B14] via-[#070B14]/65 to-[#070B14]/25" />
        <div className="rk-container relative flex min-h-[340px] flex-col justify-end pb-8 pt-16 sm:min-h-[440px] sm:pb-10">
          <nav className="text-xs text-white/50">
            <Link href="/" className="hover:text-[#EBAD5B]">
              {t("breadcrumbHome")}
            </Link>
            <span className="mx-1.5 text-white/30">›</span>
            <Link href="/revistas" className="hover:text-[#EBAD5B]">
              {t("breadcrumb")}
            </Link>
            <span className="mx-1.5 text-white/30">›</span>
            <span className="text-white/75">{t(`category.${magazine.category}`)}</span>
          </nav>
          <p className="mt-4 text-[11px] font-bold uppercase tracking-[0.22em] text-[#EBAD5B]">
            {t(`category.${magazine.category}`)} · {magazine.issueLabel}
          </p>
          <h1 className="rk-display mt-2 max-w-4xl text-3xl font-bold tracking-tight text-white sm:text-5xl">
            {magazine.title}
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/70 sm:text-base">
            {magazine.excerpt}
          </p>
          <p className="mt-4 text-xs font-medium text-white/50">
            {magazine.author} · {dateLabel}
          </p>
        </div>
      </header>

      <div className="rk-container py-8 sm:py-10">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_300px]">
          <article className="rounded-2xl bg-[#121826] p-5 ring-1 ring-white/10 sm:p-8">
            {magazine.pdfUrl ? (
              <a
                href={magazine.pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mb-6 inline-flex h-10 items-center gap-1.5 rounded-md border border-[#EBAD5B]/70 px-4 text-sm font-bold text-[#EBAD5B] hover:bg-[#EBAD5B]/10"
              >
                <Download className="size-4" />
                {t("openPdf")}
                <ArrowUpRight className="size-4" />
              </a>
            ) : null}

            <div className="space-y-5 text-[16px] leading-8 text-white/80">
              {paragraphs.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>

            <aside className="mt-10 border-y border-white/10 py-6">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#EBAD5B]">
                {t("sponsor.label")}
              </p>
              <p className="rk-display mt-2 text-lg font-bold text-white">
                {t("article.sponsorTitle")}
              </p>
              <p className="mt-1 text-sm text-white/55">{t("article.sponsorBody")}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Link
                  href="/imoveis?featured=1"
                  className="inline-flex h-10 items-center gap-1.5 rounded-md bg-[#EBAD5B] px-4 text-sm font-bold text-[#1A1205] hover:bg-[#F0BC73]"
                >
                  <Building2 className="size-4" />
                  {t("sponsor.propertiesCta")}
                </Link>
                <Link
                  href="/veiculos"
                  className="inline-flex h-10 items-center gap-1.5 rounded-md border border-white/20 px-4 text-sm font-semibold text-white hover:border-[#EBAD5B]"
                >
                  <Car className="size-4" />
                  {t("sponsor.vehiclesCta")}
                </Link>
              </div>
            </aside>
          </article>

          <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-2xl bg-[#121826] p-5 ring-1 ring-white/10">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#EBAD5B]">
                {t("advertise.eyebrow")}
              </p>
              <p className="rk-display mt-2 text-lg font-bold leading-snug text-white">
                {t("article.sidebarTitle")}
              </p>
              <p className="mt-2 text-xs leading-relaxed text-white/55">
                {t("article.sidebarBody")}
              </p>
              <Link
                href="/para-empresas"
                className="mt-4 inline-flex h-10 w-full items-center justify-center rounded-md bg-[#EBAD5B] text-sm font-bold text-[#1A1205] hover:bg-[#F0BC73]"
              >
                {t("advertise.cta")}
              </Link>
            </div>

            {related.length > 0 ? (
              <div className="rounded-2xl bg-[#121826] p-4 ring-1 ring-white/10">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/45">
                  {t("related")}
                </p>
                <ul className="mt-3 space-y-3">
                  {related.map((item) => (
                    <li key={item.id}>
                      <Link
                        href={`/revistas/${item.slug}`}
                        className="group flex gap-3"
                      >
                        <div className="relative h-16 w-20 shrink-0 overflow-hidden rounded-md bg-[#0B1220]">
                          <ListingImage
                            src={item.coverImage}
                            alt={item.title}
                            fill
                            variant="thumb"
                            className="object-cover"
                            sizes="80px"
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[10px] font-bold uppercase tracking-wide text-[#EBAD5B]">
                            {t(`category.${item.category}`)}
                          </p>
                          <p className="mt-0.5 line-clamp-2 text-sm font-semibold leading-snug text-white group-hover:text-[#EBAD5B]">
                            {item.title}
                          </p>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/revistas"
                  className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-[#EBAD5B] hover:underline"
                >
                  {t("backToChannel")}
                  <ArrowRight className="size-3.5" />
                </Link>
              </div>
            ) : null}
          </aside>
        </div>
      </div>
      <MarketplaceFooter />
    </div>
  );
}
