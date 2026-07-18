import { and, desc, eq } from "drizzle-orm";
import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import { db } from "@/lib/db";
import * as schema from "@/lib/db/schema";
import { financingRequest } from "@/lib/db/schema";
import type { ListingCategory } from "@/lib/leads/types";
import {
  syncFinancingStatusToBackoffice,
  syncFinancingToBackoffice,
} from "./financing-sync";
import { pullFinancingOrdersFromBackoffice } from "./backoffice-orders";
import type {
  CreateFinancingRequestInput,
  FinancingRequest,
  FinancingRequestStatus,
  UpdateFinancingRequestStatusInput,
} from "./types";

type DbClient = PostgresJsDatabase<typeof schema>;

function newId() {
  return `fin_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

type Row = typeof financingRequest.$inferSelect;

function toNumber(value: string | number) {
  return typeof value === "number" ? value : Number(value);
}

function mapRow(row: Row, companyId?: string): FinancingRequest {
  return {
    id: row.id,
    buyerId: row.buyerId,
    buyerName: row.buyerName ?? undefined,
    buyerEmail: row.buyerEmail ?? undefined,
    buyerPhone: row.buyerPhone ?? undefined,
    companyId,
    listingId: row.listingId ?? undefined,
    listingTitle: row.listingTitle ?? undefined,
    listingCategory: row.listingCategory
      ? (row.listingCategory as ListingCategory)
      : undefined,
    propertyValue: toNumber(row.propertyValue),
    downPaymentPct: toNumber(row.downPaymentPct),
    downPaymentAmount: toNumber(row.downPaymentAmount),
    termMonths: row.termMonths,
    interestRate: toNumber(row.interestRate),
    estimatedInstallment: toNumber(row.estimatedInstallment),
    currency: row.currency,
    status: row.status as FinancingRequestStatus,
    notes: row.notes ?? undefined,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

export async function createFinancingRequest(
  input: CreateFinancingRequestInput,
): Promise<FinancingRequest> {
  const [row] = await db
    .insert(financingRequest)
    .values({
      id: newId(),
      buyerId: input.buyerId,
      buyerName: input.buyerName,
      buyerEmail: input.buyerEmail,
      buyerPhone: input.buyerPhone,
      listingId: input.listingId,
      listingTitle: input.listingTitle,
      listingCategory: input.listingCategory,
      propertyValue: String(input.propertyValue),
      downPaymentPct: String(input.downPaymentPct),
      downPaymentAmount: String(input.downPaymentAmount),
      termMonths: input.termMonths,
      interestRate: String(input.interestRate),
      estimatedInstallment: String(input.estimatedInstallment),
      currency: input.currency ?? "BRL",
      status: "pending",
      notes: input.notes,
    })
    .returning();

  const created = mapRow(row, input.companyId);
  await syncFinancingToBackoffice(created);
  return created;
}

export async function listFinancingRequests(filters: {
  buyerId?: string;
  status?: FinancingRequestStatus;
}): Promise<FinancingRequest[]> {
  const conditions = [];
  if (filters.buyerId) conditions.push(eq(financingRequest.buyerId, filters.buyerId));
  if (filters.status) conditions.push(eq(financingRequest.status, filters.status));

  const rows = await db
    .select()
    .from(financingRequest)
    .where(conditions.length ? and(...conditions) : undefined)
    .orderBy(desc(financingRequest.createdAt));

  await pullFinancingOrdersFromBackoffice(rows.map((row) => row.id));

  const refreshed = await db
    .select()
    .from(financingRequest)
    .where(conditions.length ? and(...conditions) : undefined)
    .orderBy(desc(financingRequest.createdAt));

  return refreshed.map((row) => mapRow(row));
}

export async function getFinancingRequest(
  id: string,
): Promise<FinancingRequest | undefined> {
  await pullFinancingOrdersFromBackoffice([id]);

  const [row] = await db
    .select()
    .from(financingRequest)
    .where(eq(financingRequest.id, id))
    .limit(1);

  return row ? mapRow(row) : undefined;
}

export async function updateFinancingRequestStatus(
  input: UpdateFinancingRequestStatusInput,
): Promise<FinancingRequest | undefined> {
  const [row] = await db
    .update(financingRequest)
    .set({ status: input.status, updatedAt: new Date() })
    .where(eq(financingRequest.id, input.id))
    .returning();

  if (!row) return undefined;

  const updated = mapRow(row);
  await syncFinancingStatusToBackoffice(updated.id, updated.status);
  return updated;
}

export async function reassignFinancingRequestsBuyerId(
  fromBuyerId: string,
  toBuyerId: string,
  client: DbClient = db,
): Promise<number> {
  if (fromBuyerId === toBuyerId) return 0;

  const rows = await client
    .update(financingRequest)
    .set({ buyerId: toBuyerId, updatedAt: new Date() })
    .where(eq(financingRequest.buyerId, fromBuyerId))
    .returning({ id: financingRequest.id });

  return rows.length;
}
