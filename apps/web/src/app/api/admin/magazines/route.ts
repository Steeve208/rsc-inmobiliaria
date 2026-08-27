import { NextResponse } from "next/server";
import { requireAdminUserId } from "@/lib/auth/admin";
import {
  deleteMagazine,
  listMagazines,
  saveMagazine,
} from "@/lib/listings/magazine-store";
import type { MagazineInput } from "@/features/revistas/types";

export async function GET() {
  const adminId = await requireAdminUserId();
  if (!adminId) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  return NextResponse.json(await listMagazines({ includeDrafts: true }));
}

export async function POST(request: Request) {
  const adminId = await requireAdminUserId();
  if (!adminId) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const body = (await request.json()) as MagazineInput;
  if (!body.title?.trim() || !body.issueLabel?.trim() || !body.body?.trim()) {
    return NextResponse.json({ error: "invalid_payload" }, { status: 400 });
  }
  if (!body.coverImage?.trim() || !body.excerpt?.trim()) {
    return NextResponse.json({ error: "invalid_payload" }, { status: 400 });
  }

  return NextResponse.json(await saveMagazine(body));
}

export async function DELETE(request: Request) {
  const adminId = await requireAdminUserId();
  if (!adminId) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "invalid_payload" }, { status: 400 });
  }

  await deleteMagazine(id);
  return NextResponse.json({ ok: true });
}
