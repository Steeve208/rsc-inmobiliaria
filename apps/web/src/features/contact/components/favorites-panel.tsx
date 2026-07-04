"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/routing";
import { useFavorites } from "@/hooks/use-favorites";
import { fetchFavoriteListings } from "@/lib/favorites/listings-client";
import { PropertyCard } from "@/features/imoveis/components/property-card";
import { VehicleCard } from "@/features/veiculos/components/vehicle-card";
import type { PropertyListing } from "@/features/imoveis/types";
import type { VehicleListing } from "@/features/veiculos/types";

export function FavoritesPanel() {
  const t = useTranslations("favorites");
  const { favorites, loading, isLoggedIn, isSynced } = useFavorites();
  const [properties, setProperties] = useState<PropertyListing[]>([]);
  const [vehicles, setVehicles] = useState<VehicleListing[]>([]);
  const [listingsLoading, setListingsLoading] = useState(false);

  useEffect(() => {
    if (favorites.length === 0) {
      setProperties([]);
      setVehicles([]);
      setListingsLoading(false);
      return;
    }

    let cancelled = false;
    setListingsLoading(true);

    fetchFavoriteListings(
      favorites.map(({ listingKind, listingId }) => ({ listingKind, listingId })),
    )
      .then(({ properties: nextProperties, vehicles: nextVehicles }) => {
        if (cancelled) return;
        setProperties(nextProperties);
        setVehicles(nextVehicles);
      })
      .catch(() => {
        if (cancelled) return;
        setProperties([]);
        setVehicles([]);
      })
      .finally(() => {
        if (!cancelled) setListingsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [favorites]);

  if (loading || listingsLoading) {
    return <p className="text-muted-foreground">{t("loading")}</p>;
  }

  const total = properties.length + vehicles.length;
  if (total === 0) {
    return (
      <div className="space-y-3">
        <p className="text-muted-foreground">{t("empty")}</p>
        {!isLoggedIn ? (
          <p className="text-sm text-muted-foreground">
            {t("guestHint")}{" "}
            <Link href="/entrar" className="text-primary hover:underline">
              {t("signIn")}
            </Link>
          </p>
        ) : null}
      </div>
    );
  }

  return (
    <div className="space-y-6">
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

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {properties.map((item) => (
          <PropertyCard key={item.id} item={item} variant="gallery" />
        ))}
        {vehicles.map((item) => (
          <VehicleCard key={item.id} item={item} variant="gallery" />
        ))}
      </div>
    </div>
  );
}
