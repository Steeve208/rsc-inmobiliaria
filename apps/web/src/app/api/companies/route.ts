import { NextResponse } from "next/server";
import { desc } from "drizzle-orm";
import { db } from "@/lib/db";
import { company } from "@/lib/db/schema";
import { getMarketOrDefault, isMarketId } from "@/lib/markets/config";
import { localCompanyCrudDisabledResponse } from "@/lib/companies/local-crud-disabled";

export async function GET() {
  try {
    const rows = await db
      .select({
        id: company.id,
        name: company.name,
        logoUrl: company.logoUrl,
        verified: company.verified,
        rating: company.rating,
        activeListings: company.activeListings,
        marketId: company.marketId,
      })
      .from(company)
      .orderBy(desc(company.verified), desc(company.activeListings))
      .limit(8);

    return NextResponse.json(
      rows.map((row) => ({
        id: row.id,
        name: row.name,
        logo:
          row.logoUrl ??
          "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=400&q=80",
        listings: row.activeListings,
        verified: row.verified,
        rating: Number(row.rating ?? 0),
        city: isMarketId(row.marketId)
          ? getMarketOrDefault(row.marketId).countryName
          : row.marketId,
      })),
    );
  } catch {
    return NextResponse.json([]);
  }
}

/** Local company registration is disabled — use /api/registration-requests → backoffice. */
export async function POST() {
  return localCompanyCrudDisabledResponse();
}
