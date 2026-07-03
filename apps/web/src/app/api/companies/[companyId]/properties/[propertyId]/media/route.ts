import { NextResponse } from "next/server";
import {
  addPropertyImage,
  getCompanyProperty,
  removePropertyImage,
  setPropertyVideo,
} from "@/lib/listings/property-writes";
import { uploadListingMedia, toVideoEmbedUrl } from "@/lib/storage/listing-media";

type RouteParams = {
  params: Promise<{ companyId: string; propertyId: string }>;
};

export async function POST(request: Request, { params }: RouteParams) {
  const { companyId, propertyId } = await params;

  const property = await getCompanyProperty(companyId, propertyId);
  if (!property) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  const contentType = request.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    let json: { videoUrl?: string };
    try {
      json = await request.json();
    } catch {
      return NextResponse.json({ error: "invalid_json" }, { status: 400 });
    }

    if (!json.videoUrl?.trim()) {
      return NextResponse.json({ error: "video_url_required" }, { status: 400 });
    }

    const videoUrl = toVideoEmbedUrl(json.videoUrl);
    await setPropertyVideo(companyId, propertyId, videoUrl);
    return NextResponse.json({ videoUrl });
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: "invalid_form" }, { status: 400 });
  }

  const kind = formData.get("kind");
  const file = formData.get("file");

  if (kind !== "image" && kind !== "video") {
    return NextResponse.json({ error: "invalid_kind" }, { status: 400 });
  }
  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ error: "file_required" }, { status: 400 });
  }

  try {
    const url = await uploadListingMedia({
      companyId,
      listingId: propertyId,
      kind,
      file,
    });

    if (kind === "image") {
      const image = await addPropertyImage(companyId, propertyId, url);
      return NextResponse.json({ kind: "image", ...image }, { status: 201 });
    }

    await setPropertyVideo(companyId, propertyId, url);
    return NextResponse.json({ kind: "video", videoUrl: url }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "upload_failed";
    if (message.startsWith("unsupported_type")) {
      return NextResponse.json({ error: "unsupported_type" }, { status: 400 });
    }
    if (message === "file_too_large") {
      return NextResponse.json({ error: "file_too_large" }, { status: 400 });
    }
    return NextResponse.json({ error: "upload_failed", detail: message }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: RouteParams) {
  const { companyId, propertyId } = await params;
  const imageId = new URL(request.url).searchParams.get("imageId");

  if (!imageId) {
    return NextResponse.json({ error: "image_id_required" }, { status: 400 });
  }

  const removed = await removePropertyImage(companyId, propertyId, imageId);
  if (!removed) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
