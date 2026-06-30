import { NextResponse } from "next/server";
import { getPropertyDetail, getSimilarProperties } from "@/lib/listings/property-repository";

type Props = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Props) {
  const { id } = await params;
  const property = await getPropertyDetail(id);

  if (!property) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  const similar = await getSimilarProperties(id);
  return NextResponse.json({ property, similar });
}
