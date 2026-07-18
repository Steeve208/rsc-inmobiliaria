import { and, asc, desc, eq, inArray, ne } from "drizzle-orm";
import { db } from "@/lib/db";
import {
  agent,
  company,
  listingImage,
  propertyListing,
} from "@/lib/db/schema";
import type { PropertyDetail, PropertyListing } from "@/features/imoveis/types";
import { listingImageUrl } from "@/lib/listings/constants";
import { slugifyCompanyId } from "@/lib/leads/utils";
import {
  fetchAllBackofficeListings,
  fetchBackofficeListingById,
  incrementBackofficeListingViews,
  isBackofficeConfigured,
} from "@/lib/backoffice/client";
import {
  filterPropertySection,
  mapBackofficeToPropertyDetail,
  mapBackofficeToPropertyListing,
} from "@/lib/backoffice/mappers";

type PropertyRow = typeof propertyListing.$inferSelect;
type CompanyRow = typeof company.$inferSelect;
type AgentRow = typeof agent.$inferSelect;

function num(value: string | number | null | undefined, fallback = 0) {
  if (value == null) return fallback;
  return typeof value === "number" ? value : Number(value);
}

function formatAddress(row: PropertyRow) {
  if (row.address?.trim()) return row.address.trim();

  const parts = [
    row.neighborhood,
    [row.city, row.state].filter(Boolean).join(" - "),
  ].filter(Boolean);

  return parts.join(", ");
}

function mapListing(row: PropertyRow, companyName: string): PropertyListing {
  return {
    id: row.id,
    category: "properties",
    title: row.title,
    type: row.type,
    transaction: row.transaction,
    condition: row.condition ?? "",
    price: num(row.price),
    currency: row.currency,
    country: row.country,
    state: row.state ?? "",
    city: row.city,
    neighborhood: row.neighborhood ?? "",
    bedrooms: row.bedrooms,
    bathrooms: row.bathrooms,
    garage: row.garage,
    pool: row.pool,
    area: num(row.area),
    company: companyName,
    financing: row.financing,
    verified: row.verified || undefined,
    premium: row.premium || undefined,
    launch: row.launch || undefined,
    image: listingImageUrl(row.coverImage),
    lat: num(row.lat),
    lng: num(row.lng),
    publishedAt: row.publishedAt?.toISOString().slice(0, 10) ?? "",
  };
}

async function fetchImages(listingId: string): Promise<string[]> {
  const rows = await db
    .select({ url: listingImage.url })
    .from(listingImage)
    .where(eq(listingImage.listingId, listingId))
    .orderBy(asc(listingImage.position));

  return rows.map((r) => listingImageUrl(r.url));
}

async function fetchActiveProperties() {
  return db
    .select({ property: propertyListing, company })
    .from(propertyListing)
    .leftJoin(company, eq(propertyListing.companyId, company.id))
    .where(eq(propertyListing.status, "active"))
    .orderBy(desc(propertyListing.publishedAt));
}

async function listBackofficeProperties(city?: string): Promise<PropertyListing[]> {
  const listings = await fetchAllBackofficeListings({
    category: "real_estate",
    city,
  });
  return listings.map(mapBackofficeToPropertyListing);
}

export async function listActivePropertiesForAlerts(): Promise<PropertyListing[]> {
  if (isBackofficeConfigured()) {
    return listBackofficeProperties();
  }
  try {
    const rows = await fetchActiveProperties();
    return rows.map(({ property, company: co }) =>
      mapListing(property, co?.name ?? property.companyId ?? ""),
    );
  } catch {
    return [];
  }
}

export async function listProperties(): Promise<PropertyListing[]> {
  if (isBackofficeConfigured()) {
    return listBackofficeProperties();
  }
  try {
    const rows = await fetchActiveProperties();
    return rows.map(({ property, company: co }) =>
      mapListing(property, co?.name ?? property.companyId ?? ""),
    );
  } catch {
    return [];
  }
}

export async function listPropertiesByCity(
  city: string,
  state: string,
  limit = 12,
): Promise<PropertyListing[]> {
  if (isBackofficeConfigured()) {
    const listings = await listBackofficeProperties(city);
    return listings
      .filter((item) => !state || item.state === state)
      .slice(0, limit);
  }
  try {
    const rows = await db
      .select({ property: propertyListing, company })
      .from(propertyListing)
      .leftJoin(company, eq(propertyListing.companyId, company.id))
      .where(
        and(
          eq(propertyListing.status, "active"),
          eq(propertyListing.city, city),
          eq(propertyListing.state, state),
        ),
      )
      .orderBy(desc(propertyListing.publishedAt))
      .limit(limit);

    return rows.map(({ property, company: co }) =>
      mapListing(property, co?.name ?? property.companyId ?? ""),
    );
  } catch {
    return [];
  }
}

