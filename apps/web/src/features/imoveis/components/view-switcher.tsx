"use client";

import {
  LayoutGrid,
  List,
  Map as MapIcon,
  Satellite,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import type { ImoveisView } from "../types";

type Props = {
  view: ImoveisView;
  onChange: (view: ImoveisView) => void;
};

export function ViewSwitcher({ view, onChange }: Props) {
  const t = useTranslations("imoveis.views");

  const views: { id: ImoveisView; icon: typeof List; label: string }[] = [
    { id: "list", icon: List, label: t("list") },
    { id: "gallery", icon: LayoutGrid, label: t("gallery") },
    { id: "map", icon: MapIcon, label: t("map") },
    { id: "satellite", icon: Satellite, label: t("satellite") },
  ];

  return (
    <div className="flex rounded-lg bg-[#081128]/80 p-1">
      {views.map((v) => {
        const Icon = v.icon;
        return (
          <button
            key={v.id}
            type="button"
            onClick={() => onChange(v.id)}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors sm:text-sm",
              view === v.id
                ? "bg-[#1d4ed8] text-white"
                : "text-white/60 hover:text-white",
            )}
          >
            <Icon className="size-3.5" />
            <span className="hidden sm:inline">{v.label}</span>
          </button>
        );
      })}
    </div>
  );
}
