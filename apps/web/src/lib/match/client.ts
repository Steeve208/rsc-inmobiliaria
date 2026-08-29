import type {
  MatchExplainDto,
  MatchResultCard,
  MatchSessionDto,
  SearchPurpose,
  SearchRequirements,
} from "@/lib/match/types";

async function parseJson<T>(response: Response): Promise<T> {
  const data = (await response.json().catch(() => ({}))) as T & { error?: string };
  if (!response.ok) {
    throw new Error(data.error ?? "match_failed");
  }
  return data;
}

type CreateMatchSessionInput = {
  message: string;
  purposeHint?: SearchPurpose;
  locale?: string;
  source?: "hero" | "header" | "match";
  hints?: {
    propertyType?: SearchRequirements["propertyType"];
    city?: string;
    state?: string;
    neighborhood?: string;
    country?: string;
    locationLabel?: string;
    lat?: number;
    lng?: number;
    priceMin?: number;
    priceMax?: number;
  };
};

export async function createMatchSession(input: CreateMatchSessionInput) {
  return parseJson<MatchSessionDto>(
    await fetch("/api/match/sessions", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    }),
  );
}

export async function tryCreateMatchSession(input: CreateMatchSessionInput) {
  try {
    return await createMatchSession(input);
  } catch {
    return null;
  }
}

export async function fetchMatchSession(sessionId: string) {
  return parseJson<MatchSessionDto>(
    await fetch(`/api/match/sessions/${sessionId}`, { credentials: "include" }),
  );
}

export async function sendMatchMessage(
  sessionId: string,
  input: { message: string; optionId?: string },
) {
  return parseJson<MatchSessionDto>(
    await fetch(`/api/match/sessions/${sessionId}/messages`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    }),
  );
}

export async function patchMatchRequirements(
  sessionId: string,
  requirements: Partial<SearchRequirements>,
) {
  return parseJson<MatchSessionDto>(
    await fetch(`/api/match/sessions/${sessionId}/requirements`, {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ requirements }),
    }),
  );
}

export async function runMatchSession(sessionId: string) {
  return parseJson<MatchSessionDto>(
    await fetch(`/api/match/sessions/${sessionId}/run`, {
      method: "POST",
      credentials: "include",
    }),
  );
}

export async function fetchMatchResults(sessionId: string) {
  return parseJson<{
    count: number;
    results: MatchResultCard[];
    requirements: SearchRequirements;
  }>(await fetch(`/api/match/sessions/${sessionId}/results`, { credentials: "include" }));
}

export async function fetchMatchExplain(sessionId: string, propertyId: string) {
  return parseJson<MatchExplainDto>(
    await fetch(`/api/match/sessions/${sessionId}/properties/${propertyId}/explain`, {
      credentials: "include",
    }),
  );
}

export async function askMatchProperty(
  sessionId: string,
  propertyId: string,
  question: string,
) {
  return parseJson<{ answer: string }>(
    await fetch(`/api/match/sessions/${sessionId}/properties/${propertyId}/ask`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question }),
    }),
  );
}

export async function compareMatchProperties(sessionId: string, propertyIds: string[]) {
  return parseJson<{ items: MatchResultCard[]; narrative: string }>(
    await fetch(`/api/match/sessions/${sessionId}/compare`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ propertyIds }),
    }),
  );
}

export async function recordMatchEvent(
  sessionId: string,
  propertyId: string,
  eventType: "property_view" | "property_save" | "property_compare" | "property_contact" | "property_hide",
) {
  await fetch(`/api/match/sessions/${sessionId}/events`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ propertyId, eventType }),
  }).catch(() => undefined);
}
