import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { cronJobRun } from "@/lib/db/schema";

export const SAVED_SEARCH_ALERTS_JOB = "saved_search_alerts";

export async function recordCronJobRun(
  jobName: string,
  status: "ok" | "error",
  summary: Record<string, unknown>,
) {
  await db
    .insert(cronJobRun)
    .values({
      jobName,
      lastRunAt: new Date(),
      lastStatus: status,
      lastSummary: summary,
    })
    .onConflictDoUpdate({
      target: cronJobRun.jobName,
      set: {
        lastRunAt: new Date(),
        lastStatus: status,
        lastSummary: summary,
      },
    });
}

export async function getCronJobRun(jobName: string) {
  const [row] = await db
    .select()
    .from(cronJobRun)
    .where(eq(cronJobRun.jobName, jobName))
    .limit(1);

  return row ?? null;
}
