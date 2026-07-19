"use client";

import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { MapPin } from "lucide-react";
import { getMapboxToken, isValidMapCoord } from "@/lib/maps/mapbox";
import type { VehicleListing } from "../types";

type Props = {
  items: VehicleListing[];
  highlightedId?: string | null;
  onHighlight?: (id: string | null) => void;
  satellite?: boolean;
  className?: string;
};

export function VehicleMap({
  items,
  highlightedId,
  onHighlight,
  satellite = false,
  className,
}: Props) {
  const t = useTranslations("map");
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<Map<string, mapboxgl.Marker>>(new Map());
  const token = getMapboxToken();

  useEffect(() => {
    if (!token || !mapContainer.current || mapRef.current) return;

    mapboxgl.accessToken = token;

    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: satellite
        ? "mapbox://styles/mapbox/satellite-streets-v12"
        : "mapbox://styles/mapbox/dark-v11",
      center: [-51.2177, -30.0346],
      zoom: 12,
      attributionControl: false,
    });

    map.addControl(new mapboxgl.NavigationControl(), "top-right");
    map.addControl(new mapboxgl.AttributionControl({ compact: true }));

    mapRef.current = map;
    const markersMap = markersRef.current;

    return () => {
      markersMap.forEach((m) => m.remove());
      markersMap.clear();
      map.remove();
      mapRef.current = null;
    };
  }, [token, satellite]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !token) return;

    markersRef.current.forEach((m) => m.remove());
    markersRef.current.clear();

    const mappable = items.filter((item) =>
      isValidMapCoord(item.lng, item.lat),
    );

    mappable.forEach((item) => {
      const el = document.createElement("div");
      el.className =
        "size-4 cursor-pointer rounded-full border-2 border-white shadow-lg transition-transform";
      el.style.backgroundColor = "#22c55e";

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
      map.fitBounds(bounds, { padding: 60, maxZoom: 14 });
    } else if (mappable.length === 1) {
      map.flyTo({ center: [mappable[0].lng, mappable[0].lat], zoom: 13 });
    }
  }, [items, token, onHighlight]);

  useEffect(() => {
    markersRef.current.forEach((marker, id) => {
      const el = marker.getElement();
      if (id === highlightedId) {
        el.style.backgroundColor = "#d4a017";
        el.style.transform = "scale(1.5)";
        el.style.zIndex = "10";
      } else {
        el.style.backgroundColor = "#22c55e";
        el.style.transform = "scale(1)";
        el.style.zIndex = "1";
      }
    });
  }, [highlightedId]);

  if (!token) {
    return (
      <div
        className={`relative flex min-h-[360px] flex-col items-center justify-center gap-3 overflow-hidden rounded-xl bg-[#081128]/60 p-8 text-center ${className ?? ""}`}
      >
        <div className="absolute inset-0 opacity-20">
          {items.map((item, i) => (
            <div
              key={item.id}
              className="absolute size-3 rounded-full bg-[#22c55e]"
              style={{
                top: `${20 + (i * 13) % 60}%`,
                left: `${15 + (i * 17) % 70}%`,
                transform: highlightedId === item.id ? "scale(1.8)" : "scale(1)",
                backgroundColor: highlightedId === item.id ? "#d4a017" : "#22c55e",
              }}
              onMouseEnter={() => onHighlight?.(item.id)}
              onMouseLeave={() => onHighlight?.(null)}
            />
          ))}
        </div>
        <MapPin className="relative size-8 text-[#86efac]" />
        <p className="relative max-w-sm text-sm text-white/50">{t("noToken")}</p>
        <p className="relative text-xs text-white/30">
          {items.length} {t("fallbackListings")}
        </p>
      </div>
    );
  }

  return (
    <div
      ref={mapContainer}
      className={`overflow-hidden rounded-xl ${className ?? "min-h-[360px]"}`}
    />
  );
}
