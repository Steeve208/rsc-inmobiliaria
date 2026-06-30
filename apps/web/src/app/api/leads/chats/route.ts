import { NextResponse } from "next/server";
import {
  getChatThread,
  listChatThreads,
  openChatThread,
  sendChatMessage,
} from "@/lib/leads/store";
import type { OpenChatInput, SendChatMessageInput } from "@/lib/leads/types";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const threadId = searchParams.get("threadId") ?? undefined;
  const buyerId = searchParams.get("buyerId") ?? undefined;
  const companyId = searchParams.get("companyId") ?? undefined;

  if (threadId) {
    const thread = await getChatThread(threadId);
    if (!thread) {
      return NextResponse.json({ error: "Thread not found" }, { status: 404 });
    }
    return NextResponse.json(thread);
  }

  if (!buyerId && !companyId) {
    return NextResponse.json({ error: "buyerId or companyId required" }, { status: 400 });
  }

  return NextResponse.json(await listChatThreads({ buyerId, companyId }));
}

export async function POST(request: Request) {
  const body = (await request.json()) as OpenChatInput;

  if (
    !body.listingId ||
    !body.listingTitle ||
    !body.companyId ||
    !body.buyerId ||
    !body.buyerName
  ) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const thread = await openChatThread(body);
  return NextResponse.json(thread, { status: 201 });
}

export async function PATCH(request: Request) {
  const body = (await request.json()) as SendChatMessageInput;

  if (!body.threadId || !body.text?.trim() || !body.sender) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const thread = await sendChatMessage(body);
  if (!thread) {
    return NextResponse.json({ error: "Thread not found" }, { status: 404 });
  }

  return NextResponse.json(thread);
}
