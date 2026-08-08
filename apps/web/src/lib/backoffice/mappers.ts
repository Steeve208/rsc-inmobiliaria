import type { PropertyDetail, PropertyListing, CompanyPublicInfo } from "@/features/imoveis/types";
import type { VehicleDetail, VehicleListing } from "@/features/veiculos/types";
import type { BackofficePublicListing } from "@/lib/backoffice/types";
import { listingImageUrl } from "@/lib/listings/listing-image";

function num(value: unknown, fallback = 0): number {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
  }
  return fallback;
}

function str(value: unknown, fallback = ""): string {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

function bool(value: unknown): boolean {
  return value === true || value === "true" || value === 1 || value === "1";
}

function publishedDate(listing: BackofficePublicListing): string {
  return (listing.publishedAt ?? listing.createdAt).slice(0, 10);
}

function coverImage(listing: BackofficePublicListing): string {
  return listingImageUrl(listing.photos[0]?.url);
}

function gallery(listing: BackofficePublicListing): string[] {
  const photos = listing.photos
    .map((photo) => photo.url?.trim())
    .filter((url): url is string => Boolean(url))
    .map((url) => listingImageUrl(url));
  return photos.length > 0 ? photos : [coverImage(listing)];
}

function looksLikeGarbageTitle(title: string): boolean {
  const value = title.trim();
  if (value.length < 6) return true;
  if (/\b(jyfty|asdf|qwerty|lorem|ipsum|teste\d*|xxx|demo|nilh)\b/i.test(value)) {
    return true;
  }
  const tokens = value.toLowerCase().split(/[^a-zà-ü]+/i).filter(Boolean);
  return tokens.some(
    (token) =>
      token.length >= 4 &&
      !/[aeiouáéíóúàèìòùâêîôûãõäëïöü]/.test(token),
  );
}

const PROPERTY_TYPE_LABELS: Record<string, string> = {
  house: "Casa",
  apartment: "Apartamento",
  land: "Terreno",
  commercial: "Imóvel comercial",
  condo: "Condomínio",
  beach: "Casa de praia",
  countryside: "Casa de campo",
};

/** Prefer a readable title when the portal listing was published with a bad name. */
function propertyDisplayTitle(listing: BackofficePublicListing): string {
  const raw = str(listing.title);
  if (raw && !looksLikeGarbageTitle(raw)) return raw;

  const meta = listing.metadata ?? {};
  const type = str(meta.type, "apartment");
  const typeLabel = PROPERTY_TYPE_LABELS[type] ?? "Imóvel";
  const neighborhood = str(meta.neighborhood);
  const city = listing.locationCity ?? str(meta.city);

  if (neighborhood) return `${typeLabel} em ${neighborhood}`;
  if (city) return `${typeLabel} em ${city}`;
  return typeLabel;
}

function mapCompanyInfo(listing: BackofficePublicListing): CompanyPublicInfo {
  const org = listing.organization;
  const branch = org.primaryBranch ?? null;

  return {
    cnpj: org.cnpj ?? null,
    phone: branch?.phone ?? org.phone ?? org.whatsappNumber ?? null,
    website: org.website ?? null,
    address: branch?.address ?? org.address ?? null,
    city: branch?.city ?? org.city ?? listing.locationCity ?? null,
    state: branch?.state ?? org.state ?? null,
    postalCode: branch?.postalCode ?? org.postalCode ?? null,
    branchName: branch?.name ?? null,
    businessHours: (org.businessHours ?? []).map((hour) => ({
      dayOfWeek: hour.dayOfWeek,
      openTime: hour.openTime,
      closeTime: hour.closeTime,
      isClosed: hour.isClosed,
      timezone: hour.timezone,
    })),
  };
}

export function mapBackofficeToPropertyListing(
  listing: BackofficePublicListing,
): PropertyListing {
  const meta = listing.metadata ?? {};
  const neighborhood = str(meta.neighborhood, "");
  const city =
    str(listing.organization.city) ||
    str(meta.city) ||
    listing.locationCity ||
    "";
  const state =
    str(listing.organization.state) ||
    str(meta.state) ||
    "";

  return {
    id: listing.id,
    category: "properties",
    title: propertyDisplayTitle(listing),
    type: str(meta.type, "apartment"),
    transaction: str(meta.transaction, "buy"),
    condition: str(meta.condition, ""),
    price: listing.price ?? 0,
    currency: listing.currency,
    country: str(meta.country, "Brasil"),
    state,
    city,
    neighborhood,
    bedrooms: num(meta.bedrooms),
    bathrooms: num(meta.bathrooms),
    garage: num(meta.garage),
    pool: bool(meta.pool),
    area: num(meta.area),
    company: listing.organization.name,
    financing: bool(meta.financing),
    verified: bool(meta.verified) || undefined,
    premium: listing.isFeatured || bool(meta.premium) || undefined,
    launch: bool(meta.launch) || undefined,
    image: coverImage(listing),
    lat: num(meta.lat),
    lng: num(meta.lng),
    publishedAt: publishedDate(listing),
    videoUrl: str(meta.videoUrl) || undefined,
  };
}

export function mapBackofficeToPropertyDetail(
  listing: BackofficePublicListing,
): PropertyDetail {
  const base = mapBackofficeToPropertyListing(listing);
  const meta = listing.metadata ?? {};
  const images = gallery(listing);

  return {
    ...base,
    companyId: listing.organization.slug,
    companyLogoUrl: str(listing.organization.logoUrl) || undefined,
    whatsappNumber:
      str(listing.organization.whatsappNumber) ||
      str(listing.organization.whatsappUrl) ||
      str(meta.whatsappNumber),
    images,
    featured: listing.isFeatured || bool(meta.featured),
    virtualTourUrl: str(meta.virtualTourUrl) || undefined,
    floorPlanUrl: str(meta.floorPlanUrl) || undefined,
    address: str(meta.address) || base.city,
    condoFee: num(meta.condoFee),
    iptu: num(meta.iptu),
    landArea: num(meta.landArea),
    suites: num(meta.suites),
    livingRooms: num(meta.livingRooms, 1),
    kitchen: num(meta.kitchen, 1),
    laundry: num(meta.laundry),
    heating: str(meta.heating),
    yearBuilt: num(meta.yearBuilt),
    description: listing.description ?? "",
    videoUrl: str(meta.videoUrl) || undefined,
    agent: null,
    companyInfo: mapCompanyInfo(listing),
    agencyRating: num(meta.agencyRating, 4.5),
    agencyYears: num(meta.agencyYears, 1),
    agencyActive: num(meta.agencyActive, 1),
    agencySold: num(meta.agencySold),
    agencyReviews: num(meta.agencyReviews),
  };
}

export function mapBackofficeToVehicleListing(
  listing: BackofficePublicListing,
): VehicleListing {
  const meta = listing.metadata ?? {};

  return {
    id: listing.id,
    category: "vehicles",
    title: listing.title,
    type: str(meta.type, "car") as VehicleListing["type"],
    make: str(meta.make, listing.title.split(" ")[0] ?? "Marca"),
    model: str(meta.model, listing.title),
    year: num(meta.year, new Date().getFullYear()),
    mileage: num(meta.mileage),
    fuel: str(meta.fuel, "flex") as VehicleListing["fuel"],
    transmission: str(meta.transmission, "automatic") as VehicleListing["transmission"],
    color: str(meta.color),
    engine: str(meta.engine),
    drive: str(meta.drive, "fwd") as VehicleListing["drive"],
    price: listing.price ?? 0,
    currency: listing.currency,
    country: str(meta.country, "Brasil"),
    state: str(meta.state, ""),
    city: listing.locationCity ?? str(meta.city, ""),
    company: listing.organization.name,
    financing: bool(meta.financing),
    verified: bool(meta.verified) || undefined,
    premium: listing.isFeatured || bool(meta.premium) || undefined,
    featured: listing.isFeatured || bool(meta.featured) || undefined,
    image: coverImage(listing),
    lat: num(meta.lat),
    lng: num(meta.lng),
    publishedAt: publishedDate(listing),
  };
}

export function mapBackofficeToVehicleDetail(
  listing: BackofficePublicListing,
): VehicleDetail {
  const base = mapBackofficeToVehicleListing(listing);
  const meta = listing.metadata ?? {};
  const images = gallery(listing);

  return {
    ...base,
    companyId: listing.organization.slug,
    companyLogoUrl: str(listing.organization.logoUrl) || undefined,
    whatsappNumber:
      str(listing.organization.whatsappNumber) ||
      str(listing.organization.whatsappUrl) ||
      str(meta.whatsappNumber),
    images,
    videoUrl: str(meta.videoUrl) || undefined,
    has360: bool(meta.has360) || Boolean(meta.tour360Url),
    tour360Url: str(meta.tour360Url) || undefined,
    address: str(meta.address) || base.city,
    description: listing.description ?? "",
    condition: str(meta.condition, "") as VehicleDetail["condition"],
    doors: num(meta.doors, 4),
    consumption: str(meta.consumption, "—"),
    warranty: str(meta.warranty, "Consultar"),
    history: Array.isArray(meta.history) ? meta.history.map(String) : [],
    equipment: Array.isArray(meta.equipment) ? meta.equipment.map(String) : [],
    specs:
      meta.specs && typeof meta.specs === "object"
        ? Object.fromEntries(
            Object.entries(meta.specs as Record<string, unknown>).map(([key, value]) => [
              key,
              String(value),
            ]),
          )
        : {},
    agent: {
      name: listing.organization.name,
      role: "Concessionária",
      phone:
        str(listing.organization.whatsappNumber) ||
        str(listing.organization.whatsappUrl) ||
        str(meta.whatsappNumber),
      photo: "",
    },
    companyInfo: mapCompanyInfo(listing),
    dealershipRating: num(meta.dealershipRating, 4.5),
    dealershipYears: num(meta.dealershipYears, 1),
    dealershipActive: num(meta.dealershipActive, 1),
    dealershipSold: num(meta.dealershipSold),
    dealershipReviews: num(meta.dealershipReviews),
  };
}

export function filterPropertySection(
  listings: PropertyListing[],
  section?: string | null,
): PropertyListing[] {
  if (section === "premium") {
    return listings.filter((item) => item.premium);
  }
  if (section === "recommended") {
    return listings.filter((item) => item.verified);
  }
  if (section === "launch") {
    return listings.filter((item) => item.launch);
  }
  return listings;
}

export function filterVehicleSection(
  listings: VehicleListing[],
  section?: string | null,
): VehicleListing[] {
  if (section === "premium") {
    return listings.filter((item) => item.premium);
  }
  if (section === "recommended") {
    return listings.filter((item) => item.verified);
  }
  if (section === "launch") {
    return listings.filter((item) => item.featured);
  }
  return listings;
}
