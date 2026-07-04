import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import type { ImoveisFilters } from "@/features/imoveis/types";
import type { VeiculosFilters } from "@/features/veiculos/types";
import {
  createSavedSearch,
  listSavedSearches,
  removeSavedSearch,
  syncSavedSearches,
  updateSavedSearchAlerts,
} from "@/lib/listings/saved-search-repository";
import type { CreateSavedSearchInput, SavedSearchVertical } from "@/lib/saved-searches/types";
import {
  SAVED_SEARCH_ALERT_FREQUENCIES,
  type SavedSearchAlertFrequency,
} from "@/lib/saved-searches/types";

async function requireUserId() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) return null;
  return session.user.id;
}

function isValidFrequency(value: string): value is SavedSearchAlertFrequency {
  return SAVED_SEARCH_ALERT_FREQUENCIES.includes(value as SavedSearchAlertFrequency);
}

function isValidLocale(value: string) {
  return value === "pt" || value === "en" || value === "es";
}

function parseVertical(value: unknown): SavedSearchVertical {
  return value === "vehicle" ? "vehicle" : "property";
}

function parseCreateBody(body: Record<string, unknown>): CreateSavedSearchInput | null {
  if (typeof body.label !== "string" || !body.label.trim() || !body.filters) {
    return null;
  }

  const vertical = parseVertical(body.vertical);

  const alertFrequency =
    typeof body.alertFrequency === "string" && isValidFrequency(body.alertFrequency)
      ? body.alertFrequency
      : undefined;

  const alertLocale =
    typeof body.alertLocale === "string" && isValidLocale(body.alertLocale)
      ? body.alertLocale
      : undefined;

  return {
    label: body.label.trim(),
    vertical,
    filters: body.filters as ImoveisFilters | VeiculosFilters,
    alertsEnabled: typeof body.alertsEnabled === "boolean" ? body.alertsEnabled : undefined,
    alertFrequency,
    alertLocale,
  };
}

function parsePatchBody(body: Record<string, unknown>) {
  if (typeof body.id !== "string" || !body.id.trim()) return null;

  const alertFrequency =
    typeof body.alertFrequency === "string" && isValidFrequency(body.alertFrequency)
      ? body.alertFrequency
      : undefined;

  const alertLocale =
    typeof body.alertLocale === "string" && isValidLocale(body.alertLocale)
      ? body.alertLocale
      : undefined;

  if (
    body.alertsEnabled === undefined &&
    alertFrequency === undefined &&
    alertLocale === undefined
  ) {
    return null;
  }

  return {
    id: body.id.trim(),
    alertsEnabled:
      typeof body.alertsEnabled === "boolean" ? body.alertsEnabled : undefined,
    alertFrequency,
    alertLocale,
  };
}

export async function GET(request: Request) {
  const userId = await requireUserId();
  if (!userId) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const verticalParam = searchParams.get("vertical");
  const vertical =
    verticalParam === "vehicle" || verticalParam === "property" ? verticalParam : undefined;

  return NextResponse.json(await listSavedSearches(userId, vertical));
}

export async function POST(request: Request) {
  const userId = await requireUserId();
  if (!userId) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as Record<string, unknown>;

  if (Array.isArray(body.items)) {
    const items = body.items
      .map((item) => parseCreateBody(item as Record<string, unknown>))
      .filter((item): item is CreateSavedSearchInput => item !== null);

    return NextResponse.json(await syncSavedSearches(userId, items));
  }

  const input = parseCreateBody(body);
  if (!input) {
    return NextResponse.json({ error: "missing_fields" }, { status: 400 });
  }

  const saved = await createSavedSearch(userId, input);
  return NextResponse.json(saved, { status: 201 });
}

export async function PATCH(request: Request) {
  const userId = await requireUserId();
  if (!userId) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as Record<string, unknown>;
  const input = parsePatchBody(body);
  if (!input) {
    return NextResponse.json({ error: "missing_fields" }, { status: 400 });
  }

  const updated = await updateSavedSearchAlerts(userId, input.id, {
    alertsEnabled: input.alertsEnabled,
    alertFrequency: input.alertFrequency,
    alertLocale: input.alertLocale,
  });

  if (!updated) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  return NextResponse.json(updated);
}

export async function DELETE(request: Request) {
  const userId = await requireUserId();
  if (!userId) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "missing_fields" }, { status: 400 });
  }

  await removeSavedSearch(userId, id);
  return NextResponse.json({ ok: true });
}
