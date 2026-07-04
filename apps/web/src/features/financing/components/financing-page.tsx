"use client";

import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { FinancingSimulator } from "./financing-simulator";
import type { ListingCategory } from "@/lib/leads/types";

export function FinancingPage() {
  const t = useTranslations("financing");
  const searchParams = useSearchParams();

  const initialPrice = Number(searchParams.get("price") || 500000);
  const initialDownPct = Number(searchParams.get("down") || 20);
  const listingId = searchParams.get("listingId") ?? "";
  const listingTitle = searchParams.get("title") ?? "";
  const listingCategory = (searchParams.get("category") ?? "properties") as ListingCategory;
  const currency = searchParams.get("currency") ?? "BRL";

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">{t("title")}</h1>
        <p className="mt-2 text-white/60">{t("subtitle")}</p>
      </div>

      <FinancingSimulator
        initialPrice={initialPrice}
        initialDownPct={initialDownPct}
        listingId={listingId}
        listingTitle={listingTitle}
        listingCategory={listingCategory}
        currency={currency}
      />
    </div>
  );
}
