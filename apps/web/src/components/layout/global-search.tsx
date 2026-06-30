"use client";

import { useState } from "react";
import { ChevronDown, Search } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/lib/i18n/routing";
import { cn } from "@/lib/utils";

type SearchCategory = "properties" | "vehicles" | "companies";

const routes: Record<SearchCategory, string> = {
  properties: "/imoveis",
  vehicles: "/veiculos",
  companies: "/search",
};

export function GlobalSearch() {
  const t = useTranslations("nav.globalSearch");
  const router = useRouter();
  const [category, setCategory] = useState<SearchCategory>("properties");
  const [query, setQuery] = useState("");

  const placeholders: Record<SearchCategory, string> = {
    properties: t("propertiesPlaceholder"),
    vehicles: t("vehiclesPlaceholder"),
    companies: t("companiesPlaceholder"),
  };

  const labels: Record<SearchCategory, string> = {
    properties: t("properties"),
    vehicles: t("vehicles"),
    companies: t("companies"),
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query.trim()) params.set("q", query.trim());
    if (category === "companies") params.set("category", "companies");
    const qs = params.toString();
    router.push(`${routes[category]}${qs ? `?${qs}` : ""}`);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="hidden min-w-0 flex-1 lg:flex lg:max-w-2xl xl:max-w-3xl"
    >
      <div className="flex w-full overflow-hidden rounded-lg ring-1 ring-white/15 focus-within:ring-[#d4a017]/60">
        <div className="relative shrink-0">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as SearchCategory)}
            className="h-10 cursor-pointer appearance-none border-r border-white/10 bg-[#0d1a2e] py-0 pl-3 pr-8 text-sm font-medium text-white/90 outline-none hover:bg-[#111f35]"
            aria-label={t("categoryLabel")}
          >
            {(Object.keys(routes) as SearchCategory[]).map((key) => (
              <option key={key} value={key} className="bg-[#0d1a2e] text-white">
                {labels[key]}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-2 top-1/2 size-3.5 -translate-y-1/2 text-white/40" />
        </div>

        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholders[category]}
          className="min-w-0 flex-1 bg-white px-4 text-sm text-gray-900 outline-none placeholder:text-gray-400"
        />

        <button
          type="submit"
          className={cn(
            "flex shrink-0 items-center justify-center gap-1.5 bg-[#d4a017] px-4 text-sm font-semibold text-[#000a1a] transition-colors hover:bg-[#c39216]",
          )}
          aria-label={t("submit")}
        >
          <Search className="size-4" strokeWidth={2.25} />
          <span className="hidden xl:inline">{t("submit")}</span>
        </button>
      </div>
    </form>
  );
}
