import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";

const FILE_PATH = path.join(process.cwd(), "data", "journal-subscribers.json");
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { email?: unknown } | null;
  const email = String(body?.email ?? "").trim().toLowerCase();
  if (!EMAIL.test(email) || email.length > 180) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  await mkdir(path.dirname(FILE_PATH), { recursive: true });
  let current: string[] = [];
  try {
    const parsed = JSON.parse(await readFile(FILE_PATH, "utf8")) as unknown;
    if (Array.isArray(parsed)) {
      current = parsed.filter((item): item is string => typeof item === "string");
    }
  } catch {
    current = [];
  }

  if (!current.includes(email)) {
    current.push(email);
    await writeFile(FILE_PATH, JSON.stringify(current, null, 2), "utf8");
  }

  return NextResponse.json({ ok: true });
}
