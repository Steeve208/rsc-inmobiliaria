"use client";

import { useMemo, useState, type ReactNode } from "react";
import {
  ArrowRight,
  BookOpen,
  Building2,
  Download,
  Globe2,
  Heart,
  Landmark,
  LineChart,
  Search,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/routing";
import { ListingImage } from "@/components/listing-image";
import { MarketplaceFooter } from "@/components/marketplace/marketplace-footer";
import {
  MAGAZINE_CATEGORIES,
  type MagazineCategory,
  type MagazineIssue,
} from "../types";

type Props = {
  magazines: MagazineIssue[];
  canPublish?: boolean;
};

const TOPIC_ICONS = {
  market: TrendingUp,
  luxury: Landmark,
  investment: LineChart,
  architecture: Building2,
  lifestyle: Heart,
} as const;

const ARCHIVE_YEARS = [2026, 2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018];

function formatMonthYear(value: string, locale: string) {
  const date = new Date(`${value}T12:00:00.000Z`);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat(locale, {
    month: "short",
    year: "numeric",
  }).format(date);
}

function sortByDate(items: MagazineIssue[]) {
  return [...items].sort(
    (a, b) =>
      new Date(`${b.publishedAt}T12:00:00.000Z`).getTime() -
      new Date(`${a.publishedAt}T12:00:00.000Z`).getTime(),
  );
}

function yearOf(item: MagazineIssue) {
  return Number(item.publishedAt.slice(0, 4));
}

export function RevistasPage({ magazines, canPublish = false }: Props) {
  const t = useTranslations("revistas");
  const locale = useLocale();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<MagazineCategory | "">("");
  const [year, setYear] = useState<number | null>(null);

  const sorted = useMemo(() => sortByDate(magazines), [magazines]);

  const results = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return sorted.filter((item) => {
      if (category && item.category !== category) return false;
      if (year && yearOf(item) !== year) return false;
      if (!needle) return true;
      return [item.title, item.excerpt, item.issueLabel, item.author]
        .join(" ")
        .toLowerCase()
        .includes(needle);
    });
  }, [category, query, sorted, year]);

  const featured =
    sorted.find((item) => item.slug === "iconic-penthouses-around-the-world") ??
    sorted[1] ??
    sorted[0];

  const latest = results.slice(0, 10);
  const popular = sorted.slice(0, 5);

  const topicCounts = useMemo(() => {
    return MAGAZINE_CATEGORIES.map((cat) => ({
      category: cat,
      count: sorted.filter((item) => item.category === cat).length,
    }));
  }, [sorted]);

  const yearCounts = useMemo(() => {
    const map = new Map<number, number>();
    for (const item of sorted) {
      const y = yearOf(item);
      map.set(y, (map.get(y) ?? 0) + 1);
    }
    return ARCHIVE_YEARS.map((y) => ({
      year: y,
      count: map.get(y) ?? 0,
    }));
  }, [sorted]);

  return (
    <div className="bg-[#070B14] text-white">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0">
          <ListingImage
            src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=2000&q=80"
            alt=""
            fill
            variant="hero"
            className="object-cover opacity-[0.28]"
            sizes="100vw"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#070B14] via-[#070B14]/88 to-[#070B14]/55" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#070B14] via-transparent to-[#070B14]/40" />
        </div>

        <div className="rk-container relative grid gap-10 py-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(280px,0.95fr)] lg:items-center lg:py-12">
          <div className="min-w-0">
            <nav className="text-xs text-white/50">
              <Link href="/" className="hover:text-[#EBAD5B]">
                {t("breadcrumbHome")}
              </Link>
              <span className="mx-1.5 text-white/30">›</span>
              <span className="text-white/75">{t("breadcrumb")}</span>
            </nav>

            <h1 className="rk-display mt-4 text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-[3.25rem]">
              {t("title")}
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/65 sm:text-base">
              {t("subtitle")}
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              <TopicPill
                active={!category}
                label={t("allCategories")}
                onClick={() => {
                  setCategory("");
                  setYear(null);
                }}
              />
              {MAGAZINE_CATEGORIES.map((item) => (
                <TopicPill
                  key={item}
                  active={category === item}
                  label={t(`category.${item}`)}
                  onClick={() => {
                    setCategory(item);
                    setYear(null);
                  }}
                />
              ))}
            </div>

            <label className="relative mt-5 block max-w-xl">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-white/40" />
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={t("searchPlaceholder")}
                className="h-12 w-full rounded-full border border-white/15 bg-white/5 pl-11 pr-4 text-sm text-white outline-none placeholder:text-white/40 focus:border-[#EBAD5B]/70"
              />
            </label>

            {canPublish ? (
              <Link
                href="/admin/revistas"
                className="mt-4 inline-flex h-10 items-center rounded-md bg-[#EBAD5B] px-4 text-sm font-bold text-[#1A1205] hover:bg-[#F0BC73]"
              >
                {t("publishCta")}
              </Link>
            ) : null}
          </div>

          <HeroCoverStack magazines={sorted.slice(0, 3)} />
        </div>
      </section>

      <div className="rk-container py-8 sm:py-10">
        {results.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-6 py-16 text-center">
            <p className="font-semibold">{t("empty")}</p>
            <p className="mt-1 text-sm text-white/50">{t("emptyHint")}</p>
          </div>
        ) : (
          <>
            {/* Latest issues */}
            <section>
              <SectionHead
                title={t("latestIssues")}
                action={
                  <button
                    type="button"
                    onClick={() => {
                      setCategory("");
                      setYear(null);
                      setQuery("");
                    }}
                    className="inline-flex items-center gap-1 text-sm font-semibold text-[#EBAD5B] hover:underline"
                  >
                    {t("viewAllIssues")}
                    <ArrowRight className="size-3.5" />
                  </button>
                }
              />
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                {latest.map((item) => (
                  <IssueCard
                    key={item.id}
                    magazine={item}
                    dateLabel={formatMonthYear(item.publishedAt, locale)}
                  />
                ))}
              </div>
            </section>

            {/* Featured issue */}
            {featured ? (
              <FeaturedIssue
                magazine={featured}
                dateLabel={formatMonthYear(featured.publishedAt, locale)}
              />
            ) : null}

            {/* Popular this month */}
            <section className="mt-12">
              <SectionHead title={t("popularTitle")} />
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                {popular.map((item, index) => (
                  <PopularCard
                    key={item.id}
                    magazine={item}
                    rank={index + 1}
                    dateLabel={formatMonthYear(item.publishedAt, locale)}
                  />
                ))}
              </div>
            </section>

            {/* Explore topics */}
            <section className="mt-12">
              <SectionHead title={t("exploreTopics")} />
              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {topicCounts.map(({ category: cat, count }) => {
                  const Icon = TOPIC_ICONS[cat];
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => {
                        setCategory(cat);
                        setYear(null);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4 text-left transition hover:border-[#EBAD5B]/45 hover:bg-white/[0.05]"
                    >
                      <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#EBAD5B]/12 text-[#EBAD5B]">
                        <Icon className="size-5" strokeWidth={1.8} />
                      </span>
                      <span className="min-w-0">
                        <span className="block text-base font-bold text-white">
                          {t(`category.${cat}`)}
                        </span>
                        <span className="mt-0.5 block text-sm text-white/50">
                          {t("topicCount", { count })}
                        </span>
                      </span>
                    </button>
                  );
                })}
                <Link
                  href="/imoveis?featured=1"
                  className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4 transition hover:border-[#EBAD5B]/45 hover:bg-white/[0.05]"
                >
                  <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#EBAD5B]/12 text-[#EBAD5B]">
                    <Sparkles className="size-5" strokeWidth={1.8} />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-base font-bold text-white">
                      {t("topicPremium")}
                    </span>
                    <span className="mt-0.5 block text-sm text-white/50">
                      {t("topicPremiumHint")}
                    </span>
                  </span>
                </Link>
              </div>
            </section>

            {/* Archive by year */}
            <section className="mt-12">
              <SectionHead
                title={t("archiveTitle")}
                action={
                  <button
                    type="button"
                    onClick={() => setYear(null)}
                    className="inline-flex items-center gap-1 text-sm font-semibold text-[#EBAD5B] hover:underline"
                  >
                    {t("viewAllArchive")}
                    <ArrowRight className="size-3.5" />
                  </button>
                }
              />
              <div className="mt-4 flex flex-wrap gap-2">
                {yearCounts.map((item) => {
                  const active = year === item.year;
                  const label =
                    item.count > 0
                      ? `${item.year} (${item.count})`
                      : String(item.year);
                  return (
                    <button
                      key={item.year}
                      type="button"
                      onClick={() =>
                        setYear((current) =>
                          current === item.year ? null : item.year,
                        )
                      }
                      className={
                        active
                          ? "rounded-full bg-[#EBAD5B] px-4 py-2 text-sm font-bold text-[#1A1205]"
                          : "rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white/80 hover:bg-white/15"
                      }
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </section>
          </>
        )}
      </div>

      {/* Magazines trust strip */}
      <section className="border-y border-white/10 bg-[#0B0F19]">
        <div className="rk-container grid gap-5 py-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {(
            [
              { icon: BookOpen, key: "curated" as const },
              { icon: Globe2, key: "global" as const },
              { icon: Sparkles, key: "premium" as const },
              { icon: TrendingUp, key: "updated" as const },
            ] as const
          ).map(({ icon: Icon, key }) => (
            <div key={key} className="flex items-start gap-3">
              <span className="mt-0.5 inline-flex size-9 shrink-0 items-center justify-center text-[#EBAD5B]">
                <Icon className="size-5" strokeWidth={1.75} />
              </span>
              <div className="min-w-0">
                <p className="text-sm font-bold text-white">
                  {t(`trust.${key}.title`)}
                </p>
                <p className="mt-0.5 text-xs leading-relaxed text-white/50">
                  {t(`trust.${key}.text`)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <MarketplaceFooter />
    </div>
  );
}

function SectionHead({
  title,
  action,
}: {
  title: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex items-end justify-between gap-3">
      <h2 className="rk-display text-xl font-bold tracking-tight text-white sm:text-2xl">
        {title}
      </h2>
      {action}
    </div>
  );
}

function TopicPill({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        active
          ? "rounded-full bg-[#EBAD5B] px-3.5 py-1.5 text-xs font-bold text-[#1A1205]"
          : "rounded-full border border-white/25 bg-transparent px-3.5 py-1.5 text-xs font-semibold text-white/85 hover:border-[#EBAD5B]/60 hover:text-[#EBAD5B]"
      }
    >
      {label}
    </button>
  );
}

function HeroCoverStack({ magazines }: { magazines: MagazineIssue[] }) {
  const covers =
    magazines.length > 0
      ? magazines.slice(0, 3)
      : ([
          {
            id: "fallback",
            title: "The Future of Living 2026",
            coverImage:
              "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=900&q=80",
          },
        ] as const);

  return (
    <div className="relative mx-auto hidden h-[340px] w-full max-w-[420px] lg:block">
      {covers.map((item, index) => {
        const offsets = [
          "left-8 top-6 z-30 rotate-[-6deg]",
          "left-24 top-2 z-20 rotate-[4deg]",
          "left-40 top-10 z-10 rotate-[10deg]",
        ];
        return (
          <div
            key={item.id}
            className={`absolute h-[280px] w-[190px] overflow-hidden rounded-md bg-[#111827] shadow-[0_24px_60px_rgba(0,0,0,0.55)] ring-1 ring-white/10 ${offsets[index] ?? offsets[0]}`}
          >
            <ListingImage
              src={item.coverImage}
              alt={item.title}
              fill
              variant="card"
              className="object-cover"
              sizes="190px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30" />
            <div className="absolute inset-x-0 top-0 p-3">
              <p className="text-[10px] font-bold tracking-[0.22em] text-white">
                REESKOVA
              </p>
            </div>
            {index === 0 ? (
              <div className="absolute inset-x-0 bottom-0 p-3">
                <p className="text-[11px] font-semibold leading-snug text-white">
                  {item.title}
                </p>
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

function IssueCard({
  magazine,
  dateLabel,
}: {
  magazine: MagazineIssue;
  dateLabel: string;
}) {
  const t = useTranslations("revistas");
  const year = magazine.publishedAt.slice(0, 4);

  return (
    <Link href={`/revistas/${magazine.slug}`} className="group block">
      <article className="overflow-hidden rounded-xl bg-[#111827] ring-1 ring-white/10 transition hover:-translate-y-0.5 hover:ring-[#EBAD5B]/40">
        <div className="relative aspect-[3/4] overflow-hidden">
          <ListingImage
            src={magazine.coverImage}
            alt={magazine.title}
            fill
            variant="card"
            className="object-cover transition duration-500 group-hover:scale-105"
            sizes="(max-width:640px) 50vw, 20vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/35" />
          <div className="absolute inset-x-0 top-0 p-3">
            <p className="text-[10px] font-bold tracking-[0.2em] text-white">
              REESKOVA
            </p>
            <p className="mt-2 inline-flex rounded bg-[#EBAD5B] px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-[#1A1205]">
              {t(`category.${magazine.category}`)}
            </p>
            <p className="rk-display mt-2 line-clamp-3 text-sm font-bold leading-snug text-white">
              {magazine.title}
            </p>
            <p className="mt-1 text-[10px] font-semibold text-white/60">{year}</p>
          </div>
        </div>
        <div className="flex items-end justify-between gap-2 bg-white px-3 py-2.5 text-[#0B1220]">
          <div className="min-w-0">
            <p className="line-clamp-1 text-[13px] font-bold leading-snug">
              {magazine.title}
            </p>
            <p className="mt-0.5 text-[11px] text-[#6B7285]">
              {dateLabel} · {magazine.issueLabel}
            </p>
          </div>
          <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-md bg-[#F3F4F6] text-[#6B7285] group-hover:bg-[#EBAD5B]/20 group-hover:text-[#8B5A1A]">
            <Download className="size-3.5" />
          </span>
        </div>
      </article>
    </Link>
  );
}

function FeaturedIssue({
  magazine,
  dateLabel,
}: {
  magazine: MagazineIssue;
  dateLabel: string;
}) {
  const t = useTranslations("revistas");

  return (
    <section className="mt-12 overflow-hidden rounded-2xl bg-[#121826] ring-1 ring-white/10">
      <div className="grid lg:grid-cols-[220px_minmax(0,1fr)_200px]">
        <Link
          href={`/revistas/${magazine.slug}`}
          className="relative min-h-[260px] overflow-hidden lg:min-h-full"
        >
          <ListingImage
            src={magazine.coverImage}
            alt={magazine.title}
            fill
            variant="card"
            className="object-cover"
            sizes="220px"
          />
        </Link>

        <div className="flex flex-col justify-center p-6 sm:p-8">
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#EBAD5B]">
            {t("featuredLabel")}
          </p>
          <h3 className="rk-display mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl">
            {magazine.title}
          </h3>
          <p className="mt-2 text-sm text-white/55">
            {dateLabel} · {magazine.issueLabel}
          </p>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/70">
            {magazine.excerpt}
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              href={`/revistas/${magazine.slug}`}
              className="inline-flex h-11 items-center gap-2 rounded-md bg-[#EBAD5B] px-5 text-sm font-bold text-[#1A1205] hover:bg-[#F0BC73]"
            >
              <BookOpen className="size-4" />
              {t("readIssue")}
            </Link>
            {magazine.pdfUrl ? (
              <a
                href={magazine.pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-11 items-center gap-2 rounded-md border border-[#EBAD5B]/70 px-5 text-sm font-bold text-[#EBAD5B] hover:bg-[#EBAD5B]/10"
              >
                <Download className="size-4" />
                {t("openPdf")}
              </a>
            ) : (
              <Link
                href={`/revistas/${magazine.slug}`}
                className="inline-flex h-11 items-center gap-2 rounded-md border border-[#EBAD5B]/70 px-5 text-sm font-bold text-[#EBAD5B] hover:bg-[#EBAD5B]/10"
              >
                <Download className="size-4" />
                {t("openPdf")}
              </Link>
            )}
          </div>
        </div>

        <div className="flex flex-row gap-0 border-t border-white/10 lg:flex-col lg:border-l lg:border-t-0">
          {(
            [
              { value: "132", labelKey: "statPages" as const },
              { value: "24", labelKey: "statProperties" as const },
              { value: "18", labelKey: "statCities" as const },
            ] as const
          ).map((stat, index) => (
            <div
              key={stat.labelKey}
              className={`flex flex-1 flex-col justify-center px-5 py-5 ${
                index > 0 ? "border-l border-white/10 lg:border-l-0 lg:border-t" : ""
              }`}
            >
              <p className="rk-display text-2xl font-bold text-white sm:text-3xl">
                {stat.value}
              </p>
              <p className="mt-1 text-xs text-white/50">{t(stat.labelKey)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function PopularCard({
  magazine,
  rank,
  dateLabel,
}: {
  magazine: MagazineIssue;
  rank: number;
  dateLabel: string;
}) {
  return (
    <Link href={`/revistas/${magazine.slug}`} className="group block">
      <article className="overflow-hidden rounded-xl bg-[#111827] ring-1 ring-white/10 transition hover:ring-[#EBAD5B]/40">
        <div className="relative aspect-[4/3] overflow-hidden">
          <ListingImage
            src={magazine.coverImage}
            alt={magazine.title}
            fill
            variant="card"
            className="object-cover transition duration-500 group-hover:scale-105"
            sizes="(max-width:640px) 50vw, 20vw"
          />
          <span className="absolute bottom-2 left-2 inline-flex size-7 items-center justify-center rounded-md bg-[#EBAD5B] text-xs font-bold text-[#1A1205]">
            {rank}
          </span>
        </div>
        <div className="p-3">
          <p className="line-clamp-2 text-sm font-bold leading-snug text-white">
            {magazine.title}
          </p>
          <p className="mt-1 text-[11px] text-white/45">{dateLabel}</p>
        </div>
      </article>
    </Link>
  );
}
