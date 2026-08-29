import type {
  ProjectListing,
  ProjectType,
  ProjectUnitType,
} from "@/features/projetos/types";
import type { PropertyListing } from "@/features/imoveis/types";
import {
  fetchAllBackofficeListingsResult,
  isBackofficeConfigured,
} from "@/lib/backoffice/client";
import { mapBackofficeToProjectListing } from "@/lib/backoffice/mappers";
import { listingCodeValue } from "@/lib/listings/listing-code";
import { getLaunchProperties } from "@/lib/listings/property-repository";

function mapPropertyType(type: string): ProjectType {
  if (type === "commercial") return "commercial";
  if (type === "land") return "mixed";
  return "residential";
}

function mapUnitType(type: string): ProjectUnitType {
  if (type === "house") return "houses";
  if (type === "studio") return "studios";
  if (type === "commercial") return "offices";
  return "apartments";
}

function propertyToProject(
  item: PropertyListing,
  index = 0,
): ProjectListing {
  const year = 2027 + (index % 3);
  return {
    id: `launch-${item.id}`,
    category: "projects",
    title: item.title,
    type: mapPropertyType(item.type),
    status: item.launch ? "prelaunch" : "construction",
    unitType: mapUnitType(item.type),
    bedsMin: item.bedrooms || undefined,
    bedsMax: item.bedrooms || undefined,
    price: item.price,
    currency: item.currency,
    country: item.country,
    state: item.state,
    city: item.city,
    neighborhood: item.neighborhood,
    developer: item.company,
    delivery: `Q${(index % 4) + 1} ${year}`,
    deliveryYear: year,
    paymentPlan: item.financing,
    highRoi: Boolean(item.premium),
    sustainable: false,
    luxury: Boolean(item.premium),
    amenities: item.pool || item.virtualTour,
    verified: item.verified,
    featured: item.featured,
    premium: item.premium,
    image: item.image,
    lat: item.lat,
    lng: item.lng,
    publishedAt: item.publishedAt,
    propertyId: item.id,
    code: listingCodeValue(`launch-${item.id}`, undefined, "project"),
  };
}

function mergeProjectCatalog(
  liveLaunches: PropertyListing[],
  liveProjects: ProjectListing[] = [],
) {
  const mapped = liveLaunches
    .filter((item) => item.launch)
    .map((item, index) => propertyToProject(item, index));

  const merged: ProjectListing[] = [];
  const seen = new Set<string>();

  for (const item of [...liveProjects, ...mapped]) {
    if (seen.has(item.id) || (item.propertyId && seen.has(item.propertyId))) {
      continue;
    }
    seen.add(item.id);
    if (item.propertyId) seen.add(item.propertyId);
    merged.push(item);
  }
  return merged;
}

export async function listProjects(): Promise<ProjectListing[]> {
  let liveProjects: ProjectListing[] = [];

  if (isBackofficeConfigured()) {
    const result = await fetchAllBackofficeListingsResult({ category: "project" });
    if (result.status === "ok") {
      liveProjects = result.listings.map(mapBackofficeToProjectListing);
    }
  }

  const launches = await getLaunchProperties();
  return mergeProjectCatalog(launches, liveProjects);
}

export async function getProjectById(id: string): Promise<ProjectListing | undefined> {
  const catalog = await listProjects();
  return catalog.find((item) => item.id === id || item.propertyId === id);
}
