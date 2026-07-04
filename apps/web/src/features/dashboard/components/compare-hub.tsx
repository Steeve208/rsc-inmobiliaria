"use client";

import { useTranslations } from "next-intl";
import { PropertyComparePanel } from "@/features/imoveis/components/property-compare-panel";
import { VehicleComparePanel } from "@/features/veiculos/components/vehicle-compare-panel";

export function CompareHub() {
  const t = useTranslations("dashboard");

  return (
    <div className="space-y-10">
      <PropertyComparePanel />
      <div>
        <h3 className="mb-4 text-base font-semibold text-white">{t("vehicleCompareTitle")}</h3>
        <VehicleComparePanel />
      </div>
    </div>
  );
}
