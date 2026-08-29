"use client";

import { useEffect, useState, useTransition } from "react";
import { ChevronDown, Loader2, Search, Sparkles } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/lib/i18n/routing";
import { tryCreateMatchSession } from "@/lib/match/client";
import {
  HEADER_SEARCH_CATEGORIES,
  type MarketplaceSearchCategory,
} from "@/lib/marketplace/catalog";
import { cn } from "@/lib/utils";

const routes: Record<MarketplaceSearchCategory, string> = {
  all: "/search",
  properties: "/imoveis",
  vehicles: "/veiculos",
  projects: "/projetos",
  businesses: "/negocios",
  services: "/services",
};

function categoryFromPath(pathname: string): MarketplaceSearchCategory {
  if (pathname === "/veiculos" || pathname.startsWith("/veiculos/")) return "vehicles";
  if (pathname === "/projetos" || pathname.startsWith("/projetos/")) return "projects";
  if (pathname === "/negocios" || pathname.startsWith("/negocios/")) return "businesses";
  if (pathname === "/imoveis" || pathname.startsWith("/imoveis/")) return "properties";
  if (pathname === "/services" || pathname.startsWith("/services/")) return "services";
  return "all";
}

export function GlobalSearch({ className }: { className?: string }) {
  const t = useTranslations("marketplace.headerSearch");
  const tSearch = useTranslations("marketplace.search");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const [category, setCategory] = useState<MarketplaceSearchCategory>(() =>
    categoryFromPath(pathname),
  );
  const [query, setQuery] = useState("");
  const [useAi, setUseAi] = useState(false);

  useEffect(() => {
    setCategory(categoryFromPath(pathname));
  }, [pathname]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const q = query.trim();
    const base = routes[category];
    startTransition(async () => {
      if (useAi && q.length >= 2) {
        const message =
          category === "all" || category === "properties"
            ? q
            : `${category}. ${q}`;
        const session = await tryCreateMatchSession({
          message,
          locale,
          source: "header",
        });
        if (session?.sessionId) {
          router.push(`/match/${session.sessionId}`);
          return;
        }
      }
      if (!q) {
        router.push(base);
        return;
      }
      const url = new URL(base, "http://local.invalid");
      url.searchParams.set("q", q);
      router.push(`${url.pathname}${url.search}`);
    });
  };

  return (
    <form onSubmit={handleSubmit} className={className}>
      <div className="flex h-11 w-full overflow-hidden rounded-full bg-white shadow-[0_8px_24px_rgba(0,0,0,.18)]">
        <div className="relative shrink-0">
          <select
            value={category}
            onChange={(event) =>
              setCategory(event.target.value as MarketplaceSearchCategory)
            }
            className="h-full max-w-[130px] cursor-pointer appearance-none rounded-l-full border-r border-[#E8E4D8] bg-transparent py-0 pl-4 pr-7 text-xs font-semibold text-[#0B1220] outline-none sm:max-w-none sm:text-sm"
            aria-label={t("categoryLabel")}
          >
            {HEADER_SEARCH_CATEGORIES.map((key) => (
              <option key={key} value={key}>
                {t(`categories.${key}`)}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-1.5 top-1/2 size-3.5 -translate-y-1/2 text-[#6B7285]" />
        </div>
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={t(`placeholders.${category}`)}
          className="min-w-0 flex-1 px-3 text-sm text-[#0B1220] outline-none placeholder:text-[#9CA3AF]"
        />
        <button
          type="button"
          aria-pressed={useAi}
          aria-label={tSearch("useAi")}
          onClick={() => setUseAi((current) => !current)}
          className={cn(
            "inline-flex shrink-0 items-center justify-center px-2 text-[#6B7285] transition hover:text-[#D49A3F]",
            useAi && "text-[#D49A3F]",
          )}
        >
          <Sparkles className="size-4" strokeWidth={2} />
        </button>
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex w-12 shrink-0 items-center justify-center rounded-r-full bg-[#EBAD5B] text-[#1A1205] transition hover:bg-[#F2C06E] disabled:opacity-70 sm:w-14"
          aria-label={t("submit")}
        >
          {isPending ? (
            <Loader2 className="size-5 animate-spin" />
          ) : (
            <Search className="size-5" strokeWidth={2.25} />
          )}
        </button>
      </div>
    </form>
  );
}
