"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { GitCompare, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/routing";
import { useVehicleCompare } from "@/hooks/use-vehicle-compare-state";
import { fetchVehiclesByIds } from "@/lib/listings/vehicles-by-ids-client";
import type { VehicleListing } from "@/features/veiculos/types";

function formatPrice(price: number, currency: string) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(price);
}

export function VehicleComparePanel() {
  const t = useTranslations("dashboard.vehicleComparePanel");
  const { ids, remove, clear, loading: compareLoading, isLoggedIn, isSynced } =
    useVehicleCompare();
  const [vehicles, setVehicles] = useState<VehicleListing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (ids.length === 0) {
      setVehicles([]);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);

    fetchVehiclesByIds(ids)
      .then((data) => {
        if (!cancelled) setVehicles(data);
      })
      .catch(() => {
        if (!cancelled) setVehicles([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [ids]);

  if (compareLoading || loading) {
    return <p className="text-muted-foreground">{t("loading")}</p>;
  }

  if (ids.length === 0) {
    return (
      <section className="rounded-lg bg-muted/30 p-12 text-center">
        <GitCompare className="mx-auto size-10 text-muted-foreground" />
        <p className="mt-4 font-medium">{t("emptyTitle")}</p>
        <p className="mt-1 text-sm text-muted-foreground">{t("emptyBody")}</p>
        {!isLoggedIn ? (
          <p className="mt-3 text-sm text-muted-foreground">
            {t("guestHint")}{" "}
            <Link href="/entrar" className="text-primary hover:underline">
              {t("signIn")}
            </Link>
          </p>
        ) : null}
        <Link
          href="/veiculos"
          className="mt-4 inline-block text-sm font-medium text-primary hover:underline"
        >
          {t("browseVehicles")}
        </Link>
      </section>
    );
  }

  return (
    <section className="space-y-4">
      {!isLoggedIn ? (
        <p className="rounded-lg border border-[#d4a017]/25 bg-[#d4a017]/10 px-4 py-3 text-sm text-white/75">
          {t("guestSyncBanner")}{" "}
          <Link href="/entrar" className="font-medium text-[#fbbf24] hover:underline">
            {t("signIn")}
          </Link>
        </p>
      ) : null}
      {isLoggedIn && isSynced ? (
        <p className="text-sm text-muted-foreground">{t("syncedHint")}</p>
      ) : null}

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
        {vehicles.map((item) => (
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
              <Link href={`/veiculos/${item.id}`} className="font-semibold hover:underline">
                {item.title}
              </Link>
              <p className="text-muted-foreground">
                {item.city} · {formatPrice(item.price, item.currency)}
              </p>
              <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                <span>
                  {t("year")}: {item.year}
                </span>
                <span>
                  {t("mileage")}: {item.mileage.toLocaleString()} km
                </span>
                <span>
                  {t("fuel")}: {item.fuel}
                </span>
                <span>
                  {t("transmission")}: {item.transmission}
                </span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
