import { and, eq } from "drizzle-orm";
import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import { db } from "@/lib/db";
import * as schema from "@/lib/db/schema";
import { chatMessage, chatThread, scheduledVisit } from "@/lib/db/schema";
import { reassignFinancingRequestsBuyerId } from "@/lib/financing/store";

type DbClient = PostgresJsDatabase<typeof schema>;

export type GuestBuyerSyncResult = {
  visits: number;
  chats: number;
  financingRequests: number;
};

export async function reassignVisitsBuyerId(
  fromBuyerId: string,
  toBuyerId: string,
  client: DbClient = db,
): Promise<number> {
  if (fromBuyerId === toBuyerId) return 0;

  const rows = await client
    .update(scheduledVisit)
    .set({ buyerId: toBuyerId })
    .where(eq(scheduledVisit.buyerId, fromBuyerId))
    .returning({ id: scheduledVisit.id });

  return rows.length;
}

export async function reassignChatThreadsBuyerId(
  fromBuyerId: string,
  toBuyerId: string,
  client: DbClient = db,
): Promise<number> {
  if (fromBuyerId === toBuyerId) return 0;

  const guestThreads = await client
    .select()
    .from(chatThread)
    .where(eq(chatThread.buyerId, fromBuyerId));

  let reassigned = 0;

  for (const guestThread of guestThreads) {
    const [existingUserThread] = await client
      .select()
      .from(chatThread)
      .where(
        and(
          eq(chatThread.listingId, guestThread.listingId),
          eq(chatThread.buyerId, toBuyerId),
        ),
      )
      .limit(1);

    if (existingUserThread) {
      await client
        .update(chatMessage)
        .set({ threadId: existingUserThread.id })
        .where(eq(chatMessage.threadId, guestThread.id));

      const guestUpdatedAt = guestThread.updatedAt.getTime();
      const userUpdatedAt = existingUserThread.updatedAt.getTime();
      if (guestUpdatedAt > userUpdatedAt) {
        await client
          .update(chatThread)
          .set({ updatedAt: guestThread.updatedAt })
          .where(eq(chatThread.id, existingUserThread.id));
      }

      await client.delete(chatThread).where(eq(chatThread.id, guestThread.id));
      reassigned += 1;
      continue;
    }

    await client
      .update(chatThread)
      .set({ buyerId: toBuyerId })
      .where(eq(chatThread.id, guestThread.id));

    reassigned += 1;
  }

  return reassigned;
}

export async function syncGuestBuyerActivity(
  guestBuyerId: string,
  userId: string,
): Promise<GuestBuyerSyncResult> {
  if (guestBuyerId === userId) {
    return { visits: 0, chats: 0, financingRequests: 0 };
  }

  return db.transaction(async (tx) => {
    const visits = await reassignVisitsBuyerId(guestBuyerId, userId, tx);
    const chats = await reassignChatThreadsBuyerId(guestBuyerId, userId, tx);
    const financingRequests = await reassignFinancingRequestsBuyerId(
      guestBuyerId,
      userId,
      tx,
    );

    return { visits, chats, financingRequests };
  });
}
