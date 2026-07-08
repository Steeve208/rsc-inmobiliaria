/**
 * Backfill market chat threads into backoffice conversations/messages.
 * Usage: cd rsc-market/apps/web && npm run db:backfill-chats
 */
import { asc, eq } from "drizzle-orm";
import { db } from "../src/lib/db";
import { chatMessage, chatThread } from "../src/lib/db/schema";
import {
  syncChatMessageToBackoffice,
  syncThreadOpenToBackoffice,
} from "../src/lib/leads/backoffice-sync";

async function main() {
  const threads = await db.select().from(chatThread).orderBy(asc(chatThread.createdAt));

  console.log(`Backfilling ${threads.length} chat thread(s)...`);

  for (const thread of threads) {
    await syncThreadOpenToBackoffice({
      threadId: thread.id,
      listingId: thread.listingId,
      listingTitle: thread.listingTitle,
      companyId: thread.companyId,
      buyerId: thread.buyerId,
      buyerName: thread.buyerName,
    });

    const messages = await db
      .select()
      .from(chatMessage)
      .where(eq(chatMessage.threadId, thread.id))
      .orderBy(asc(chatMessage.createdAt));

    for (const message of messages) {
      await syncChatMessageToBackoffice({
        thread: {
          threadId: thread.id,
          listingId: thread.listingId,
          listingTitle: thread.listingTitle,
          companyId: thread.companyId,
          buyerId: thread.buyerId,
          buyerName: thread.buyerName,
        },
        messageId: message.id,
        sender: message.sender as "buyer" | "company",
        text: message.text,
        createdAt: message.createdAt,
      });
    }
  }

  console.log("Done.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
