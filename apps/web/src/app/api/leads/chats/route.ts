import { NextResponse } from "next/server";
import {
  getChatThread,
  listChatThreads,
  openChatThread,
  sendChatMessage,
} from "@/lib/leads/store";
import type { OpenChatInput, SendChatMessageInput } from "@/lib/leads/types";
import {
  isInternalMarketRequest,
  requireBuyerAccess,
  requireCompanyAccess,
} from "@/lib/auth/authorize";
import { enforceRateLimit } from "@/lib/security/rate-limit";

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

    if (isInternalMarketRequest(request)) {
      return NextResponse.json(thread);
    }

    const companyAccess = await requireCompanyAccess(thread.companyId);
    if (companyAccess.ok) {
      return NextResponse.json(thread);
    }

    const buyerAccess = await requireBuyerAccess(thread.buyerId);
    if (buyerAccess.ok) {
      return NextResponse.json(thread);
    }

    if (
      companyAccess.response.status === 401 &&
      buyerAccess.response.status === 401
    ) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }

    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  if (companyId) {
    const access = await requireCompanyAccess(companyId);
    if (!access.ok) return access.response;
    return NextResponse.json(await listChatThreads({ companyId }));
  }

  if (buyerId) {
    const access = await requireBuyerAccess(buyerId);
    if (!access.ok) return access.response;
    return NextResponse.json(await listChatThreads({ buyerId }));
  }

  return NextResponse.json({ error: "buyerId or companyId required" }, { status: 400 });
}

export async function POST(request: Request) {
  try {
    const limited = await enforceRateLimit(request, "chats-open", 30, 60_000);
    if (limited) return limited;

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

    const access = await requireBuyerAccess(body.buyerId);
    if (!access.ok) return access.response;

    const thread = await openChatThread({ ...body, buyerId: access.buyerId });
    return NextResponse.json(thread, { status: 201 });
  } catch (error) {
    console.error("[chat] open thread failed", error);
    return NextResponse.json({ error: "CHAT_OPEN_FAILED" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const limited = await enforceRateLimit(request, "chats-message", 60, 60_000);
  if (limited) return limited;

  const body = (await request.json()) as SendChatMessageInput;

  if (!body.threadId || !body.text?.trim() || !body.sender) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  if (isInternalMarketRequest(request) && body.sender === "company") {
    const thread = await sendChatMessage(body);
    if (!thread) {
      return NextResponse.json({ error: "Thread not found" }, { status: 404 });
    }
    return NextResponse.json(thread);
  }

  const existing = await getChatThread(body.threadId);
  if (!existing) {
    return NextResponse.json({ error: "Thread not found" }, { status: 404 });
  }

  if (body.sender === "company") {
    const access = await requireCompanyAccess(existing.companyId);
    if (!access.ok) return access.response;
  } else {
    const access = await requireBuyerAccess(existing.buyerId);
    if (!access.ok) return access.response;
  }

  const thread = await sendChatMessage(body);
  if (!thread) {
    return NextResponse.json({ error: "Thread not found" }, { status: 404 });
  }

  return NextResponse.json(thread);
}
