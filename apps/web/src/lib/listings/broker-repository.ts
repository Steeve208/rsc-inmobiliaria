import { desc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { agent, company } from "@/lib/db/schema";
import { listingImageUrl } from "@/lib/listings/constants";
import { slugifyCompanyId } from "@/lib/leads/utils";
import { getMarketOrDefault } from "@/lib/markets/config";
import { listProperties } from "@/lib/listings/property-repository";
import type { PropertyListing } from "@/features/imoveis/types";
import type { BrokerProfile } from "@/features/corredores/types";

type AgentRow = typeof agent.$inferSelect;
type CompanyRow = typeof company.$inferSelect;

function num(value: string | number | null | undefined, fallback = 0) {
  if (value == null) return fallback;
  return typeof value === "number" ? value : Number(value);
}

function mapBroker(ag: AgentRow, co: CompanyRow): BrokerProfile {
  const market = getMarketOrDefault(co.marketId);
  const phone = ag.phone?.trim() || co.phone?.trim() || "";
  const whatsapp =
    co.whatsappNumber?.replace(/\D/g, "") || phone.replace(/\D/g, "");

  return {
    id: ag.id,
    name: ag.name,
    role: ag.role?.trim() || "Broker",
    bio: "",
    photo: ag.photoUrl?.trim() ? listingImageUrl(ag.photoUrl) : "",
    coverImage:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1400&q=80",
    creci: ag.creci?.trim() || "",
    companyId: co.id,
    companyName: co.name,
    companyLogo: co.logoUrl?.trim() || "",
    verified: Boolean(co.verified),
    country: market.countryName,
    state: "",
    city: "",
    languages: [],
    specialties: [],
    phone,
    whatsapp,
    email: co.email?.trim() || "",
    rating: num(co.rating),
    reviewsCount: co.reviewsCount ?? 0,
    listingsCount: co.activeListings ?? 0,
    yearsActive: co.yearsActive ?? 0,
    soldCount: co.soldCount ?? 0,
  };
}

async function listLocalBrokers(): Promise<BrokerProfile[]> {
  try {
    const rows = await db
      .select({ broker: agent, company })
      .from(agent)
      .innerJoin(company, eq(agent.companyId, company.id))
      .orderBy(desc(company.verified), desc(company.activeListings));

    return rows.map(({ broker, company: co }) => mapBroker(broker, co));
  } catch {
    return [];
  }
}

export async function listBrokers(): Promise<BrokerProfile[]> {
  const live = await listLocalBrokers();
  return live.sort((a, b) => {
    if (a.verified !== b.verified) return a.verified ? -1 : 1;
    return b.listingsCount - a.listingsCount;
  });
}

export async function getBrokerById(id: string): Promise<BrokerProfile | undefined> {
  const live = await listLocalBrokers();
  return live.find((item) => item.id === id);
}

export async function listBrokerListings(
  broker: BrokerProfile,
  limit = 6,
): Promise<PropertyListing[]> {
  const catalog = await listProperties();
  const companySlug = slugifyCompanyId(broker.companyName);
  const matched = catalog.filter((item) => {
    const itemSlug = slugifyCompanyId(item.company);
    return (
      item.company === broker.companyName ||
      itemSlug === broker.companyId ||
      itemSlug === companySlug
    );
  });
  return matched.slice(0, limit);
}
