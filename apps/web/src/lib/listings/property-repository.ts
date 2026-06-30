import { asc, desc, eq, ne } from "drizzle-orm";
import { db } from "@/lib/db";
import {
  agent,
  company,
  listingImage,
  propertyListing,
} from "@/lib/db/schema";
import type { PropertyDetail, PropertyListing } from "@/features/imoveis/types";
import {
  enrichProperty,
  getPropertyDetail as mockGetPropertyDetail,
  getSimilarProperties as mockGetSimilar,
  propertyListings as mockListings,
} from "@/features/imoveis/mock-data";
import { slugifyCompanyId } from "@/lib/leads/utils";

type PropertyRow = typeof propertyListing.$inferSelect;
type CompanyRow = typeof company.$inferSelect;
type AgentRow = typeof agent.$inferSelect;

function num(value: string | number | null | undefined, fallback = 0) {
  if (value == null) return fallback;
  return typeof value === "number" ? value : Number(value);
}

function mapListing(
  row: PropertyRow,
  companyName: string,
): PropertyListing {
  return {
    id: row.id,
    category: "properties",
    title: row.title,
    type: row.type,
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
    image: row.coverImage ?? "",
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
  return rows.map((r) => r.url);
}

async function fetchActiveProperties() {
  return db
    .select({ property: propertyListing, company })
    .from(propertyListing)
    .leftJoin(company, eq(propertyListing.companyId, company.id))
    .where(eq(propertyListing.status, "active"))
    .orderBy(desc(propertyListing.publishedAt));
}

export async function listProperties(): Promise<PropertyListing[]> {
  try {
    const rows = await fetchActiveProperties();
    if (rows.length === 0) return mockListings;
    return rows.map(({ property, company: co }) =>
      mapListing(property, co?.name ?? property.companyId ?? "RSC"),
    );
  } catch {
    return mockListings;
  }
}

export async function getPropertyById(id: string): Promise<PropertyListing | undefined> {
  try {
    const [row] = await db
      .select({ property: propertyListing, company })
      .from(propertyListing)
      .leftJoin(company, eq(propertyListing.companyId, company.id))
      .where(eq(propertyListing.id, id))
      .limit(1);

    if (!row) return mockListings.find((p) => p.id === id);
    return mapListing(row.property, row.company?.name ?? "RSC");
  } catch {
    return mockListings.find((p) => p.id === id);
  }
}

export async function getPropertyDetail(id: string): Promise<PropertyDetail | undefined> {
  try {
    const [row] = await db
      .select({ property: propertyListing, company, agent })
      .from(propertyListing)
      .leftJoin(company, eq(propertyListing.companyId, company.id))
      .leftJoin(agent, eq(propertyListing.agentId, agent.id))
      .where(eq(propertyListing.id, id))
      .limit(1);

    if (!row) return mockGetPropertyDetail(id);

    const base = mapListing(row.property, row.company?.name ?? "RSC");
    const images = await fetchImages(id);
    const co = row.company;
    const ag = row.agent;

    return {
      ...base,
      companyId: row.property.companyId ?? slugifyCompanyId(base.company),
      whatsappNumber:
        row.property.whatsappNumber ??
        co?.whatsappNumber ??
        "5554999887766",
      images: images.length > 0 ? images : base.image ? [base.image] : [],
      featured: row.property.featured,
      address:
        row.property.address ??
        `Rua das Hortênsias, 123 — ${base.neighborhood}, ${base.city} - ${base.state}`,
      condoFee: num(row.property.condoFee, 350),
      iptu: num(row.property.iptu, 120),
      landArea: num(row.property.landArea, Math.round(base.area * 2)),
      suites: row.property.suites,
      livingRooms: row.property.livingRooms,
      kitchen: row.property.kitchen,
      laundry: row.property.laundry,
      heating: row.property.heating ?? "Solar",
      yearBuilt: row.property.yearBuilt ?? 2023,
      description:
        row.property.description ??
        "Imóvel disponível na RSC Market com documentação verificada e opções de financiamento.",
      agent: {
        name: ag?.name ?? "Lucas Andrade",
        role: ag?.role ?? "Corretor de Imóveis",
        creci: ag?.creci ?? "12345-F",
        photo:
          ag?.photoUrl ??
          "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&q=80",
      },
      agencyRating: num(co?.rating, 4.9),
      agencyYears: co?.yearsActive ?? 12,
      agencyActive: co?.activeListings ?? 512,
      agencySold: co?.soldCount ?? 1245,
      agencyReviews: co?.reviewsCount ?? 98,
    };
  } catch {
    return mockGetPropertyDetail(id);
  }
}

export async function getSimilarProperties(
  id: string,
  limit = 4,
): Promise<PropertyListing[]> {
  try {
    const all = await listProperties();
    return all.filter((p) => p.id !== id).slice(0, limit);
  } catch {
    return mockGetSimilar(id, limit);
  }
}

export async function getPremiumProperties(): Promise<PropertyListing[]> {
  const all = await listProperties();
  return all.filter((p) => p.premium);
}

export async function getRecommendedProperties(): Promise<PropertyListing[]> {
  const all = await listProperties();
  return all.filter((p) => p.verified).slice(0, 6);
}

export async function getLaunchProperties(): Promise<PropertyListing[]> {
  const all = await listProperties();
  return all.filter((p) => p.launch);
}

/** Used by seed — insert enriched property from mock */
export async function seedPropertyFromMock(
  listing: PropertyListing,
  detail: ReturnType<typeof enrichProperty>,
  companyId: string,
  agentId?: string,
  gallery?: string[],
) {
  await db
    .insert(propertyListing)
    .values({
      id: listing.id,
      companyId,
      agentId,
      title: listing.title,
      type: listing.type,
      status: "active",
      price: String(listing.price),
      currency: listing.currency,
      country: listing.country,
      state: listing.state,
      city: listing.city,
      neighborhood: listing.neighborhood,
      address: detail.address,
      lat: String(listing.lat),
      lng: String(listing.lng),
      bedrooms: listing.bedrooms,
      bathrooms: listing.bathrooms ?? 0,
      suites: detail.suites,
      garage: listing.garage,
      livingRooms: detail.livingRooms,
      kitchen: detail.kitchen,
      laundry: detail.laundry,
      pool: listing.pool,
      area: String(listing.area),
      landArea: String(detail.landArea),
      heating: detail.heating,
      yearBuilt: detail.yearBuilt,
      condoFee: String(detail.condoFee),
      iptu: String(detail.iptu),
      financing: listing.financing,
      verified: listing.verified ?? false,
      premium: listing.premium ?? false,
      featured: detail.featured ?? false,
      launch: listing.launch ?? false,
      whatsappNumber: detail.whatsappNumber,
      coverImage: listing.image,
      description: detail.description,
      publishedAt: listing.publishedAt ? new Date(listing.publishedAt) : new Date(),
    })
    .onConflictDoNothing();

  if (gallery?.length) {
    for (let i = 0; i < gallery.length; i++) {
      await db
        .insert(listingImage)
        .values({
          id: `img_${listing.id}_${i}`,
          listingKind: "property",
          listingId: listing.id,
          url: gallery[i],
          position: i,
        })
        .onConflictDoNothing();
    }
  }
}

export type { CompanyRow, AgentRow };
