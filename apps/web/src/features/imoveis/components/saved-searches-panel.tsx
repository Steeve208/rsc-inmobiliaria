"use client";

import { useSavedPropertySearches } from "@/hooks/use-saved-property-searches";
import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/routing";
import { imoveisFiltersToParams } from "@/lib/imoveis/search-params";
import { Trash2 } from "lucide-react";

export function SavedSearchesPanel() {
  const t = useTranslations("dashboard.savedSearches");
  const { searches, removeSearch } = useSavedPropertySearches();

  if (searches.length === 0) {
    return (
      <section className="rounded-lg bg-muted/30 p-12 text-center">
        <p className="font-medium">{t("emptyTitle")}</p>
        <p className="mt-1 text-sm text-muted-foreground">{t("emptyBody")}</p>
        <Link
          href="/imoveis"
          className="mt-4 inline-block text-sm font-medium text-primary hover:underline"
        >
          {t("browse")}
        </Link>
      </section>
    );
  }

  return (
    <section className="space-y-3">
      {searches.map((search) => {
        const qs = imoveisFiltersToParams(search.filters).toString();
        return (
          <article
            key={search.id}
            className="flex items-center justify-between gap-3 rounded-lg border border-border/60 bg-card p-4"
          >
            <div>
              <p className="font-medium">{search.label}</p>
              <p className="text-xs text-muted-foreground">
                {new Date(search.savedAt).toLocaleDateString()}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Link
                href={`/imoveis${qs ? `?${qs}` : ""}`}
                className="text-sm font-medium text-primary hover:underline"
              >
                {t("open")}
              </Link>
              <button
                type="button"
                onClick={() => removeSearch(search.id)}
                className="rounded p-1 text-muted-foreground hover:text-foreground"
                aria-label={t("remove")}
              >
                <Trash2 className="size-4" />
              </button>
            </div>
          </article>
        );
      })}
    </section>
  );
}
