/**
 * Promote a user to admin by email.
 * Usage: cd apps/web && npm run db:promote-admin -- you@example.com
 */
import { eq } from "drizzle-orm";
import { loadEnvFiles } from "./load-env";
import { db } from "../src/lib/db";
import { user } from "../src/lib/db/schema";

loadEnvFiles();

async function main() {
  const email = process.argv[2]?.trim().toLowerCase();
  if (!email) {
    console.error("Usage: npm run db:promote-admin -- <email>");
    process.exit(1);
  }

  const [existing] = await db
    .select({ id: user.id, email: user.email, role: user.role })
    .from(user)
    .where(eq(user.email, email))
    .limit(1);

  if (!existing) {
    console.error(`No user found with email: ${email}`);
    process.exit(1);
  }

  if (existing.role === "admin") {
    console.log(`Already admin: ${existing.email} (${existing.id})`);
    process.exit(0);
  }

  await db.update(user).set({ role: "admin" }).where(eq(user.id, existing.id));
  console.log(`Promoted to admin: ${existing.email} (${existing.id})`);
  process.exit(0);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
