"use client";

import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { MapPin } from "lucide-react";
import { getMapboxToken, isValidMapCoord } from "@/lib/maps/mapbox";
import { formatCompactMoney } from "@/lib/marketplace/format";
import { cn } from "@/lib/utils";
import type { ProjectListing } from "../types";

type Props = {
  items: ProjectListing[];
  highlightedId?: string | null;
  onHighlight?: (id: string | null) => void;
  satellite?: boolean;
  theme?: "dark" | "light";
  pricePins?: boolean;
  className?: string;
};

export function ProjectMap({
  items,
  highlightedId,
  onHighlight,
  satellite = false,
  theme = "dark",
  pricePins = false,
  className,
}: Props) {
  const t = useTranslations("map");
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<Map<string, mapboxgl.Marker>>(new Map());
  const token = getMapboxToken();
  const light = theme === "light";

  useEffect(() => {
    if (!token || !mapContainer.current || mapRef.current) return;

    mapboxgl.accessToken = token;

    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: satellite
        ? "mapbox://styles/mapbox/satellite-streets-v12"
        : light
          ? "mapbox://styles/mapbox/streets-v12"
          : "mapbox://styles/mapbox/dark-v11",
      center: [-46.6333, -23.5505],
      zoom: 10,
      attributionControl: false,
    });

    map.addControl(
      new mapboxgl.NavigationControl({ showCompass: false }),
      "bottom-right",
    );
    map.addControl(new mapboxgl.AttributionControl({ compact: true }));

    mapRef.current = map;
    const markersMap = markersRef.current;

    return () => {
      markersMap.forEach((marker) => marker.remove());
      markersMap.clear();
      map.remove();
      mapRef.current = null;
    };
  }, [token, satellite, light]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !token) return;

    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current.clear();

    const mappable = items.filter((item) =>
      isValidMapCoord(item.lng, item.lat),
    );

    mappable.forEach((item) => {
      const el = document.createElement("div");
      if (pricePins) {
        el.className =
          "cursor-pointer rounded-md bg-white px-1.5 py-0.5 text-[10px] font-bold text-[#0B1220] shadow-md ring-1 ring-black/10 transition-transform";
        el.textContent = formatCompactMoney(item.price, item.currency);
      } else {
        el.className =
          "size-4 cursor-pointer rounded-full border-2 border-white shadow-lg transition-transform";
        el.style.backgroundColor = "#2563EB";
      }

      el.addEventListener("mouseenter", () => onHighlight?.(item.id));
      el.addEventListener("mouseleave", () => onHighlight?.(null));

      const marker = new mapboxgl.Marker({ element: el })
        .setLngLat([item.lng, item.lat])
        .addTo(map);

      markersRef.current.set(item.id, marker);
    });

    if (mappable.length > 1) {
      const bounds = new mapboxgl.LngLatBounds();
      mappable.forEach((item) => bounds.extend([item.lng, item.lat]));
      map.fitBounds(bounds, { padding: 48, maxZoom: 12 });
    } else if (mappable.length === 1) {
      map.flyTo({ center: [mappable[0].lng, mappable[0].lat], zoom: 12 });
    }
  }, [items, token, onHighlight, pricePins]);

  useEffect(() => {
    markersRef.current.forEach((marker, id) => {
      const el = marker.getElement();
      const active = id === highlightedId;
      el.style.transform = active ? "scale(1.12)" : "scale(1)";
      el.style.zIndex = active ? "10" : "1";
      if (!pricePins) {
        el.style.backgroundColor = active ? "#E8A84A" : "#2563EB";
      } else {
        el.style.backgroundColor = active ? "#E8A84A" : "#ffffff";
      }
    });
  }, [highlightedId, pricePins]);

  if (!token) {
    return (
      <div
        className={cn(
          "relative flex min-h-[220px] flex-col items-center justify-center gap-3 overflow-hidden p-6 text-center",
          light ? "bg-[#E8EEF4] text-[#4B5563]" : "bg-[#081128]/60 text-white/50",
          className,
        )}
      >
        <div className="absolute inset-0">
          {items.slice(0, 12).map((item, index) => (
            <button
              key={item.id}
              type="button"
              className={cn(
                "absolute -translate-x-1/2 -translate-y-1/2 rounded-md px-1.5 py-0.5 text-[10px] font-bold shadow-sm",
                highlightedId === item.id
                  ? "bg-[#E8A84A] text-[#070B14]"
                  : "bg-white text-[#0B1220]",
              )}
              style={{
                top: `${22 + ((index * 13) % 56)}%`,
                left: `${18 + ((index * 17) % 64)}%`,
              }}
              onMouseEnter={() => onHighlight?.(item.id)}
              onMouseLeave={() => onHighlight?.(null)}
            >
              {formatCompactMoney(item.price, item.currency)}
            </button>
          ))}
        </div>
        <MapPin className={cn("relative size-7", light ? "text-[#6B7285]" : "text-[#60a5fa]")} />
        <p className="relative max-w-sm text-xs">{t("noToken")}</p>
      </div>
    );
  }

  return (
    <div
      ref={mapContainer}
      className={cn("overflow-hidden", className ?? "min-h-[360px]")}
    />
  );
}
