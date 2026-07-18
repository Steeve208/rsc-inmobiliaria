import type { MetadataRoute } from "next";
import { eq } from "drizzle-orm";
import { getAppUrl } from "@/lib/env/production-config";
import { routing } from "@/lib/i18n/routing";
import { db } from "@/lib/db";
import { propertyListing, vehicleListing } from "@/lib/db/schema";
import { cityLandingPages as propertyCities } from "@/lib/imoveis/city-slugs";
import { cityLandingPages as vehicleCities } from "@/lib/veiculos/city-slugs";

const staticPaths = [
  "",
  "/imoveis",
  "/veiculos",
  "/services",
  "/financing",
  "/para-empresas",
  "/como-funciona",
  "/help",
  "/search",
  "/privacy",
  "/terms",
  "/cookies",
  "/compliance",
  "/about",
  "/careers",
  "/guides",
  "/security",
] as const;

async function listActiveListingIds() {
  try {
    const [properties, vehicles] = await Promise.all([
      db
        .select({ id: propertyListing.id, updatedAt: propertyListing.updatedAt })
        .from(propertyListing)
        .where(eq(propertyListing.status, "active"))
        .limit(5000),
      db
        .select({ id: vehicleListing.id, updatedAt: vehicleListing.updatedAt })
        .from(vehicleListing)
        .where(eq(vehicleListing.status, "active"))
        .limit(5000),
    ]);
    return { properties, vehicles };
  } catch {
    return { properties: [], vehicles: [] };
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getAppUrl().replace(/\/$/, "");
  const now = new Date();
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of routing.locales) {
    for (const path of staticPaths) {
      entries.push({
        url: `${base}/${locale}${path}`,
        lastModified: now,
        changeFrequency: path === "" ? "daily" : "weekly",
        priority: path === "" ? 1 : 0.7,
      });
    }

    for (const city of propertyCities) {
      entries.push({
        url: `${base}/${locale}/imoveis/cidade/${city.slug}`,
        lastModified: now,
        changeFrequency: "weekly",
        priority: 0.6,
      });
    }

    for (const city of vehicleCities) {
      entries.push({
        url: `${base}/${locale}/veiculos/cidade/${city.slug}`,
        lastModified: now,
        changeFrequency: "weekly",
        priority: 0.6,
      });
    }
  }

  const { properties, vehicles } = await listActiveListingIds();

  for (const locale of routing.locales) {
    for (const row of properties) {
      entries.push({
        url: `${base}/${locale}/imoveis/${row.id}`,
        lastModified: row.updatedAt ?? now,
        changeFrequency: "daily",
        priority: 0.8,
      });
    }
    for (const row of vehicles) {
      entries.push({
        url: `${base}/${locale}/veiculos/${row.id}`,
        lastModified: row.updatedAt ?? now,
        changeFrequency: "daily",
        priority: 0.8,
      });
    }
  }

  return entries;
}
