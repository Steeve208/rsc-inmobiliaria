import { NextResponse } from "next/server";
import { getSimilarVehicles, getVehicleDetail } from "@/lib/listings/vehicle-repository";

type Props = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Props) {
  const { id } = await params;
  const vehicle = await getVehicleDetail(id);

  if (!vehicle) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  const similar = await getSimilarVehicles(id);
  return NextResponse.json({ vehicle, similar });
}