export async function listPropertiesByIds(ids: string[]): Promise<PropertyListing[]> {
  const uniqueIds = [...new Set(ids.filter(Boolean))];
  if (uniqueIds.length === 0) return [];

  if (isBackofficeConfigured()) {
    const listings = await Promise.all(uniqueIds.map((id) => fetchBackofficeListingById(id)));
    return listings
      .filter((item): item is NonNullable<typeof item> => item !== null)
      .filter((item) => item.category === "real_estate")
      .map(mapBackofficeToPropertyListing);
  }

  try {
    const rows = await db
      .select({ property: propertyListing, company })
      .from(propertyListing)
      .leftJoin(company, eq(propertyListing.companyId, company.id))
      .where(inArray(propertyListing.id, uniqueIds));

    const byId = new Map(
      rows.map(({ property, company: co }) => [
        property.id,
        mapListing(property, co?.name ?? property.companyId ?? ""),
      ]),
    );

    return uniqueIds
      .map((id) => byId.get(id))
      .filter((item): item is PropertyListing => item !== undefined);
  } catch {
    return [];
  }
}

export async function getPropertyById(id: string): Promise<PropertyListing | undefined> {
  if (isBackofficeConfigured()) {
    const listing = await fetchBackofficeListingById(id);
    if (!listing || listing.category !== "real_estate") return undefined;
    return mapBackofficeToPropertyListing(listing);
  }
  try {
    const [row] = await db
      .select({ property: propertyListing, company })
      .from(propertyListing)
      .leftJoin(company, eq(propertyListing.companyId, company.id))
      .where(eq(propertyListing.id, id))
      .limit(1);

    if (!row) return undefined;
    return mapListing(row.property, row.company?.name ?? "");
  } catch {
    return undefined;
  }
}

export async function getPropertyDetail(id: string): Promise<PropertyDetail | undefined> {
  if (isBackofficeConfigured()) {
    const listing = await fetchBackofficeListingById(id);
    if (!listing || listing.category !== "real_estate") return undefined;
    void incrementBackofficeListingViews(id);
    return mapBackofficeToPropertyDetail(listing);
  }
  try {
    const [row] = await db
      .select({ property: propertyListing, company, agent })
      .from(propertyListing)
      .leftJoin(company, eq(propertyListing.companyId, company.id))
      .leftJoin(agent, eq(propertyListing.agentId, agent.id))
      .where(eq(propertyListing.id, id))
      .limit(1);

    if (!row) return undefined;

    const base = mapListing(row.property, row.company?.name ?? "");
    const images = await fetchImages(id);
    const cover = row.property.coverImage?.trim();
    const gallery =
      images.length > 0 ? images : cover ? [listingImageUrl(cover)] : [];
    const co = row.company;
    const ag = row.agent;

    return {
      ...base,
      companyId: row.property.companyId ?? slugifyCompanyId(base.company),
      companyLogoUrl: co?.logoUrl ?? undefined,
      whatsappNumber:
        row.property.whatsappNumber?.trim() ||
        co?.whatsappNumber?.trim() ||
        co?.phone?.replace(/\D/g, "") ||
        "",
      images: gallery,
      featured: row.property.featured,
      address: formatAddress(row.property),
      condoFee: num(row.property.condoFee),
      iptu: num(row.property.iptu),
      landArea: num(row.property.landArea),
      suites: row.property.suites,
      livingRooms: row.property.livingRooms,
      kitchen: row.property.kitchen,
      laundry: row.property.laundry,
      heating: row.property.heating ?? "",
      yearBuilt: row.property.yearBuilt ?? 0,
      description: row.property.description?.trim() ?? "",
      videoUrl: row.property.videoUrl ?? undefined,
      virtualTourUrl: row.property.virtualTourUrl ?? undefined,
      floorPlanUrl: row.property.floorPlanUrl ?? undefined,
      agent: ag
        ? {
            name: ag.name,
            role: ag.role ?? "",
            creci: ag.creci ?? "",
            photo: listingImageUrl(ag.photoUrl),
          }
        : null,
      agencyRating: num(co?.rating),
      agencyYears: co?.yearsActive ?? 0,
      agencyActive: co?.activeListings ?? 0,
      agencySold: co?.soldCount ?? 0,
      agencyReviews: co?.reviewsCount ?? 0,
      companyInfo: {
        cnpj: null,
        phone: co?.whatsappNumber ?? null,
        website: null,
        address: row.property.address ?? null,
        city: base.city,
        state: base.state,
        postalCode: null,
        branchName: co?.name ?? base.company,
        businessHours: [],
      },
    };
  } catch {
    return undefined;
  }
}

