import { asc, desc, eq } from "drizzle-orm";
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

export async function listVehicles(): Promise<VehicleListing[]> {
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

export async function getVehicleById(id: string): Promise<VehicleListing | undefined> {
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

export async function getSimilarVehicles(
  id: string,
  limit = 4,
): Promise<VehicleListing[]> {
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
  const all = await listVehicles();
  return all.filter((v) => v.featured);
}

export async function getPremiumVehicles(): Promise<VehicleListing[]> {
  const all = await listVehicles();
  return all.filter((v) => v.premium);
}

export async function getRecommendedVehicles(): Promise<VehicleListing[]> {
  const all = await listVehicles();
  return all.filter((v) => v.verified).slice(0, 6);
}

export async function getVehicleMakes(): Promise<string[]> {
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
