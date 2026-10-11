"use client";

import { useMemo, useState, type FormEvent } from "react";
import { ArrowRight, ChevronLeft, ChevronRight, Search } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { MarketplaceFooter } from "@/components/marketplace/marketplace-footer";
import { ResidenceNav } from "@/components/marketplace/residence-nav";
import type { MagazineIssue } from "@/features/revistas/types";
import { Link } from "@/lib/i18n/routing";
import { cn } from "@/lib/utils";

const TOPICS = ["architecture", "destinations", "living", "market"] as const;
type Topic = (typeof TOPICS)[number];
type TopicFilter = "all" | Topic;

const serif = { fontFamily: "var(--font-playfair), Georgia, serif" };

function topicOf(category: string): Topic {
  if (category === "architecture") return "architecture";
  if (category === "lifestyle" || category === "living") return "living";
  if (category === "luxury" || category === "destinations") return "destinations";
  return "market";
}

function readMinutes(body: string) {
  const words = body.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 180) || 1);
}

type Props = {
  articles: MagazineIssue[];
};

export function JournalPage({ articles }: Props) {
  const t = useTranslations("marketplace.journal");
  const locale = useLocale();
  const [topic, setTopic] = useState<TopicFilter>("all");
  const [query, setQuery] = useState("");
  const [featuredIndex, setFeaturedIndex] = useState(0);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return articles.filter((item) => {
      if (topic !== "all" && topicOf(item.category) !== topic) return false;
      if (!needle) return true;
      return [item.title, item.excerpt, item.author, item.issueLabel]
        .join(" ")
        .toLowerCase()
        .includes(needle);
    });
  }, [articles, query, topic]);

  const featuredPool = filtered.slice(0, 4);
  const featured = featuredPool[featuredIndex] ?? featuredPool[0];
  const stories = filtered.slice(1, 3);
  const trending = filtered.slice(0, 4);
  const latest = filtered.slice(3, 7);

  function selectTopic(next: TopicFilter) {
    setTopic(next);
    setFeaturedIndex(0);
  }

  return (
    <div className="bg-[#f6f3ee] text-[#1c1917]">
      <section className="bg-[#0c1016] text-white lg:relative lg:h-[580px]">
        <div className="relative min-h-[22rem] lg:absolute lg:inset-0 lg:min-h-0">
          {featured?.coverImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={featured.coverImage}
              alt=""
              className="absolute inset-0 h-full w-full object-cover object-[center_30%] lg:object-[center_45%]"
            />
          ) : null}
          <div className="absolute inset-0 bg-gradient-to-t from-[#070b10] via-[#070b10]/45 to-[#070b10]/20 lg:bg-gradient-to-r lg:from-[#070b10] lg:via-[#070b10]/78 lg:to-[#070b10]/35" />

          <ResidenceNav className="relative z-20" showJournal />

          <div className="relative z-10 flex min-h-[16rem] flex-col justify-end px-5 pb-10 pt-4 sm:px-8 lg:h-[calc(100%-4rem)] lg:min-h-0 lg:max-w-[calc(100%-22rem)] lg:px-10 lg:pb-16">
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/70 sm:tracking-[0.24em]">
              {t("eyebrow")}
            </p>
            <h1 className="mt-3 max-w-[16ch] text-[length:var(--rk-type-display)] leading-[1.05] lg:max-w-[14ch] lg:text-[3.5rem] lg:leading-[1.02]" style={serif}>
              {t("title")}
            </h1>
            <p className="mt-4 max-w-md text-[14px] leading-relaxed text-white/75">{t("subtitle")}</p>
          </div>
        </div>
        {featured ? (
          <article className="relative z-10 mx-4 -mt-6 mb-6 max-w-md rounded-2xl bg-[#14181e] p-5 lg:absolute lg:bottom-10 lg:end-10 lg:mx-0 lg:mb-0 lg:w-[340px] lg:bg-black/45 lg:backdrop-blur-sm">
              <div className="flex flex-wrap items-center justify-between gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/70">
                <span>{t("featuredLabel")}</span>
                <span className="inline-flex items-center gap-2">
                  {String(featuredIndex + 1).padStart(2, "0")} /{" "}
                  {String(Math.max(featuredPool.length, 1)).padStart(2, "0")}
                  <button
                    type="button"
                    aria-label={t("prev")}
                    disabled={featuredPool.length < 2}
                    onClick={() =>
                      setFeaturedIndex((value) => (value - 1 + featuredPool.length) % featuredPool.length)
                    }
                    className="inline-flex size-11 items-center justify-center disabled:opacity-30"
                  >
                    <ChevronLeft className="size-3.5" />
                  </button>
                  <button
                    type="button"
                    aria-label={t("next")}
                    disabled={featuredPool.length < 2}
                    onClick={() => setFeaturedIndex((value) => (value + 1) % featuredPool.length)}
                    className="inline-flex size-11 items-center justify-center disabled:opacity-30"
                  >
                    <ChevronRight className="size-3.5" />
                  </button>
                </span>
              </div>
              <h2 className="mt-3 text-[clamp(1.35rem,4vw,1.7rem)] leading-tight" style={serif}>
                {featured.title}
              </h2>
              <p className="mt-2 line-clamp-3 text-[13px] leading-relaxed text-white/75">
                {featured.excerpt}
              </p>
              <Link
                href={`/revistas/${featured.slug}`}
                className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-md border border-white/30 px-4 text-[13px] hover:bg-white/10"
              >
                {t("readArticle")}
                <ArrowRight className="size-3.5" />
              </Link>
            </article>
        ) : null}
      </section>

      <div className="border-b border-[#e6e0d6]">
        <div className="mx-auto flex max-w-[1240px] flex-col gap-3 px-5 py-4 md:flex-row md:items-center md:gap-6 lg:px-8">
          <div className="flex min-w-0 gap-2 overflow-x-auto [scrollbar-width:none] md:flex-1 [&::-webkit-scrollbar]:hidden">
            <TopicButton active={topic === "all"} onClick={() => selectTopic("all")}>
              {t("categories.all")}
            </TopicButton>
            {TOPICS.map((id) => (
              <TopicButton key={id} active={topic === id} onClick={() => selectTopic(id)}>
                {t(`categories.${id}`)}
              </TopicButton>
            ))}
          </div>
          <label className="flex min-h-11 w-full min-w-0 items-center gap-2 rounded-full border border-[#e4ddd3] bg-white px-3 py-2 text-[13px] text-[#8a8175] md:w-64 md:shrink-0">
            <input
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setFeaturedIndex(0);
              }}
              placeholder={t("searchPlaceholder")}
              className="min-w-0 flex-1 bg-transparent text-[#1c1917] outline-none placeholder:text-[#a39b92]"
            />
            <Search className="size-3.5" />
          </label>
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="mx-auto max-w-[1240px] px-5 py-16 text-sm text-[#8a8175] lg:px-8">{t("empty")}</p>
      ) : (
        <>
          <section className="mx-auto grid max-w-[1240px] gap-8 px-5 py-10 lg:grid-cols-[minmax(0,1fr)_280px] lg:px-8 lg:[&>aside]:order-none [&>aside]:order-2">
            <div className="grid gap-6">
              {stories.map((item) => (
                <StoryCard key={item.id} item={item} locale={locale} topicLabel={t(`categories.${topicOf(item.category)}`)} minutes={t("minutes", { count: readMinutes(item.body) })} />
              ))}
            </div>
            <aside>
              <h2 className="text-[1.35rem]" style={serif}>
                {t("trending")}
              </h2>
              <ol className="mt-4 space-y-4">
                {trending.map((item, index) => (
                  <li key={item.id}>
                    <Link href={`/revistas/${item.slug}`} className="group flex gap-3">
                      <span className="w-6 pt-1 text-[12px] text-[#8a8175]">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      {item.coverImage ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={item.coverImage} alt="" className="size-14 rounded-md object-cover" />
                      ) : (
                        <span className="size-14 rounded-md bg-[#e7e1d8]" />
                      )}
                      <span className="min-w-0">
                        <span className="line-clamp-2 block text-[14px] leading-snug group-hover:underline" style={serif}>
                          {item.title}
                        </span>
                        <span className="mt-1 block text-[11px] text-[#8a8175]">
                          {t("minutes", { count: readMinutes(item.body) })}
                        </span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ol>
            </aside>
          </section>

          <section className="mx-auto max-w-[1240px] px-5 pb-14 lg:px-8">
            <div className="flex items-end justify-between gap-4">
              <h2 className="text-[length:var(--rk-type-title)]" style={serif}>
                {t("latest")}
              </h2>
              <button
                type="button"
                onClick={() => selectTopic("all")}
                className="inline-flex items-center gap-1.5 text-[13px] text-[#3f3a34]"
              >
                {t("viewAll")}
                <ArrowRight className="size-3.5" />
              </button>
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-[repeat(4,minmax(0,1fr))_260px]">
              {latest.map((item) => (
                <CompactCard
                  key={item.id}
                  item={item}
                  locale={locale}
                  topicLabel={t(`categories.${topicOf(item.category)}`)}
                  minutes={t("minutes", { count: readMinutes(item.body) })}
                />
              ))}
              <NewsletterCard />
            </div>
          </section>
        </>
      )}

      {filtered.length === 0 ? (
        <div className="mx-auto max-w-[1240px] px-5 pb-14 lg:px-8">
          <NewsletterCard />
        </div>
      ) : null}

      <MarketplaceFooter />
    </div>
  );
}

function TopicButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex min-h-11 shrink-0 items-center rounded-full px-3 text-[13px]",
        active ? "bg-[#1c1917] text-white" : "text-[#3f3a34] hover:bg-white",
      )}
    >
      {children}
    </button>
  );
}

function StoryCard({
  item,
  locale,
  topicLabel,
  minutes,
}: {
  item: MagazineIssue;
  locale: string;
  topicLabel: string;
  minutes: string;
}) {
  const date = new Intl.DateTimeFormat(locale, {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(`${item.publishedAt}T12:00:00.000Z`));

  return (
    <Link href={`/revistas/${item.slug}`} className="group grid gap-4 sm:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
      <span className="relative block aspect-[16/10] overflow-hidden rounded-2xl bg-[#1c1917]">
        {item.coverImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={item.coverImage} alt="" className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105" />
        ) : null}
      </span>
      <span className="flex flex-col justify-center py-1">
        <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#8a8175]">
          {topicLabel}
        </span>
        <span className="mt-2 text-[clamp(1.25rem,3.5vw,1.55rem)] leading-tight" style={serif}>
          {item.title}
        </span>
        <span className="mt-2 line-clamp-3 text-[13px] leading-relaxed text-[#5c564e]">
          {item.excerpt}
        </span>
        <span className="mt-3 text-[12px] text-[#8a8175]">
          {date} · {minutes}
        </span>
      </span>
    </Link>
  );
}

