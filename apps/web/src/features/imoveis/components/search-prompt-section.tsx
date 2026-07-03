"use client";

import { Search } from "lucide-react";
import { useTranslations } from "next-intl";

export function SearchPromptSection() {
  const t = useTranslations("imoveis.results");

  return (
    <section className="market-section-compact">
      <div className="market-container">
        <div className="rounded-2xl border border-dashed border-white/15 bg-white/[0.02] px-6 py-12 text-center sm:px-10">
          <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-[#1d4ed8]/15">
            <Search className="size-6 text-[#60a5fa]" />
          </div>
          <h2 className="mt-5 text-lg font-semibold text-white">{t("searchPrompt")}</h2>
          <p className="mx-auto mt-2 max-w-lg text-sm text-white/50">{t("searchPromptHint")}</p>
        </div>
      </div>
    </section>
  );
}
