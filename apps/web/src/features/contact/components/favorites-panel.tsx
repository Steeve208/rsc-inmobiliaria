"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/routing";
import { useFavorites } from "@/hooks/use-favorites";
import { PropertyCard } from "@/features/imoveis/components/property-card";
import { VehicleCard } from "@/features/veiculos/components/vehicle-card";
import type { PropertyListing } from "@/features/imoveis/types";
import type { VehicleListing } from "@/features/veiculos/types";

export function FavoritesPanel() {
  const t = useTranslations("veiculos.dashboard");
  const { favorites, loading, isLoggedIn } = useFavorites();
  const [properties, setProperties] = useState<PropertyListing[]>([]);
  const [vehicles, setVehicles] = useState<VehicleListing[]>([]);

  useEffect(() => {
    if (!isLoggedIn || favorites.length === 0) {
      setProperties([]);
      setVehicles([]);
      return;
    }

    async function load() {
      const propertyIds = favorites
        .filter((f) => f.listingKind === "property")
        .map((f) => f.listingId);
      const vehicleIds = favorites
        .filter((f) => f.listingKind === "vehicle")
        .map((f) => f.listingId);

      const [propRes, vehRes] = await Promise.all([
        fetch("/api/listings/properties"),
        fetch("/api/listings/vehicles"),
      ]);

      const allProps = (await propRes.json()) as PropertyListing[];
      const allVehs = (await vehRes.json()) as VehicleListing[];

      setProperties(allProps.filter((p) => propertyIds.includes(p.id)));
      setVehicles(allVehs.filter((v) => vehicleIds.includes(v.id)));
    }

    void load();
  }, [favorites, isLoggedIn]);

  if (!isLoggedIn) {
    return (
      <p className="text-muted-foreground">
        {t("favoritesEmpty")}{" "}
        <Link href="/entrar" className="text-primary hover:underline">
          Entrar
        </Link>
      </p>
    );
  }

  if (loading) {
    return <p className="text-muted-foreground">...</p>;
  }

  const total = properties.length + vehicles.length;
  if (total === 0) {
    return <p className="text-muted-foreground">{t("favoritesEmpty")}</p>;
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {properties.map((item) => (
        <PropertyCard key={item.id} item={item} variant="gallery" />
      ))}
      {vehicles.map((item) => (
        <VehicleCard key={item.id} item={item} variant="gallery" />
      ))}
    </div>
  );
}