function CompactCard({
  item,
  locale,
  topicLabel,
  minutes,
}: {
  item: MagazineIssue;
  locale: string;
  topicLabel: string;
  minutes: string;
}) {
  const date = new Intl.DateTimeFormat(locale, {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(`${item.publishedAt}T12:00:00.000Z`));

  return (
    <Link href={`/revistas/${item.slug}`} className="group block">
      <span className="relative block aspect-[16/10] overflow-hidden rounded-xl bg-[#1c1917]">
        {item.coverImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={item.coverImage} alt="" className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105" />
        ) : null}
      </span>
      <span className="mt-2 block text-[10px] font-semibold uppercase tracking-[0.14em] text-[#8a8175]">
        {topicLabel}
      </span>
      <span className="mt-1 block text-[15px] leading-snug" style={serif}>
        {item.title}
      </span>
      <span className="mt-1 block text-[11px] text-[#8a8175]">
        {date} · {minutes}
      </span>
    </Link>
  );
}

function NewsletterCard() {
  const t = useTranslations("marketplace.journal");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "done" | "error">("idle");

  async function submit(event: FormEvent) {
    event.preventDefault();
    setStatus("idle");
    const response = await fetch("/api/journal/subscribe", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email }),
    });
    setStatus(response.ok ? "done" : "error");
    if (response.ok) setEmail("");
  }

  return (
    <form onSubmit={submit} className="flex h-full flex-col justify-between rounded-2xl bg-[#14181e] p-5 text-white">
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#c4a574]">
          {t("newsletterEyebrow")}
        </p>
        <p className="mt-3 text-[1.45rem] leading-tight" style={serif}>
          {t("newsletterTitle")}
        </p>
        <p className="mt-2 text-[13px] leading-relaxed text-white/65">{t("newsletterText")}</p>
      </div>
      <div className="mt-5">
        <div className="flex flex-col gap-2 min-[400px]:flex-row">
          <input
            type="email"
            required
            inputMode="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder={t("emailPlaceholder")}
            className="h-11 min-w-0 flex-1 rounded-md border border-white/15 bg-white/5 px-3 text-[13px] outline-none placeholder:text-white/40"
          />
          <button type="submit" className="h-11 shrink-0 rounded-md bg-[#c4a574] px-4 text-[12px] font-semibold text-[#1c1917]">
            {t("subscribe")}
          </button>
        </div>
        {status === "done" ? <p className="mt-2 text-[12px] text-[#c4a574]">{t("subscribed")}</p> : null}
        {status === "error" ? <p className="mt-2 text-[12px] text-red-300">{t("invalidEmail")}</p> : null}
      </div>
    </form>
  );
}
