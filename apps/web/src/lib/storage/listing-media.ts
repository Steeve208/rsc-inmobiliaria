import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { createAdminSupabase, hasSupabaseStorage } from "@/utils/supabase/admin";

const BUCKET = "listing-media";

const IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);
const VIDEO_TYPES = new Set(["video/mp4", "video/webm", "video/quicktime"]);

const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
const MAX_VIDEO_BYTES = 100 * 1024 * 1024;

export type MediaKind = "image" | "video";

function sanitizeFilename(name: string) {
  return name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 120);
}

function extensionFor(mime: string, originalName: string) {
  const fromName = path.extname(originalName);
  if (fromName) return fromName.toLowerCase();

  const map: Record<string, string> = {
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp",
    "image/gif": ".gif",
    "video/mp4": ".mp4",
    "video/webm": ".webm",
    "video/quicktime": ".mov",
  };
  return map[mime] ?? "";
}

function validateFile(file: File, kind: MediaKind) {
  const allowed = kind === "image" ? IMAGE_TYPES : VIDEO_TYPES;
  const max = kind === "image" ? MAX_IMAGE_BYTES : MAX_VIDEO_BYTES;

  if (!allowed.has(file.type)) {
    throw new Error(`unsupported_type:${file.type}`);
  }
  if (file.size > max) {
    throw new Error("file_too_large");
  }
}

async function uploadToSupabase(
  buffer: Buffer,
  storagePath: string,
  contentType: string,
) {
  const supabase = createAdminSupabase();
  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(storagePath, buffer, { contentType, upsert: true });

  if (error) throw new Error(error.message);

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(storagePath);
  return data.publicUrl;
}

async function uploadToLocal(
  buffer: Buffer,
  storagePath: string,
) {
  const absolute = path.join(process.cwd(), "public", storagePath);
  await mkdir(path.dirname(absolute), { recursive: true });
  await writeFile(absolute, buffer);
  return `/${storagePath}`;
}

export async function uploadListingMedia(input: {
  companyId: string;
  listingId: string;
  kind: MediaKind;
  file: File;
}): Promise<string> {
  const { companyId, listingId, kind, file } = input;
  validateFile(file, kind);

  const ext = extensionFor(file.type, file.name);
  const filename = `${kind}_${Date.now().toString(36)}${ext}`;
  const storagePath = `uploads/listings/${companyId}/${listingId}/${filename}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  if (hasSupabaseStorage()) {
    const remotePath = `listings/${companyId}/${listingId}/${filename}`;
    return uploadToSupabase(buffer, remotePath, file.type);
  }

  return uploadToLocal(buffer, storagePath);
}

export function isDirectVideoUrl(url: string) {
  return /\.(mp4|webm|mov)(\?|$)/i.test(url);
}

export function toVideoEmbedUrl(url: string) {
  const trimmed = url.trim();
  if (!trimmed) return "";

  if (isDirectVideoUrl(trimmed)) return trimmed;

  try {
    const parsed = new URL(trimmed);
    if (parsed.hostname.includes("youtube.com")) {
      const id = parsed.searchParams.get("v");
      if (id) return `https://www.youtube.com/embed/${id}`;
    }
    if (parsed.hostname === "youtu.be") {
      const id = parsed.pathname.slice(1);
      if (id) return `https://www.youtube.com/embed/${id}`;
    }
    if (parsed.hostname.includes("vimeo.com")) {
      const id = parsed.pathname.split("/").filter(Boolean).pop();
      if (id) return `https://player.vimeo.com/video/${id}`;
    }
  } catch {
    return trimmed;
  }

  return trimmed;
}
