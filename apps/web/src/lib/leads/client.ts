"use client";

import type {
  ChatThread,
  CompanyLeadConfig,
  CreateVisitInput,
  OpenChatInput,
  ScheduledVisit,
  SendChatMessageInput,
} from "./types";

export { useBuyerIdentity, getBuyerName, setBuyerName } from "@/hooks/use-buyer-identity";

async function parseJson<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: "Request failed" }));
    throw new Error(error.error ?? "Request failed");
  }
  return response.json() as Promise<T>;
}

export async function fetchCompanyConfig(companyId: string) {
  const params = new URLSearchParams({ companyId });
  return parseJson<CompanyLeadConfig>(
    await fetch(`/api/leads/company-config?${params.toString()}`),
  );
}

export async function saveCompanyConfig(config: CompanyLeadConfig) {
  return parseJson<CompanyLeadConfig>(
    await fetch("/api/leads/company-config", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(config),
    }),
  );
}

export async function createScheduledVisit(input: CreateVisitInput) {
  return parseJson<ScheduledVisit>(
    await fetch("/api/leads/visits", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    }),
  );
}

export async function fetchBuyerVisits(buyerId: string) {
  const params = new URLSearchParams({ buyerId });
  return parseJson<ScheduledVisit[]>(
    await fetch(`/api/leads/visits?${params.toString()}`),
  );
}

export async function fetchCompanyVisits(companyId: string) {
  const params = new URLSearchParams({ companyId });
  return parseJson<ScheduledVisit[]>(
    await fetch(`/api/leads/visits?${params.toString()}`),
  );
}

export async function openChat(input: OpenChatInput) {
  return parseJson<ChatThread>(
    await fetch("/api/leads/chats", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    }),
  );
}

export async function sendChatMessage(input: SendChatMessageInput) {
  return parseJson<ChatThread>(
    await fetch("/api/leads/chats", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    }),
  );
}

export async function fetchBuyerChats(buyerId: string) {
  const params = new URLSearchParams({ buyerId });
  return parseJson<ChatThread[]>(
    await fetch(`/api/leads/chats?${params.toString()}`),
  );
}

export async function fetchCompanyChats(companyId: string) {
  const params = new URLSearchParams({ companyId });
  return parseJson<ChatThread[]>(
    await fetch(`/api/leads/chats?${params.toString()}`),
  );
}

export async function fetchChatThread(threadId: string) {
  const params = new URLSearchParams({ threadId });
  return parseJson<ChatThread>(
    await fetch(`/api/leads/chats?${params.toString()}`),
  );
}
