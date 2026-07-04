"use client";

import type {
  CreateFinancingRequestInput,
  FinancingRequest,
  FinancingRequestStatus,
  UpdateFinancingRequestStatusInput,
} from "./types";

async function parseJson<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: "Request failed" }));
    throw new Error(error.error ?? "Request failed");
  }
  return response.json() as Promise<T>;
}

export async function createFinancingRequest(input: CreateFinancingRequestInput) {
  return parseJson<FinancingRequest>(
    await fetch("/api/financing/requests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    }),
  );
}

export async function fetchBuyerFinancingRequests(buyerId: string) {
  const params = new URLSearchParams({ buyerId });
  return parseJson<FinancingRequest[]>(
    await fetch(`/api/financing/requests?${params.toString()}`),
  );
}

/** Todas las solicitudes — para el dashboard de operaciones (misma API, otra página). */
export async function fetchFinancingRequest(id: string) {
  return parseJson<FinancingRequest>(
    await fetch(`/api/financing/requests/${id}`),
  );
}

export async function fetchFinancingRequests(filters?: {
  status?: FinancingRequestStatus;
}) {
  const params = new URLSearchParams();
  if (filters?.status) params.set("status", filters.status);
  const query = params.toString();
  return parseJson<FinancingRequest[]>(
    await fetch(`/api/financing/requests${query ? `?${query}` : ""}`),
  );
}

export async function updateFinancingRequestStatus(
  input: UpdateFinancingRequestStatusInput,
) {
  return parseJson<FinancingRequest>(
    await fetch("/api/financing/requests", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    }),
  );
}
