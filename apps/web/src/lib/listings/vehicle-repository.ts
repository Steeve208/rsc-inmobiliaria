import { asc, desc, eq, inArray, and, ne } from "drizzle-orm";
import { db } from "@/lib/db";
import {
  agent,
  company,
  listingImage,
  vehicleListing,
} from "@/lib/db/schema";
import type { VehicleDetail, VehicleListing } from "@/features/veiculos/types";
import { enrichVehicle } from "@/features/veiculos/mock-data";
import { slugifyCompanyId } from "@/lib/leads/utils";
import {
  fetchAllBackofficeListings,
  fetchBackofficeListingById,
  incrementBackofficeListingViews,
  isBackofficeConfigured,
} from "@/lib/backoffice/client";
import {
  filterVehicleSection,
  mapBackofficeToVehicleDetail,
  mapBackofficeToVehicleListing,
} from "@/lib/backoffice/mappers";

type VehicleRow = typeof vehicleListing.$inferSelect;

function num(value: string | number | null | undefined, fallback = 0) {
  if (value == null) return fallback;
  return typeof value === "number" ? value : Number(value);
}

function mapListing(row: VehicleRow, companyName: string): VehicleListing {
  return {
    id: row.id,
    category: "vehicles",
    title: row.title,
    type: row.type as VehicleListing["type"],
    make: row.make,
    model: row.model,
    year: row.year,
    mileage: row.mileage,
    fuel: (row.fuel ?? "flex") as VehicleListing["fuel"],
    transmission: (row.transmission ?? "automatic") as VehicleListing["transmission"],
    color: row.color ?? "",
    engine: row.engine ?? "",
    drive: (row.drive ?? "fwd") as VehicleListing["drive"],
    price: num(row.price),
    currency: row.currency,
    country: row.country,
    state: row.state ?? "",
    city: row.city,
    company: companyName,
    financing: row.financing,
    verified: row.verified || undefined,
    premium: row.premium || undefined,
    featured: row.featured || undefined,
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

async function listBackofficeVehicles(city?: string): Promise<VehicleListing[]> {
  const listings = await fetchAllBackofficeListings({
    category: "automotive",
    city,
  });
  return listings.map(mapBackofficeToVehicleListing);
}

export async function listVehicles(): Promise<VehicleListing[]> {
  if (isBackofficeConfigured()) {
    return listBackofficeVehicles();
  }
  try {
    const rows = await db
      .select({ vehicle: vehicleListing, company })
      .from(vehicleListing)
      .leftJoin(company, eq(vehicleListing.companyId, company.id))
      .where(eq(vehicleListing.status, "active"))
      .orderBy(desc(vehicleListing.publishedAt));

    return rows.map(({ vehicle, company: co }) =>
      mapListing(vehicle, co?.name ?? vehicle.companyId ?? "Concessionária"),
    );
  } catch {
    return [];
  }
}

export async function listActiveVehiclesForAlerts(): Promise<VehicleListing[]> {
  return listVehicles();
}

export async function listVehiclesByIds(ids: string[]): Promise<VehicleListing[]> {
  const uniqueIds = [...new Set(ids.filter(Boolean))];
  if (uniqueIds.length === 0) return [];

  if (isBackofficeConfigured()) {
    const listings = await Promise.all(uniqueIds.map((id) => fetchBackofficeListingById(id)));
    return listings
      .filter((item): item is NonNullable<typeof item> => item !== null)
      .filter((item) => item.category === "automotive")
      .map(mapBackofficeToVehicleListing);
  }

  try {
    const rows = await db
      .select({ vehicle: vehicleListing, company })
      .from(vehicleListing)
      .leftJoin(company, eq(vehicleListing.companyId, company.id))
      .where(inArray(vehicleListing.id, uniqueIds));

    const byId = new Map(
      rows.map(({ vehicle, company: co }) => [
        vehicle.id,
        mapListing(vehicle, co?.name ?? vehicle.companyId ?? "Concessionária"),
      ]),
    );

    return uniqueIds
      .map((id) => byId.get(id))
      .filter((item): item is VehicleListing => item !== undefined);
  } catch {
    return [];
  }
}

export async function getVehicleById(id: string): Promise<VehicleListing | undefined> {
  if (isBackofficeConfigured()) {
    const listing = await fetchBackofficeListingById(id);
    if (!listing || listing.category !== "automotive") return undefined;
    return mapBackofficeToVehicleListing(listing);
  }
  try {
    const [row] = await db
      .select({ vehicle: vehicleListing, company })
      .from(vehicleListing)
      .leftJoin(company, eq(vehicleListing.companyId, company.id))
      .where(eq(vehicleListing.id, id))
      .limit(1);

    if (!row) return undefined;
    return mapListing(row.vehicle, row.company?.name ?? "Concessionária");
  } catch {
    return undefined;
  }
}

export async function getVehicleDetail(id: string): Promise<VehicleDetail | undefined> {
  if (isBackofficeConfigured()) {
    const listing = await fetchBackofficeListingById(id);
    if (!listing || listing.category !== "automotive") return undefined;
    void incrementBackofficeListingViews(id);
    return mapBackofficeToVehicleDetail(listing);
  }
  try {
    const [row] = await db
      .select({ vehicle: vehicleListing, company, agent })
      .from(vehicleListing)
      .leftJoin(company, eq(vehicleListing.companyId, company.id))
      .leftJoin(agent, eq(vehicleListing.agentId, agent.id))
      .where(eq(vehicleListing.id, id))
      .limit(1);

    if (!row) return undefined;

    const base = mapListing(row.vehicle, row.company?.name ?? "Concessionária");
    const images = await fetchImages(id);
    const co = row.company;
    const ag = row.agent;
    const specs = (row.vehicle.specs as Record<string, string>) ?? {};

    return {
      ...base,
      companyId: row.vehicle.companyId ?? slugifyCompanyId(base.company),
      whatsappNumber:
        row.vehicle.whatsappNumber ?? co?.whatsappNumber ?? "5554999887766",
      images: images.length > 0 ? images : base.image ? [base.image] : [],
      videoUrl: row.vehicle.videoUrl ?? undefined,
      has360: row.vehicle.has360,
      tour360Url: row.vehicle.tour360Url ?? undefined,
      address:
        row.vehicle.address ??
        `Av. das Indústrias, 450 — ${base.city} - ${base.state}`,
      condition:
        (row.vehicle.condition as VehicleDetail["condition"]) ??
        (base.year >= 2024 ? "new" : "used"),
      doors: row.vehicle.doors ?? (base.type === "motorcycle" ? 0 : 4),
      consumption: row.vehicle.consumption ?? "12 km/L",
      warranty: row.vehicle.warranty ?? "Garantia da concessionária",
      history: row.vehicle.history ?? [],
      equipment: row.vehicle.equipment ?? [],
      specs:
        Object.keys(specs).length > 0
          ? specs
          : {
              Marca: base.make,
              Modelo: base.model,
              Ano: String(base.year),
            },
      description:
        row.vehicle.description ??
        `${base.make} ${base.model} ${base.year} disponível na RSC Market.`,
      agent: {
        name: ag?.name ?? "Carlos Mendes",
        role: ag?.role ?? "Consultor de Vendas",
        phone: ag?.phone ?? "+55 51 99999-0000",
        photo:
          ag?.photoUrl ??
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80",
      },
      dealershipRating: num(co?.rating, 4.8),
      dealershipYears: co?.yearsActive ?? 15,
      dealershipActive: co?.activeListings ?? 142,
      dealershipSold: co?.soldCount ?? 890,
      dealershipReviews: co?.reviewsCount ?? 124,
    };
  } catch {
    return undefined;
  }
}

export async function listVehiclesByCity(
  city: string,
  state: string,
  limit = 12,
): Promise<VehicleListing[]> {
  if (isBackofficeConfigured()) {
    const listings = await listBackofficeVehicles(city);
    return listings
      .filter((item) => !state || item.state === state)
      .slice(0, limit);
  }
  try {
    const rows = await db
      .select({ vehicle: vehicleListing, company })
      .from(vehicleListing)
      .leftJoin(company, eq(vehicleListing.companyId, company.id))
      .where(
        and(
          eq(vehicleListing.status, "active"),
          eq(vehicleListing.city, city),
          eq(vehicleListing.state, state),
        ),
      )
      .orderBy(desc(vehicleListing.publishedAt))
      .limit(limit);

    return rows.map(({ vehicle, company: co }) =>
      mapListing(vehicle, co?.name ?? vehicle.companyId ?? "Concessionária"),
    );
  } catch {
    return [];
  }
}

export async function getAgencyVehicles(
  companyId: string,
  excludeId: string,
  limit = 6,
): Promise<VehicleListing[]> {
  if (isBackofficeConfigured()) {
    const listings = await fetchAllBackofficeListings({
      category: "automotive",
      organization: companyId,
    });
    return listings
      .filter((item) => item.id !== excludeId)
      .map(mapBackofficeToVehicleListing)
      .slice(0, limit);
  }
  try {
    const rows = await db
      .select({ vehicle: vehicleListing, company })
      .from(vehicleListing)
      .leftJoin(company, eq(vehicleListing.companyId, company.id))
      .where(
        and(
          eq(vehicleListing.companyId, companyId),
          eq(vehicleListing.status, "active"),
          ne(vehicleListing.id, excludeId),
        ),
      )
      .orderBy(desc(vehicleListing.publishedAt))
      .limit(limit);

    return rows.map(({ vehicle, company: co }) =>
      mapListing(vehicle, co?.name ?? vehicle.companyId ?? "Concessionária"),
    );
  } catch {
    return [];
  }
}

export async function getSimilarVehicles(
  id: string,
  limit = 4,
): Promise<VehicleListing[]> {
  if (isBackofficeConfigured()) {
    const base = await getVehicleById(id);
    if (!base) return [];
    const all = await listBackofficeVehicles();
    return all
      .filter((item) => item.id !== id)
      .filter((item) => item.type === base.type || item.make === base.make)
      .slice(0, limit);
  }
  try {
    const all = await listVehicles();
    const base = all.find((v) => v.id === id);
    if (!base) return [];
    return all
      .filter((v) => v.id !== id && (v.type === base.type || v.make === base.make))
      .slice(0, limit);
  } catch {
    return [];
  }
}

export async function getFeaturedVehicles(): Promise<VehicleListing[]> {
  if (isBackofficeConfigured()) {
    return filterVehicleSection(await listBackofficeVehicles(), "launch");
  }
  const all = await listVehicles();
  return all.filter((v) => v.featured);
}

export async function getPremiumVehicles(): Promise<VehicleListing[]> {
  if (isBackofficeConfigured()) {
    return filterVehicleSection(await listBackofficeVehicles(), "premium");
  }
  const all = await listVehicles();
  return all.filter((v) => v.premium);
}

export async function getRecommendedVehicles(): Promise<VehicleListing[]> {
  if (isBackofficeConfigured()) {
    return filterVehicleSection(await listBackofficeVehicles(), "recommended").slice(0, 6);
  }
  const all = await listVehicles();
  return all.filter((v) => v.verified).slice(0, 6);
}

export async function getVehicleMakes(): Promise<string[]> {
  if (isBackofficeConfigured()) {
    const listings = await listBackofficeVehicles();
    return [...new Set(listings.map((item) => item.make).filter(Boolean))].sort();
  }
  try {
    const rows = await db
      .selectDistinct({ make: vehicleListing.make })
      .from(vehicleListing)
      .where(eq(vehicleListing.status, "active"));
    if (rows.length === 0) return [];
    return rows.map((r) => r.make).sort();
  } catch {
    return [];
  }
}

export async function seedVehicleFromMock(
  listing: VehicleListing,
  detail: ReturnType<typeof enrichVehicle>,
  companyId: string,
  agentId?: string,
  gallery?: string[],
) {
  await db
    .insert(vehicleListing)
    .values({
      id: listing.id,
      companyId,
      agentId,
      title: listing.title,
      type: listing.type,
      status: "active",
      condition: detail.condition,
      make: listing.make,
      model: listing.model,
      year: listing.year,
      mileage: listing.mileage,
      fuel: listing.fuel,
      transmission: listing.transmission,
      color: listing.color,
      engine: listing.engine,
      drive: listing.drive,
      doors: detail.doors,
      consumption: detail.consumption,
      warranty: detail.warranty,
      price: String(listing.price),
      currency: listing.currency,
      country: listing.country,
      state: listing.state,
      city: listing.city,
      address: detail.address,
      lat: String(listing.lat),
      lng: String(listing.lng),
      coverImage: listing.image,
      videoUrl: detail.videoUrl,
      has360: detail.has360,
      tour360Url: detail.tour360Url,
      history: detail.history,
      equipment: detail.equipment,
      specs: detail.specs,
      description: detail.description,
      financing: listing.financing,
      verified: listing.verified ?? false,
      premium: listing.premium ?? false,
      featured: listing.featured ?? false,
      whatsappNumber: detail.whatsappNumber,
      publishedAt: listing.publishedAt ? new Date(listing.publishedAt) : new Date(),
    })
    .onConflictDoNothing();

  if (gallery?.length) {
    for (let i = 0; i < gallery.length; i++) {
      await db
        .insert(listingImage)
        .values({
          id: `img_${listing.id}_${i}`,
          listingKind: "vehicle",
          listingId: listing.id,
          url: gallery[i],
          position: i,
        })
        .onConflictDoNothing();
    }
  }
}
