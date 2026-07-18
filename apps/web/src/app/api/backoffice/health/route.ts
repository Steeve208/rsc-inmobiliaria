import { NextResponse } from "next/server";
import {
  getBackofficeBaseUrl,
  isBackofficeConfigured,
} from "@/lib/backoffice/config";

export async function GET() {
  const base = getBackofficeBaseUrl();
  const secretConfigured = Boolean(
    process.env.MARKET_INTERNAL_API_SECRET?.trim(),
  );

  if (!base) {
    return NextResponse.json(
      {
        ok: false,
        configured: false,
        secretConfigured,
        error: "BACKOFFICE_URL_MISSING",
      },
      { status: 503 },
    );
  }

  try {
    const response = await fetch(`${base}/api/marketplace/v1/health`, {
      cache: "no-store",
      signal: AbortSignal.timeout(8000),
    });
    const payload = (await response.json().catch(() => null)) as {
      status?: string;
      supabase?: { connected?: boolean; tablesReady?: boolean };
    } | null;

    const ok =
      response.ok &&
      payload?.status === "ok" &&
      payload?.supabase?.connected !== false;

    return NextResponse.json(
      {
        ok,
        configured: isBackofficeConfigured(),
        secretConfigured,
        baseUrl: base,
        backoffice: payload,
        status: response.status,
      },
      { status: ok ? 200 : 503 },
    );
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        configured: isBackofficeConfigured(),
        secretConfigured,
        baseUrl: base,
        error: error instanceof Error ? error.message : "BACKOFFICE_UNREACHABLE",
      },
      { status: 503 },
    );
  }
}
