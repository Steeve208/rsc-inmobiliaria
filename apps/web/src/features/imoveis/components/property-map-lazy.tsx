"use client";

import dynamic from "next/dynamic";
import type { ComponentProps, ReactElement } from "react";

type PropertyMapProps = ComponentProps<
  typeof import("./property-map").PropertyMap
>;

async function loadPropertyMap() {
  try {
    const mod = await import(
      /* webpackChunkName: "property-map" */
      "./property-map"
    );
    return mod.PropertyMap;
  } catch {
    // Retry once — ChunkLoadError often hits during slow on-demand compile / HMR.
    await new Promise((resolve) => setTimeout(resolve, 1200));
    const mod = await import(
      /* webpackChunkName: "property-map" */
      "./property-map"
    );
    return mod.PropertyMap;
  }
}

function MapSkeleton() {
  return (
    <div
      className="min-h-[220px] h-full w-full animate-pulse rounded-lg bg-[#E5E7EB]"
      aria-hidden
    />
  );
}

/** Client-only Mapbox map with retry-friendly chunk loading. */
export const PropertyMapLazy = dynamic(loadPropertyMap, {
  ssr: false,
  loading: () => <MapSkeleton />,
}) as unknown as (props: PropertyMapProps) => ReactElement | null;
