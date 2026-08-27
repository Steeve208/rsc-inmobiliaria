import { NextResponse } from "next/server";
import {
  getBrokerById,
  listBrokerListings,
} from "@/lib/listings/broker-repository";

type Props = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Props) {
  const { id } = await params;
  const broker = await getBrokerById(id);

  if (!broker) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  const listings = await listBrokerListings(broker);
  return NextResponse.json({ broker, listings });
}
