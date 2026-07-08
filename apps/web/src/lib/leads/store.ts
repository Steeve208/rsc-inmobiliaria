import { and, asc, desc, eq, inArray, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import {
  chatMessage,
  chatThread,
  companyLeadConfig,
  scheduledVisit,
} from "@/lib/db/schema";
import {
  syncChatMessageToBackoffice,
  syncThreadOpenToBackoffice,
} from "./backoffice-sync";
import { syncVisitToBackoffice } from "./visit-sync";
import {
  normalizeListingCategory,
  type ChatMessage,
  type ChatThread,
  type CompanyLeadConfig,
  type CreateVisitInput,
  type ListingCategory,
  type ListingVisitAvailability,
  type OpenChatInput,
  type ScheduledVisit,
  type SendChatMessageInput,
  type UpdateVisitInput,
  type VisitStatus,
} from "./types";

export { slugifyCompanyId } from "./utils";

function newId(prefix: string) {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

type VisitRow = typeof scheduledVisit.$inferSelect;
type ThreadRow = typeof chatThread.$inferSelect;
type MessageRow = typeof chatMessage.$inferSelect;

function mapVisit(row: VisitRow): ScheduledVisit {
  return {
    id: row.id,
    listingId: row.listingId,
    listingTitle: row.listingTitle,
    listingCategory: row.listingCategory as ListingCategory,
    companyId: row.companyId,
    companyName: row.companyName,
    buyerId: row.buyerId,
    buyerName: row.buyerName,
    buyerPhone: row.buyerPhone,
    buyerEmail: row.buyerEmail ?? undefined,
    preferredDate: row.preferredDate,
    preferredTime: row.preferredTime,
    notes: row.notes ?? undefined,
    status: row.status as VisitStatus,
    companyMessage: row.companyMessage ?? undefined,
    proposedDate: row.proposedDate ?? undefined,
    proposedTime: row.proposedTime ?? undefined,
    createdAt: row.createdAt.toISOString(),
  };
}

function mapMessage(row: MessageRow): ChatMessage {
  return {
    id: row.id,
    sender: row.sender as ChatMessage["sender"],
    text: row.text,
    createdAt: row.createdAt.toISOString(),
  };
}

function mapThread(row: ThreadRow, messages: MessageRow[]): ChatThread {
  return {
    id: row.id,
    listingId: row.listingId,
    listingTitle: row.listingTitle,
    listingCategory: row.listingCategory as ListingCategory,
    companyId: row.companyId,
    companyName: row.companyName,
    buyerId: row.buyerId,
    buyerName: row.buyerName,
    messages: messages.map(mapMessage),
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

function threadContext(row: ThreadRow): {
  threadId: string;
  listingId: string;
  listingTitle: string;
  companyId: string;
  buyerId: string;
  buyerName: string;
} {
  return {
    threadId: row.id,
    listingId: row.listingId,
    listingTitle: row.listingTitle,
    companyId: row.companyId,
    buyerId: row.buyerId,
    buyerName: row.buyerName,
  };
}

async function loadMessages(threadId: string): Promise<MessageRow[]> {
  return db
    .select()
    .from(chatMessage)
    .where(eq(chatMessage.threadId, threadId))
    .orderBy(asc(chatMessage.createdAt));
}

export async function getCompanyConfig(
  companyId: string,
): Promise<CompanyLeadConfig | undefined> {
  const [row] = await db
    .select()
    .from(companyLeadConfig)
    .where(eq(companyLeadConfig.companyId, companyId))
    .limit(1);

  if (!row) return undefined;

  return {
    companyId: row.companyId,
    companyName: row.companyName,
    whatsappNumber: row.whatsappNumber,
  };
}

export async function upsertCompanyConfig(
  config: CompanyLeadConfig,
): Promise<CompanyLeadConfig> {
  await db
    .insert(companyLeadConfig)
    .values({
      companyId: config.companyId,
      companyName: config.companyName,
      whatsappNumber: config.whatsappNumber,
    })
    .onConflictDoUpdate({
      target: companyLeadConfig.companyId,
      set: {
        companyName: config.companyName,
        whatsappNumber: config.whatsappNumber,
      },
    });

  return config;
}

function visitWindow(date: string, time: string) {
  const starts = new Date(`${date}T${time}:00`);
  const ends = new Date(starts.getTime() + 60 * 60 * 1000);
  return { starts, ends };
}

async function resolveOrganizationId(companySlug: string): Promise<string | null> {
  const rows = await db.execute<{ id: string }>(sql`
    select id::text as id
    from public.organizations
    where slug = ${companySlug}
    limit 1
  `);
  return rows[0]?.id ?? null;
}

async function hasVisitTimeConflict(
  companyId: string,
  date: string,
  time: string,
  excludeVisitId?: string,
): Promise<boolean> {
  const localRows = await db
    .select({
      id: scheduledVisit.id,
      preferredDate: scheduledVisit.preferredDate,
      preferredTime: scheduledVisit.preferredTime,
    })
    .from(scheduledVisit)
    .where(
      and(
        eq(scheduledVisit.companyId, companyId),
        eq(scheduledVisit.preferredDate, date),
        eq(scheduledVisit.preferredTime, time),
        inArray(scheduledVisit.status, ["pending", "confirmed"]),
      ),
    );

  const localConflict = localRows.some((row) => row.id !== excludeVisitId);
  if (localConflict) return true;

  const organizationId = await resolveOrganizationId(companyId);
  if (!organizationId) return false;

  const { starts, ends } = visitWindow(date, time);
  const appointmentRows = await db.execute<{ id: string }>(sql`
    select id::text as id
    from public.appointments
    where organization_id = ${organizationId}::uuid
      and status = 'scheduled'
      and starts_at < ${ends.toISOString()}::timestamptz
      and ends_at > ${starts.toISOString()}::timestamptz
      ${excludeVisitId ? sql`and (external_visit_id is null or external_visit_id <> ${excludeVisitId})` : sql``}
    limit 1
  `);

  return appointmentRows.length > 0;
}

export async function getListingVisitAvailability(
  listingId: string,
  companyId: string,
): Promise<ListingVisitAvailability> {
  const bookedRows = await db
    .select({
      preferredDate: scheduledVisit.preferredDate,
      preferredTime: scheduledVisit.preferredTime,
    })
    .from(scheduledVisit)
    .where(
      and(
        eq(scheduledVisit.listingId, listingId),
        inArray(scheduledVisit.status, ["pending", "confirmed"]),
      ),
    );

  const bookedDates = [...new Set(bookedRows.map((row) => row.preferredDate))];
  const bookedSlots = bookedRows.map((row) => ({
    date: row.preferredDate,
    time: row.preferredTime,
  }));

  const slotRows = await db.execute<{ visit_date: string }>(sql`
    select s.visit_date::text as visit_date
    from public.listing_visit_slots s
    left join public.organizations o on o.id = s.organization_id
    where s.listing_id = ${listingId}::uuid
       or (s.listing_id is null and o.slug = ${companyId})
    order by s.visit_date asc
  `);

  const availableDates = slotRows.map((row) => row.visit_date);

  return {
    bookedDates,
    bookedSlots,
    availableDates,
    hasCompanySlots: availableDates.length > 0,
  };
}

export async function createVisit(
  input: CreateVisitInput,
): Promise<ScheduledVisit> {
  const listingCategory = normalizeListingCategory(input.listingCategory);
  const availability = await getListingVisitAvailability(
    input.listingId,
    input.companyId,
  );

  if (availability.bookedDates.includes(input.preferredDate)) {
    throw new Error("DATE_NOT_AVAILABLE");
  }

  if (
    availability.bookedSlots.some(
      (slot) =>
        slot.date === input.preferredDate && slot.time === input.preferredTime,
    )
  ) {
    throw new Error("TIME_NOT_AVAILABLE");
  }

  if (
    await hasVisitTimeConflict(
      input.companyId,
      input.preferredDate,
      input.preferredTime,
    )
  ) {
    throw new Error("TIME_NOT_AVAILABLE");
  }

  if (
    availability.hasCompanySlots &&
    !availability.availableDates.includes(input.preferredDate)
  ) {
    throw new Error("DATE_NOT_AVAILABLE");
  }

  const [row] = await db
    .insert(scheduledVisit)
    .values({
      id: newId("visit"),
      listingId: input.listingId,
      listingTitle: input.listingTitle,
      listingCategory,
      companyId: input.companyId,
      companyName: input.companyName,
      buyerId: input.buyerId,
      buyerName: input.buyerName,
      buyerPhone: input.buyerPhone,
      buyerEmail: input.buyerEmail,
      preferredDate: input.preferredDate,
      preferredTime: input.preferredTime,
      notes: input.notes,
      status: "pending",
    })
    .returning();

  const visit = mapVisit(row);
  await syncVisitToBackoffice(visit);
  return visit;
}

export async function updateVisit(
  input: UpdateVisitInput,
): Promise<ScheduledVisit | undefined> {
  const [existing] = await db
    .select()
    .from(scheduledVisit)
    .where(eq(scheduledVisit.id, input.visitId))
    .limit(1);

  if (!existing) return undefined;

  const nextStatus = input.status ?? (existing.status as VisitStatus);
  const nextDate = input.preferredDate ?? existing.preferredDate;
  const nextTime = input.preferredTime ?? existing.preferredTime;

  if (
    nextStatus !== "cancelled" &&
    (nextDate !== existing.preferredDate || nextTime !== existing.preferredTime) &&
    (await hasVisitTimeConflict(existing.companyId, nextDate, nextTime, existing.id))
  ) {
    throw new Error("TIME_NOT_AVAILABLE");
  }

  const [row] = await db
    .update(scheduledVisit)
    .set({
      status: nextStatus,
      preferredDate: nextDate,
      preferredTime: nextTime,
      companyMessage: input.companyMessage ?? existing.companyMessage,
      proposedDate:
        nextStatus === "confirmed"
          ? null
          : input.proposedDate === ""
            ? null
            : input.proposedDate ?? existing.proposedDate,
      proposedTime:
        nextStatus === "confirmed"
          ? null
          : input.proposedTime === ""
            ? null
            : input.proposedTime ?? existing.proposedTime,
    })
    .where(eq(scheduledVisit.id, input.visitId))
    .returning();

  const visit = mapVisit(row);
  await syncVisitToBackoffice(visit);
  return visit;
}

export async function getVisitById(visitId: string): Promise<ScheduledVisit | undefined> {
  const [row] = await db
    .select()
    .from(scheduledVisit)
    .where(eq(scheduledVisit.id, visitId))
    .limit(1);

  return row ? mapVisit(row) : undefined;
}

export async function listVisits(filters: {
  buyerId?: string;
  companyId?: string;
}): Promise<ScheduledVisit[]> {
  const conditions = [];
  if (filters.buyerId) conditions.push(eq(scheduledVisit.buyerId, filters.buyerId));
  if (filters.companyId)
    conditions.push(eq(scheduledVisit.companyId, filters.companyId));

  const rows = await db
    .select()
    .from(scheduledVisit)
    .where(conditions.length ? and(...conditions) : undefined)
    .orderBy(desc(scheduledVisit.createdAt));

  return rows.map(mapVisit);
}

export { reassignVisitsBuyerId } from "@/lib/buyer/sync-guest-activity";

export async function openChatThread(
  input: OpenChatInput,
): Promise<ChatThread> {
  const listingCategory = normalizeListingCategory(input.listingCategory);

  const [existing] = await db
    .select()
    .from(chatThread)
    .where(
      and(
        eq(chatThread.listingId, input.listingId),
        eq(chatThread.buyerId, input.buyerId),
      ),
    )
    .limit(1);

  const initialText = input.initialMessage?.trim();

  if (existing) {
    if (initialText) {
      const messageId = newId("msg");
      const createdAt = new Date();
      await db.insert(chatMessage).values({
        id: messageId,
        threadId: existing.id,
        sender: "buyer",
        text: initialText,
        createdAt,
      });
      await db
        .update(chatThread)
        .set({ updatedAt: new Date() })
        .where(eq(chatThread.id, existing.id));
      await syncChatMessageToBackoffice({
        thread: threadContext(existing),
        messageId,
        sender: "buyer",
        text: initialText,
        createdAt,
      });
    } else {
      await syncThreadOpenToBackoffice(threadContext(existing));
    }
    const messages = await loadMessages(existing.id);
    return mapThread(existing, messages);
  }

  const threadId = newId("chat");
  const [created] = await db
    .insert(chatThread)
    .values({
      id: threadId,
      listingId: input.listingId,
      listingTitle: input.listingTitle,
      listingCategory,
      companyId: input.companyId,
      companyName: input.companyName,
      buyerId: input.buyerId,
      buyerName: input.buyerName,
    })
    .returning();

  await syncThreadOpenToBackoffice(threadContext(created));

  if (initialText) {
    const messageId = newId("msg");
    const createdAt = new Date();
    await db.insert(chatMessage).values({
      id: messageId,
      threadId,
      sender: "buyer",
      text: initialText,
      createdAt,
    });
    await syncChatMessageToBackoffice({
      thread: threadContext(created),
      messageId,
      sender: "buyer",
      text: initialText,
      createdAt,
    });
  }

  const messages = await loadMessages(threadId);
  return mapThread(created, messages);
}

export async function sendChatMessage(
  input: SendChatMessageInput,
): Promise<ChatThread | undefined> {
  const [thread] = await db
    .select()
    .from(chatThread)
    .where(eq(chatThread.id, input.threadId))
    .limit(1);

  if (!thread) return undefined;

  const messageId = newId("msg");
  const createdAt = new Date();
  const text = input.text.trim();

  await db.insert(chatMessage).values({
    id: messageId,
    threadId: thread.id,
    sender: input.sender,
    text,
    createdAt,
  });
  await db
    .update(chatThread)
    .set({ updatedAt: new Date() })
    .where(eq(chatThread.id, thread.id));

  await syncChatMessageToBackoffice({
    thread: threadContext(thread),
    messageId,
    sender: input.sender,
    text,
    createdAt,
  });

  const messages = await loadMessages(thread.id);
  return mapThread(thread, messages);
}

export async function listChatThreads(filters: {
  buyerId?: string;
  companyId?: string;
  threadId?: string;
}): Promise<ChatThread[]> {
  const conditions = [];
  if (filters.threadId) conditions.push(eq(chatThread.id, filters.threadId));
  if (filters.buyerId) conditions.push(eq(chatThread.buyerId, filters.buyerId));
  if (filters.companyId)
    conditions.push(eq(chatThread.companyId, filters.companyId));

  const rows = await db
    .select()
    .from(chatThread)
    .where(conditions.length ? and(...conditions) : undefined)
    .orderBy(desc(chatThread.updatedAt));

  return Promise.all(
    rows.map(async (row) => mapThread(row, await loadMessages(row.id))),
  );
}

export async function getChatThread(
  threadId: string,
): Promise<ChatThread | undefined> {
  return (await listChatThreads({ threadId }))[0];
}
