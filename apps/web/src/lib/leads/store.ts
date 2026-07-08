import { and, asc, desc, eq } from "drizzle-orm";
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
import type {
  ChatMessage,
  ChatThread,
  CompanyLeadConfig,
  CreateVisitInput,
  ListingCategory,
  OpenChatInput,
  ScheduledVisit,
  SendChatMessageInput,
  VisitStatus,
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

export async function createVisit(
  input: CreateVisitInput,
): Promise<ScheduledVisit> {
  const [row] = await db
    .insert(scheduledVisit)
    .values({
      id: newId("visit"),
      listingId: input.listingId,
      listingTitle: input.listingTitle,
      listingCategory: input.listingCategory,
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

  return mapVisit(row);
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
      listingCategory: input.listingCategory,
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
