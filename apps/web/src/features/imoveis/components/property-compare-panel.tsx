"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { GitCompare, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/routing";
import { usePropertyCompare } from "@/hooks/use-property-compare-state";
import type { PropertyListing } from "@/features/imoveis/types";

function formatPrice(price: number, currency: string) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(price);
}

export function PropertyComparePanel() {
  const t = useTranslations("dashboard.comparePanel");
  const { ids, remove, clear } = usePropertyCompare();
  const [properties, setProperties] = useState<PropertyListing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (ids.length === 0) {
      setProperties([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    fetch("/api/listings/properties")
      .then((r) => r.json())
      .then((data: PropertyListing[]) => {
        setProperties(data.filter((p) => ids.includes(p.id)));
      })
      .catch(() => setProperties([]))
      .finally(() => setLoading(false));
  }, [ids]);

  if (loading) {
    return <p className="text-muted-foreground">{t("loading")}</p>;
  }

  if (ids.length === 0) {
    return (
      <section className="rounded-lg bg-muted/30 p-12 text-center">
        <GitCompare className="mx-auto size-10 text-muted-foreground" />
        <p className="mt-4 font-medium">{t("emptyTitle")}</p>
        <p className="mt-1 text-sm text-muted-foreground">{t("emptyBody")}</p>
        <Link
          href="/imoveis"
          className="mt-4 inline-block text-sm font-medium text-primary hover:underline"
        >
          {t("browseProperties")}
        </Link>
      </section>
    );
  }

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold">{t("title")}</h2>
        <button
          type="button"
          onClick={clear}
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          {t("clear")}
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {properties.map((item) => (
          <article
            key={item.id}
            className="overflow-hidden rounded-xl border border-border/60 bg-card"
          >
            <div className="relative aspect-[4/3]">
              <Image src={item.image} alt={item.title} fill className="object-cover" />
              <button
                type="button"
                onClick={() => remove(item.id)}
                className="absolute right-2 top-2 rounded-full bg-black/50 p-1.5 text-white"
                aria-label={t("remove")}
              >
                <X className="size-4" />
              </button>
            </div>
            <div className="space-y-2 p-4 text-sm">
              <Link href={`/imoveis/${item.id}`} className="font-semibold hover:underline">
                {item.title}
              </Link>
              <p className="text-muted-foreground">
                {item.city} · {formatPrice(item.price, item.currency)}
              </p>
              <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                <span>
                  {t("bedrooms")}: {item.bedrooms}
                </span>
                <span>
                  {t("area")}: {item.area} m²
                </span>
                <span>
                  {t("garage")}: {item.garage}
                </span>
                <span>
                  {t("type")}: {item.type}
                </span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
