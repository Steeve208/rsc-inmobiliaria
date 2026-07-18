import { NextResponse } from "next/server";
import {
  addPropertyImage,
  clearPropertyFloorPlan,
  getCompanyProperty,
  removePropertyImage,
  setPropertyFloorPlan,
  setPropertyVideo,
  setPropertyVirtualTour,
} from "@/lib/listings/property-writes";
import { uploadListingMedia } from "@/lib/storage/listing-media";
import { toVideoEmbedUrl } from "@/lib/storage/listing-media-utils";
import { requireCompanyAccess } from "@/lib/auth/authorize";

type RouteParams = {
  params: Promise<{ companyId: string; propertyId: string }>;
};

export async function POST(request: Request, { params }: RouteParams) {
  const { companyId, propertyId } = await params;

  const access = await requireCompanyAccess(companyId);
  if (!access.ok) return access.response;

  const property = await getCompanyProperty(companyId, propertyId);
  if (!property) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  const contentType = request.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    let json: { videoUrl?: string; virtualTourUrl?: string };
    try {
      json = await request.json();
    } catch {
      return NextResponse.json({ error: "invalid_json" }, { status: 400 });
    }

    if (json.virtualTourUrl?.trim()) {
      const virtualTourUrl = json.virtualTourUrl.trim();
      await setPropertyVirtualTour(companyId, propertyId, virtualTourUrl);
      return NextResponse.json({ virtualTourUrl });
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

  if (kind !== "image" && kind !== "video" && kind !== "floorPlan") {
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

    if (kind === "floorPlan") {
      await setPropertyFloorPlan(companyId, propertyId, url);
      return NextResponse.json({ kind: "floorPlan", floorPlanUrl: url }, { status: 201 });
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
    if (message === "storage_not_configured") {
      return NextResponse.json({ error: "storage_not_configured" }, { status: 503 });
    }
    return NextResponse.json({ error: "upload_failed", detail: message }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: RouteParams) {
  const { companyId, propertyId } = await params;

  const access = await requireCompanyAccess(companyId);
  if (!access.ok) return access.response;

  const { searchParams } = new URL(request.url);
  const imageId = searchParams.get("imageId");
  const removeFloorPlan = searchParams.get("floorPlan") === "1";

  if (removeFloorPlan) {
    const property = await getCompanyProperty(companyId, propertyId);
    if (!property) {
      return NextResponse.json({ error: "not_found" }, { status: 404 });
    }

    await clearPropertyFloorPlan(companyId, propertyId);
    return NextResponse.json({ ok: true });
  }

  if (!imageId) {
    return NextResponse.json({ error: "image_id_required" }, { status: 400 });
  }

  const removed = await removePropertyImage(companyId, propertyId, imageId);
  if (!removed) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
