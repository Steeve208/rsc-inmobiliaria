import { sql } from "drizzle-orm";
import { db } from "@/lib/db";

type ThreadContext = {
  threadId: string;
  listingId: string;
  listingTitle: string;
  companyId: string;
  buyerId: string;
  buyerName: string;
};

function isUuid(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value,
  );
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

async function resolveListingUuid(listingId: string): Promise<string | null> {
  if (!isUuid(listingId)) return null;

  const rows = await db.execute<{ id: string }>(sql`
    select id::text as id
    from public.listings
    where id = ${listingId}::uuid
    limit 1
  `);
  return rows[0]?.id ?? null;
}

async function ensureConversation(thread: ThreadContext): Promise<string | null> {
  const existing = await db.execute<{ id: string }>(sql`
    select id::text as id
    from public.conversations
    where external_thread_id = ${thread.threadId}
    limit 1
  `);
  if (existing[0]?.id) return existing[0].id;

  const organizationId = await resolveOrganizationId(thread.companyId);
  if (!organizationId) {
    console.warn(`[chat-sync] organization not found for slug: ${thread.companyId}`);
    return null;
  }

  const listingId = await resolveListingUuid(thread.listingId);
  const subject = `Chat — ${thread.buyerName}`;

  const inserted = await db.execute<{ id: string }>(sql`
    insert into public.conversations (
      organization_id,
      listing_id,
      channel,
      status,
      subject,
      buyer_id,
      buyer_name,
      external_thread_id,
      last_message_at,
      created_at,
      updated_at
    ) values (
      ${organizationId}::uuid,
      ${listingId ? sql`${listingId}::uuid` : sql`null`},
      'internal',
      'open',
      ${subject},
      ${thread.buyerId},
      ${thread.buyerName},
      ${thread.threadId},
      now(),
      now(),
      now()
    )
    returning id::text as id
  `);

  return inserted[0]?.id ?? null;
}

export async function syncChatMessageToBackoffice(params: {
  thread: ThreadContext;
  messageId: string;
  sender: "buyer" | "company";
  text: string;
  createdAt: Date;
}): Promise<void> {
  try {
    const conversationId = await ensureConversation(params.thread);
    if (!conversationId) return;

    const isFromCustomer = params.sender === "buyer";

    await db.execute(sql`
      insert into public.messages (
        conversation_id,
        organization_id,
        body,
        is_from_customer,
        external_message_id,
        created_at
      )
      select
        ${conversationId}::uuid,
        c.organization_id,
        ${params.text},
        ${isFromCustomer},
        ${params.messageId},
        ${params.createdAt.toISOString()}::timestamptz
      from public.conversations c
      where c.id = ${conversationId}::uuid
      on conflict (external_message_id) where external_message_id is not null
      do nothing
    `);

    await db.execute(sql`
      update public.conversations
      set
        last_message_at = greatest(
          coalesce(last_message_at, '-infinity'::timestamptz),
          ${params.createdAt.toISOString()}::timestamptz
        ),
        updated_at = now()
      where id = ${conversationId}::uuid
    `);
  } catch (error) {
    console.error("[chat-sync] failed to mirror message to backoffice", error);
  }
}

export async function syncThreadOpenToBackoffice(thread: ThreadContext): Promise<void> {
  try {
    await ensureConversation(thread);
  } catch (error) {
    console.error("[chat-sync] failed to ensure conversation", error);
  }
}
