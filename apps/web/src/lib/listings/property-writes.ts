import { and, asc, desc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { listingImage, propertyListing } from "@/lib/db/schema";
import type { CreatePropertyInput, UpdatePropertyInput } from "@/lib/validations/property";
import { listingImageUrl } from "@/lib/listings/constants";

export type CompanyPropertyRow = {
  id: string;
  title: string;
  type: string;
  transaction: string;
  price: number;
  currency: string;
  city: string;
  state: string;
  status: string;
  coverImage: string;
  videoUrl: string | null;
  virtualTourUrl: string | null;
  floorPlanUrl: string | null;
  imageCount: number;
  publishedAt: string | null;
};

function num(value: string | number | null | undefined, fallback = 0) {
  if (value == null) return fallback;
  return typeof value === "number" ? value : Number(value);
}

function newPropertyId(companyId: string) {
  return `prop_${companyId}_${Date.now().toString(36)}`;
}

function newImageId(propertyId: string) {
  return `img_${propertyId}_${Date.now().toString(36)}`;
}

export async function listCompanyProperties(
  companyId: string,
): Promise<CompanyPropertyRow[]> {
  const rows = await db
    .select()
    .from(propertyListing)
    .where(eq(propertyListing.companyId, companyId))
    .orderBy(desc(propertyListing.updatedAt));

  const result: CompanyPropertyRow[] = [];

  for (const row of rows) {
    const images = await db
      .select({ id: listingImage.id })
      .from(listingImage)
      .where(
        and(
          eq(listingImage.listingId, row.id),
          eq(listingImage.listingKind, "property"),
        ),
      );

    result.push({
      id: row.id,
      title: row.title,
      type: row.type,
      transaction: row.transaction,
      price: num(row.price),
      currency: row.currency,
      city: row.city,
      state: row.state ?? "",
      status: row.status,
      coverImage: listingImageUrl(row.coverImage),
      videoUrl: row.videoUrl,
      virtualTourUrl: row.virtualTourUrl,
      floorPlanUrl: row.floorPlanUrl,
      imageCount: images.length,
      publishedAt: row.publishedAt?.toISOString() ?? null,
    });
  }

  return result;
}

export async function getCompanyProperty(companyId: string, propertyId: string) {
  const [row] = await db
    .select()
    .from(propertyListing)
    .where(
      and(
        eq(propertyListing.id, propertyId),
        eq(propertyListing.companyId, companyId),
      ),
    )
    .limit(1);

  if (!row) return null;

  const images = await db
    .select({
      id: listingImage.id,
      url: listingImage.url,
      position: listingImage.position,
    })
    .from(listingImage)
    .where(
      and(
        eq(listingImage.listingId, propertyId),
        eq(listingImage.listingKind, "property"),
      ),
    )
    .orderBy(asc(listingImage.position));

  return {
    ...row,
    price: num(row.price),
    images: images.map((img) => ({
      id: img.id,
      url: listingImageUrl(img.url),
      position: img.position,
    })),
  };
}

export async function createCompanyProperty(
  companyId: string,
  input: CreatePropertyInput,
) {
  const id = newPropertyId(companyId);

  const [created] = await db
    .insert(propertyListing)
    .values({
      id,
      companyId,
      title: input.title,
      type: input.type,
      transaction: input.transaction,
      status: "active",
      price: String(input.price),
      currency: input.currency,
      country: input.country,
      state: input.state,
      city: input.city,
      neighborhood: input.neighborhood,
      address: input.address,
      description: input.description,
      bedrooms: input.bedrooms ?? 0,
      bathrooms: input.bathrooms ?? 0,
      garage: input.garage ?? 0,
      area: String(input.area ?? 0),
      publishedAt: new Date(),
    })
    .returning();

  return created;
}

export async function updateCompanyProperty(
  companyId: string,
  propertyId: string,
  input: UpdatePropertyInput,
) {
  const [updated] = await db
    .update(propertyListing)
    .set({
      ...(input.title != null ? { title: input.title } : {}),
      ...(input.type != null ? { type: input.type } : {}),
      ...(input.transaction != null ? { transaction: input.transaction } : {}),
      ...(input.price != null ? { price: String(input.price) } : {}),
      ...(input.currency != null ? { currency: input.currency } : {}),
      ...(input.country != null ? { country: input.country } : {}),
      ...(input.state != null ? { state: input.state } : {}),
      ...(input.city != null ? { city: input.city } : {}),
      ...(input.neighborhood != null ? { neighborhood: input.neighborhood } : {}),
      ...(input.address != null ? { address: input.address } : {}),
      ...(input.description != null ? { description: input.description } : {}),
      ...(input.bedrooms != null ? { bedrooms: input.bedrooms } : {}),
      ...(input.bathrooms != null ? { bathrooms: input.bathrooms } : {}),
      ...(input.garage != null ? { garage: input.garage } : {}),
      ...(input.area != null ? { area: String(input.area) } : {}),
      ...(input.videoUrl !== undefined ? { videoUrl: input.videoUrl || null } : {}),
      ...(input.virtualTourUrl !== undefined
        ? { virtualTourUrl: input.virtualTourUrl || null }
        : {}),
      ...(input.floorPlanUrl !== undefined
        ? { floorPlanUrl: input.floorPlanUrl || null }
        : {}),
      ...(input.status != null ? { status: input.status } : {}),
    })
    .where(
      and(
        eq(propertyListing.id, propertyId),
        eq(propertyListing.companyId, companyId),
      ),
    )
    .returning();

  return updated ?? null;
}

export async function addPropertyImage(
  companyId: string,
  propertyId: string,
  url: string,
) {
  const property = await getCompanyProperty(companyId, propertyId);
  if (!property) return null;

  const position = property.images.length;
  const imageId = newImageId(propertyId);

  await db.insert(listingImage).values({
    id: imageId,
    listingKind: "property",
    listingId: propertyId,
    url,
    position,
  });

  if (!property.coverImage) {
    await db
      .update(propertyListing)
      .set({ coverImage: url })
      .where(eq(propertyListing.id, propertyId));
  }

  return { id: imageId, url, position };
}

export async function removePropertyImage(
  companyId: string,
  propertyId: string,
  imageId: string,
) {
  const property = await getCompanyProperty(companyId, propertyId);
  if (!property) return false;

  await db
    .delete(listingImage)
    .where(
      and(eq(listingImage.id, imageId), eq(listingImage.listingId, propertyId)),
    );

  const remaining = property.images.filter((img) => img.id !== imageId);
  const nextCover = remaining[0]?.url ?? null;

  await db
    .update(propertyListing)
    .set({ coverImage: nextCover })
    .where(eq(propertyListing.id, propertyId));

  return true;
}

export async function setPropertyVideo(
  companyId: string,
  propertyId: string,
  videoUrl: string,
) {
  return updateCompanyProperty(companyId, propertyId, { videoUrl });
}

export async function setPropertyVirtualTour(
  companyId: string,
  propertyId: string,
  virtualTourUrl: string,
) {
  return updateCompanyProperty(companyId, propertyId, { virtualTourUrl });
}

export async function setPropertyFloorPlan(
  companyId: string,
  propertyId: string,
  floorPlanUrl: string,
) {
  return updateCompanyProperty(companyId, propertyId, { floorPlanUrl });
}

export async function clearPropertyFloorPlan(companyId: string, propertyId: string) {
  return updateCompanyProperty(companyId, propertyId, { floorPlanUrl: "" });
}
