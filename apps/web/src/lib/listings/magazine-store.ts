import { randomUUID } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { desc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { magazine } from "@/lib/db/schema";
import { slugifyCompanyId } from "@/lib/leads/utils";
import {
  MAGAZINE_CATEGORIES,
  type MagazineCategory,
  type MagazineInput,
  type MagazineIssue,
  type MagazineStatus,
} from "@/features/revistas/types";

const FILE_PATH = path.join(process.cwd(), "data", "magazines.json");

function isCategory(value: string | undefined): value is MagazineCategory {
  return (MAGAZINE_CATEGORIES as readonly string[]).includes(value ?? "");
}

function isStatus(value: string | undefined): value is MagazineStatus {
  return value === "draft" || value === "published";
}

function toIsoDate(value: Date | string | null | undefined) {
  if (!value) return new Date().toISOString().slice(0, 10);
  if (typeof value === "string") return value.slice(0, 10);
  return value.toISOString().slice(0, 10);
}

function mapRow(row: typeof magazine.$inferSelect): MagazineIssue {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    issueLabel: row.issueLabel,
    excerpt: row.excerpt,
    body: row.body,
    coverImage: row.coverImage,
    category: isCategory(row.category) ? row.category : "market",
    author: row.author,
    pdfUrl: row.pdfUrl ?? "",
    status: isStatus(row.status) ? row.status : "published",
    publishedAt: toIsoDate(row.publishedAt),
  };
}

export function normalizeMagazine(input: MagazineInput): MagazineIssue {
  const title = input.title.trim();
  const slug =
    input.slug?.trim() ||
    slugifyCompanyId(`${title}-${input.issueLabel || Date.now()}`) ||
    `revista-${Date.now()}`;

  return {
    id: input.id?.trim() || `mag-${randomUUID()}`,
    slug,
    title,
    issueLabel: input.issueLabel.trim(),
    excerpt: input.excerpt.trim(),
    body: input.body.trim(),
    coverImage: input.coverImage.trim(),
    category: isCategory(input.category) ? input.category : "market",
    author: input.author?.trim() || "Reeskova Editorial",
    pdfUrl: input.pdfUrl?.trim() || "",
    status: isStatus(input.status) ? input.status : "published",
    publishedAt: toIsoDate(input.publishedAt),
  };
}

function mergeIssues(lists: MagazineIssue[][]) {
  const merged: MagazineIssue[] = [];
  const seen = new Set<string>();
  const seenSlug = new Set<string>();

  for (const list of lists) {
    for (const item of list) {
      if (seen.has(item.id) || seenSlug.has(item.slug)) continue;
      seen.add(item.id);
      seenSlug.add(item.slug);
      merged.push(item);
    }
  }

  return merged.sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

async function listFromDb(): Promise<MagazineIssue[]> {
  try {
    const rows = await db
      .select()
      .from(magazine)
      .orderBy(desc(magazine.publishedAt));
    return rows.map(mapRow);
  } catch {
    return [];
  }
}

async function readFromFile(): Promise<MagazineIssue[]> {
  try {
    const raw = await readFile(FILE_PATH, "utf8");
    const parsed = JSON.parse(raw) as MagazineIssue[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function writeToFile(items: MagazineIssue[]) {
  await mkdir(path.dirname(FILE_PATH), { recursive: true });
  await writeFile(FILE_PATH, JSON.stringify(items, null, 2), "utf8");
}

async function upsertDb(item: MagazineIssue): Promise<boolean> {
  try {
    await db
      .insert(magazine)
      .values({
        id: item.id,
        slug: item.slug,
        title: item.title,
        issueLabel: item.issueLabel,
        excerpt: item.excerpt,
        body: item.body,
        coverImage: item.coverImage,
        category: item.category,
        author: item.author,
        pdfUrl: item.pdfUrl || null,
        status: item.status,
        publishedAt: new Date(`${item.publishedAt}T12:00:00.000Z`),
      })
      .onConflictDoUpdate({
        target: magazine.id,
        set: {
          slug: item.slug,
          title: item.title,
          issueLabel: item.issueLabel,
          excerpt: item.excerpt,
          body: item.body,
          coverImage: item.coverImage,
          category: item.category,
          author: item.author,
          pdfUrl: item.pdfUrl || null,
          status: item.status,
          publishedAt: new Date(`${item.publishedAt}T12:00:00.000Z`),
        },
      });
    return true;
  } catch {
    return false;
  }
}

export async function listMagazines(options?: { includeDrafts?: boolean }) {
  const merged = mergeIssues([await listFromDb(), await readFromFile()]);
  if (options?.includeDrafts) return merged;
  return merged.filter((item) => item.status === "published");
}

export async function getMagazineBySlug(slug: string) {
  const published = await listMagazines({ includeDrafts: true });
  return published.find((item) => item.slug === slug);
}

export async function saveMagazine(input: MagazineInput) {
  const item = normalizeMagazine(input);
  const savedInDb = await upsertDb(item);
  if (!savedInDb) {
    const current = await readFromFile();
    const next = [item, ...current.filter((row) => row.id !== item.id)];
    await writeToFile(next);
  }
  return item;
}

export async function deleteMagazine(id: string) {
  try {
    await db.delete(magazine).where(eq(magazine.id, id));
  } catch {
    // table may not exist yet
  }
  const current = await readFromFile();
  await writeToFile(current.filter((item) => item.id !== id));
}
