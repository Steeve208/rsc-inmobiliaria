"use client";

import { useMessages, useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/routing";
import { marketplace } from "@/lib/layout/marketplace";
import { cn } from "@/lib/utils";
import { LEGAL_SLUGS, type LegalSlug } from "../types";

type Section = {
  title: string;
  paragraphs?: Record<string, string> | string[];
  bullets?: Record<string, string> | string[];
};

type LegalDocMessages = {
  title: string;
  updated?: string;
  intro?: string;
  sections?: Record<string, Section>;
};

function toList(value?: Record<string, string> | string[]): string[] {
  if (!value) return [];
  if (Array.isArray(value)) return value.filter(Boolean);
  return Object.keys(value)
    .sort((a, b) => Number(a) - Number(b))
    .map((key) => value[key])
    .filter(Boolean);
}

export function LegalDocumentPage({ slug }: { slug: LegalSlug }) {
  const t = useTranslations(`legalPages.${slug}`);
  const tCommon = useTranslations("legalPages.common");
  const messages = useMessages() as {
    legalPages?: Record<string, LegalDocMessages>;
  };

  const doc = messages.legalPages?.[slug];
  const sectionKeys = Object.keys(doc?.sections ?? {}).sort(
    (a, b) => Number(a) - Number(b),
  );

  const related = LEGAL_SLUGS.filter((item) => item !== slug);

  return (
    <div className="relative overflow-hidden">
      <section className="border-b border-white/8 bg-gradient-to-b from-[#0a1628]/80 to-[#000810]">
        <div className={cn(marketplace.container, "py-12 lg:py-16")}>
          <div className="mx-auto max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#d4a017]">
              {tCommon("badge")}
            </p>
            <h1 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              {t("title")}
            </h1>
            {doc?.updated ? (
              <p className="mt-3 text-xs text-white/35">{t("updated")}</p>
            ) : null}
            {doc?.intro ? (
              <p className="mt-5 text-base leading-relaxed text-white/60 sm:text-lg">
                {t("intro")}
              </p>
            ) : null}
          </div>
        </div>
      </section>

      <section className="market-section pb-12 lg:pb-16">
        <div className={marketplace.container}>
          <article className="mx-auto max-w-3xl space-y-10">
            {sectionKeys.map((key) => {
              const section = doc?.sections?.[key];
              if (!section) return null;
              const paragraphs = toList(section.paragraphs);
              const bullets = toList(section.bullets);

              return (
                <div key={key}>
                  <h2 className="text-lg font-semibold text-white sm:text-xl">
                    {t(`sections.${key}.title`)}
                  </h2>
                  <div className="mt-4 space-y-3 text-sm leading-relaxed text-white/55 sm:text-[15px]">
                    {paragraphs.map((_, index) => (
                      <p key={index}>{t(`sections.${key}.paragraphs.${index}`)}</p>
                    ))}
                    {bullets.length > 0 ? (
                      <ul className="list-disc space-y-2 pl-5">
                        {bullets.map((_, index) => (
                          <li key={index}>{t(`sections.${key}.bullets.${index}`)}</li>
                        ))}
                      </ul>
                    ) : null}
                  </div>
                </div>
              );
            })}

            <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-6">
              <p className="text-sm font-medium text-white">{tCommon("contactTitle")}</p>
              <p className="mt-2 text-sm leading-relaxed text-white/55">
                {tCommon("contactBody")}{" "}
                <a
                  href="mailto:support@rscmarket.com"
                  className="text-[#60a5fa] transition-colors hover:text-[#93c5fd]"
                >
                  support@rscmarket.com
                </a>
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Link
                  href="/help#contact"
                  className="inline-flex h-10 items-center justify-center rounded-lg bg-[#d4a017] px-4 text-sm font-semibold text-[#000a1a] transition-colors hover:bg-[#c39216]"
                >
                  {tCommon("contactCta")}
                </Link>
                <Link
                  href="/help"
                  className="inline-flex h-10 items-center justify-center rounded-lg bg-white/10 px-4 text-sm font-semibold text-white transition-colors hover:bg-white/15"
                >
                  {tCommon("helpCta")}
                </Link>
              </div>
            </div>

            <nav aria-label={tCommon("relatedLabel")}>
              <p className="text-xs font-semibold uppercase tracking-wider text-white/35">
                {tCommon("relatedLabel")}
              </p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {related.map((item) => (
                  <li key={item}>
                    <Link
                      href={`/${item}`}
                      className="inline-flex rounded-full border border-white/10 px-3 py-1.5 text-xs text-white/60 transition-colors hover:border-[#d4a017]/40 hover:text-[#fbbf24]"
                    >
                      {tCommon(`links.${item}`)}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </article>
        </div>
      </section>
    </div>
  );
}
