/**
 * Seed de datos iniciales en Supabase/Postgres.
 * Uso: DATABASE_URL=... npm run db:seed
 */
import { db } from "../src/lib/db";
import { agent, company, companyLeadConfig } from "../src/lib/db/schema";
import {
  enrichProperty,
  propertyListings,
} from "../src/features/imoveis/mock-data";
import {
  enrichVehicle,
  vehicleListings,
} from "../src/features/veiculos/mock-data";
import { slugifyCompanyId, DEFAULT_COMPANY_CONFIGS } from "../src/lib/leads/utils";
import { seedPropertyFromMock } from "../src/lib/listings/property-repository";
import { seedVehicleFromMock } from "../src/lib/listings/vehicle-repository";

const detailGalleryProperty = [
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80",
  "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=600&q=80",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80",
];

const detailGalleryVehicle = [
  "https://images.unsplash.com/photo-1494976688679-786211bc1775?w=1200&q=80",
  "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&q=80",
  "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=600&q=80",
];

async function ensureCompany(name: string) {
  const id = slugifyCompanyId(name);
  const config = DEFAULT_COMPANY_CONFIGS[id];

  await db
    .insert(company)
    .values({
      id,
      name,
      type: name.toLowerCase().includes("auto") ? "dealership" : "real_estate",
      whatsappNumber: config?.whatsappNumber ?? "5554999887766",
      verified: true,
      rating: "4.8",
      yearsActive: 10,
      activeListings: 100,
      soldCount: 500,
      reviewsCount: 80,
    })
    .onConflictDoNothing();

  await db
    .insert(companyLeadConfig)
    .values({
      companyId: id,
      companyName: name,
      whatsappNumber: config?.whatsappNumber ?? "5554999887766",
    })
    .onConflictDoNothing();

  return id;
}

async function ensureAgent(
  companyId: string,
  suffix: "property" | "vehicle",
  data: { name: string; role: string; creci?: string; phone?: string; photo: string },
) {
  const id = `agent_${companyId}_${suffix}`;
  await db
    .insert(agent)
    .values({
      id,
      companyId,
      name: data.name,
      role: data.role,
      creci: data.creci,
      phone: data.phone,
      photoUrl: data.photo,
    })
    .onConflictDoNothing();
  return id;
}

async function main() {
  console.log("Seeding RSC Market database...");

  const companyNames = new Set<string>();
  for (const p of propertyListings) companyNames.add(p.company);
  for (const v of vehicleListings) companyNames.add(v.company);

  const companyIds = new Map<string, string>();
  for (const name of companyNames) {
    companyIds.set(name, await ensureCompany(name));
  }

  for (const config of Object.values(DEFAULT_COMPANY_CONFIGS)) {
    await db
      .insert(company)
      .values({
        id: config.companyId,
        name: config.companyName,
        whatsappNumber: config.whatsappNumber,
        verified: true,
        rating: "4.9",
        yearsActive: 12,
      })
      .onConflictDoNothing();
  }

  for (const listing of propertyListings) {
    const companyId = companyIds.get(listing.company)!;
    const detail = enrichProperty(listing);
    const agentId = await ensureAgent(companyId, "property", {
      name: detail.agent.name,
      role: detail.agent.role,
      creci: detail.agent.creci,
      photo: detail.agent.photo,
    });
    await seedPropertyFromMock(
      listing,
      detail,
      companyId,
      agentId,
      detailGalleryProperty,
    );
    console.log(`  property ${listing.id}`);
  }

  for (const listing of vehicleListings) {
    const companyId = companyIds.get(listing.company)!;
    const detail = enrichVehicle(listing);
    const agentId = await ensureAgent(companyId, "vehicle", {
      name: detail.agent.name,
      role: detail.agent.role,
      phone: detail.agent.phone,
      photo: detail.agent.photo,
    });
    await seedVehicleFromMock(
      listing,
      detail,
      companyId,
      agentId,
      detailGalleryVehicle,
    );
    console.log(`  vehicle ${listing.id}`);
  }

  console.log("Done.");
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
