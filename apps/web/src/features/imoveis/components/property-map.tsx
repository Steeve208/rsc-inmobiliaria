"use client";

import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { MapPin } from "lucide-react";
import { getMapboxToken, isValidMapCoord } from "@/lib/maps/mapbox";
import { formatCompactMoney } from "@/lib/marketplace/format";
import { cn } from "@/lib/utils";
import type { PropertyListing } from "../types";

function mapQueryFromListing(item?: PropertyListing & { address?: string }) {
  if (!item) return "";
  const address = item.address?.trim() ?? "";
  const street = address && !/^\d+$/.test(address) ? address : "";
  return [street, item.neighborhood, item.city, item.state, item.country]
    .map((part) => part?.trim())
    .filter((part): part is string => Boolean(part && part.length > 1))
    .join(", ");
}

async function geocodePlace(
  query: string,
  token: string,
  signal: AbortSignal,
) {
  try {
    const response = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${encodeURIComponent(token)}&limit=1`,
      { signal },
    );
    if (!response.ok) return null;
    const data = (await response.json()) as {
      features?: { center?: number[] }[];
    };
    const center = data.features?.[0]?.center;
    if (!center || center.length < 2) return null;
    const [lng, lat] = center;
    return isValidMapCoord(lng, lat) ? { lng, lat } : null;
  } catch {
    return null;
  }
}

type Props = {
  items: PropertyListing[];
  highlightedId?: string | null;
  onHighlight?: (id: string | null) => void;
  satellite?: boolean;
  theme?: "dark" | "light";
  pricePins?: boolean;
  className?: string;
};

export function PropertyMap({
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
      center: [-51.5192, -29.1714],
      zoom: 12,
      attributionControl: false,
    });

    map.addControl(
      new mapboxgl.NavigationControl({ showCompass: false }),
      "bottom-right",
    );
    map.addControl(new mapboxgl.AttributionControl({ compact: true }));
    map.on("load", () => map.resize());

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
    const activeMap = map;

    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current.clear();

    const mappable = items.filter((item) =>
      isValidMapCoord(item.lng, item.lat),
    );

    function placeMarker(id: string, lng: number, lat: number, price?: number, currency?: string) {
      const el = document.createElement("div");
      if (pricePins && price != null && currency) {
        el.className =
          "cursor-pointer rounded-md bg-white px-1.5 py-0.5 text-[10px] font-bold text-[#0B1220] shadow-md ring-1 ring-black/10 transition-transform";
        el.textContent = formatCompactMoney(price, currency);
      } else {
        el.className =
          "size-4 cursor-pointer rounded-full border-2 border-white shadow-lg transition-transform";
        el.style.backgroundColor = "#1d4ed8";
      }

      el.addEventListener("mouseenter", () => onHighlight?.(id));
      el.addEventListener("mouseleave", () => onHighlight?.(null));

      const marker = new mapboxgl.Marker({ element: el })
        .setLngLat([lng, lat])
        .addTo(activeMap);

      markersRef.current.set(id, marker);
    }

    mappable.forEach((item) => {
      placeMarker(item.id, item.lng, item.lat, item.price, item.currency);
    });

    if (mappable.length > 1) {
      const bounds = new mapboxgl.LngLatBounds();
      mappable.forEach((item) => bounds.extend([item.lng, item.lat]));
      map.fitBounds(bounds, { padding: 48, maxZoom: 13 });
      return;
    }

    if (mappable.length === 1) {
      map.flyTo({ center: [mappable[0].lng, mappable[0].lat], zoom: 14 });
      return;
    }

    const item = items[0];
    const query = mapQueryFromListing(item);
    if (!item || !query) return;

    const controller = new AbortController();
    void geocodePlace(query, token, controller.signal).then((point) => {
      if (!point || mapRef.current !== activeMap) return;
      placeMarker(item.id, point.lng, point.lat, item.price, item.currency);
      activeMap.flyTo({ center: [point.lng, point.lat], zoom: 13 });
    });

    return () => controller.abort();
  }, [items, token, onHighlight, pricePins]);

  useEffect(() => {
    markersRef.current.forEach((marker, id) => {
      const el = marker.getElement();
      const active = id === highlightedId;
      el.style.transform = active ? "scale(1.12)" : "scale(1)";
      el.style.zIndex = active ? "10" : "1";
      if (!pricePins) {
        el.style.backgroundColor = active ? "#2BB8A8" : "#1d4ed8";
      } else {
        el.style.backgroundColor = active ? "#2BB8A8" : "#ffffff";
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
                  ? "bg-[#2BB8A8] text-[#070B14]"
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