export async function getSimilarProperties(
  id: string,
  limit = 4,
): Promise<PropertyListing[]> {
  if (isBackofficeConfigured()) {
    const base = await getPropertyById(id);
    if (!base) return [];
    const all = await listBackofficeProperties();
    return all
      .filter((item) => item.id !== id)
      .filter((item) => item.city === base.city || item.type === base.type)
      .slice(0, limit);
  }
  try {
    const base = await getPropertyById(id);
    if (!base) return [];

    const all = await listProperties();
    const others = all.filter((item) => item.id !== id);

    const ranked = [
      ...others.filter((item) => item.city === base.city && item.type === base.type),
      ...others.filter((item) => item.city === base.city && item.type !== base.type),
      ...others.filter((item) => item.state === base.state && item.city !== base.city),
      ...others.filter((item) => item.country === base.country),
    ];

    const unique: PropertyListing[] = [];
    const seen = new Set<string>();
    for (const item of ranked) {
      if (seen.has(item.id)) continue;
      seen.add(item.id);
      unique.push(item);
      if (unique.length >= limit) break;
    }

    return unique;
  } catch {
    return [];
  }
}

export async function getAgencyProperties(
  companyId: string,
  excludeId: string,
  limit = 6,
): Promise<PropertyListing[]> {
  if (isBackofficeConfigured()) {
    const listings = await fetchAllBackofficeListings({
      category: "real_estate",
      organization: companyId,
    });
    return listings
      .filter((item) => item.id !== excludeId)
      .map(mapBackofficeToPropertyListing)
      .slice(0, limit);
  }
  try {
    const rows = await db
      .select({ property: propertyListing, company })
      .from(propertyListing)
      .leftJoin(company, eq(propertyListing.companyId, company.id))
      .where(
        and(
          eq(propertyListing.companyId, companyId),
          eq(propertyListing.status, "active"),
          ne(propertyListing.id, excludeId),
        ),
      )
      .orderBy(desc(propertyListing.publishedAt))
      .limit(limit);

    return rows.map(({ property, company: co }) =>
      mapListing(property, co?.name ?? ""),
    );
  } catch {
    return [];
  }
}

export async function getPremiumProperties(): Promise<PropertyListing[]> {
  if (isBackofficeConfigured()) {
    return filterPropertySection(await listBackofficeProperties(), "premium");
  }
  try {
    const rows = await db
      .select({ property: propertyListing, company })
      .from(propertyListing)
      .leftJoin(company, eq(propertyListing.companyId, company.id))
      .where(and(eq(propertyListing.status, "active"), eq(propertyListing.premium, true)))
      .orderBy(desc(propertyListing.publishedAt))
      .limit(12);

    return rows.map(({ property, company: co }) =>
      mapListing(property, co?.name ?? ""),
    );
  } catch {
    return [];
  }
}

export async function getRecommendedProperties(): Promise<PropertyListing[]> {
  if (isBackofficeConfigured()) {
    return filterPropertySection(await listBackofficeProperties(), "recommended");
  }
  try {
    const rows = await db
      .select({ property: propertyListing, company })
      .from(propertyListing)
      .leftJoin(company, eq(propertyListing.companyId, company.id))
      .where(and(eq(propertyListing.status, "active"), eq(propertyListing.verified, true)))
      .orderBy(desc(propertyListing.publishedAt))
      .limit(6);

    return rows.map(({ property, company: co }) =>
      mapListing(property, co?.name ?? ""),
    );
  } catch {
    return [];
  }
}

export async function getLaunchProperties(): Promise<PropertyListing[]> {
  if (isBackofficeConfigured()) {
    return filterPropertySection(await listBackofficeProperties(), "launch");
  }
  try {
    const rows = await db
      .select({ property: propertyListing, company })
      .from(propertyListing)
      .leftJoin(company, eq(propertyListing.companyId, company.id))
      .where(and(eq(propertyListing.status, "active"), eq(propertyListing.launch, true)))
      .orderBy(desc(propertyListing.publishedAt))
      .limit(12);

    return rows.map(({ property, company: co }) =>
      mapListing(property, co?.name ?? ""),
    );
  } catch {
    return [];
  }
}

export type { CompanyRow, AgentRow };
