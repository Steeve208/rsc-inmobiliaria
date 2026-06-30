"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { ListingCarousel } from "./listing-carousel";
import type { VehicleListing } from "../types";

export function FeaturedSection() {
  const t = useTranslations("veiculos.sections");
  const [items, setItems] = useState<VehicleListing[]>([]);

  useEffect(() => {
    fetch("/api/listings/vehicles?section=featured")
      .then((r) => r.json())
      .then(setItems);
  }, []);

  return (
    <ListingCarousel
      title={t("featured")}
      subtitle={t("featuredSubtitle")}
      items={items}
      badge={t("featuredBadge")}
    />
  );
}
