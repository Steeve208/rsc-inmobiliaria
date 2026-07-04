import { NextResponse } from "next/server";
import {
  recordCronJobRun,
  SAVED_SEARCH_ALERTS_JOB,
} from "@/lib/cron/job-run-store";
import { logMissingEnvOnce } from "@/lib/env/production-config";
import { processSavedSearchAlerts } from "@/lib/saved-searches/process-alerts";

function isAuthorized(request: Request) {
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret) {
    logMissingEnvOnce(
      "CRON_SECRET",
      "cron",
      "Cron request rejected. Set CRON_SECRET and configure Vercel Cron (vercel.json).",
    );
    return false;
  }

  const authHeader = request.headers.get("authorization");
  if (authHeader === `Bearer ${cronSecret}`) return true;

  const headerSecret = request.headers.get("x-cron-secret");
  return headerSecret === cronSecret;
}

export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  try {
    const summary = await processSavedSearchAlerts();
    await recordCronJobRun(SAVED_SEARCH_ALERTS_JOB, "ok", summary);
    return NextResponse.json({ ok: true, ...summary });
  } catch (error) {
    const message = error instanceof Error ? error.message : "unknown_error";
    await recordCronJobRun(SAVED_SEARCH_ALERTS_JOB, "error", { message });
    return NextResponse.json({ error: "job_failed", message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  return GET(request);
}
