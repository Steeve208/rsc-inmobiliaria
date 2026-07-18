"use client";

import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { MapPin } from "lucide-react";

export type MapMarker = {
  id: string;
  lng: number;
  lat: number;
};

type MapboxMapProps = {
  className?: string;
  markers?: MapMarker[];
};

function isValidCoord(lng: number, lat: number) {
  return (
    Number.isFinite(lng) &&
    Number.isFinite(lat) &&
    !(lng === 0 && lat === 0) &&
    Math.abs(lat) <= 90 &&
    Math.abs(lng) <= 180
  );
}

export function MapboxMap({ className, markers = [] }: MapboxMapProps) {
  const t = useTranslations("map");
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
  const validMarkers = markers.filter((m) => isValidCoord(m.lng, m.lat));
  const markersKey = validMarkers
    .map((m) => `${m.id}:${m.lng},${m.lat}`)
    .join("|");

  useEffect(() => {
    if (!token || !mapContainer.current) return;

    if (mapRef.current) {
      mapRef.current.remove();
      mapRef.current = null;
    }

    if (validMarkers.length === 0) return;

    mapboxgl.accessToken = token;

    const first = validMarkers[0]!;
    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/light-v11",
      center: [first.lng, first.lat],
      zoom: validMarkers.length === 1 ? 11 : 2.5,
      attributionControl: false,
    });

    map.addControl(new mapboxgl.NavigationControl(), "top-right");
    map.addControl(new mapboxgl.AttributionControl({ compact: true }));

    const bounds = new mapboxgl.LngLatBounds();
    for (const marker of validMarkers) {
      new mapboxgl.Marker({ color: "#171717" })
        .setLngLat([marker.lng, marker.lat])
        .addTo(map);
      bounds.extend([marker.lng, marker.lat]);
    }

    if (validMarkers.length > 1) {
      map.fitBounds(bounds, { padding: 48, maxZoom: 12 });
    }

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [token, markersKey]);

  if (!token) {
    return (
      <div
        className={`flex min-h-[360px] flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border bg-muted/30 p-8 text-center ${className ?? ""}`}
      >
        <MapPin className="size-8 text-muted-foreground" />
        <p className="max-w-sm text-sm text-muted-foreground">{t("noToken")}</p>
      </div>
    );
  }

  if (validMarkers.length === 0) {
    return (
      <div
        className={`flex min-h-[360px] flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border bg-muted/30 p-8 text-center ${className ?? ""}`}
      >
        <MapPin className="size-8 text-muted-foreground" />
        <p className="max-w-sm text-sm text-muted-foreground">{t("noMarkers")}</p>
      </div>
    );
  }

  return (
    <div
      ref={mapContainer}
      className={`min-h-[360px] overflow-hidden rounded-xl border border-border ${className ?? ""}`}
    />
  );
}
