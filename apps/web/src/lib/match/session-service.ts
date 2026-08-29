import { NextResponse } from "next/server";
import { AIService } from "@/lib/ai/ai-service";
import { listProperties, listPropertiesByIds } from "@/lib/listings/property-repository";
import { buildInsight, rankMatches } from "./engine";
import {
  canAccessConversation,
  resolveMarketFromCookies,
  resolveMatchActor,
  type MatchActor,
} from "./identity";
import {
  detectMissingFields,
  followUpForField,
  isReadyToMatch,
} from "./missing";
import { toMatchPropertyCard, toPropertyFacts } from "./property-map";
import {
  addMessage,
  createConversation,
  getConversation,
  getMatchScore,
  getScoringWeights,
  listMatchScores,
  recordPropertyEvent,
  replaceMatchScores,
  updateProfileRequirements,
} from "./repository";
import { emptyRequirements } from "./schemas";
import type {
  FollowUpQuestion,
  MatchExplainDto,
  MatchMessage,
  MatchResultCard,
  MatchSessionDto,
  SearchRequirements,
} from "./types";
import {
  applyOptionAnswer,
  applyPurposeHint,
  mergeRequirements,
  validateAndNormalizeRequirements,
} from "./validate";

function understoodCopy(requirements: SearchRequirements, locale: string) {
  const bits: string[] = [];
  if (requirements.purpose === "buy") bits.push(locale.startsWith("pt") ? "comprar" : locale.startsWith("es") ? "comprar" : "buy");
  if (requirements.purpose === "rent") bits.push(locale.startsWith("pt") ? "alugar" : "rent");
  if (requirements.purpose === "invest") bits.push(locale.startsWith("pt") ? "investir" : "invest");
  if (requirements.propertyType) bits.push(requirements.propertyType);
  if (requirements.location?.city) bits.push(requirements.location.city);
  if (requirements.bedrooms?.min != null) bits.push(`${requirements.bedrooms.min}+ bedrooms`);
  if (requirements.budget?.max != null) {
    bits.push(`up to ${requirements.budget.currency} ${requirements.budget.max.toLocaleString()}`);
  }
  if (bits.length === 0) {
    return locale.startsWith("pt")
      ? "Certo. Vamos completar o que falta para encontrar o que cabe em você."
      : locale.startsWith("es")
        ? "Entendido. Completemos lo que falta para encontrar lo que encaja."
        : "Got it. Let’s complete the few details that still matter.";
  }
  return locale.startsWith("pt")
    ? `Entendi. Você quer ${bits.join(", ")}.`
    : locale.startsWith("es")
      ? `Entendido. Buscas ${bits.join(", ")}.`
      : `Got it. You want ${bits.join(", ")}.`;
}

function toSessionDto(input: {
  sessionId: string;
  status: string;
  locale: string;
  requirements: SearchRequirements;
  messages: MatchMessage[];
  resultCount: number | null;
}): MatchSessionDto {
  const missing = detectMissingFields(input.requirements);
  const followUp = missing[0] ? followUpForField(missing[0], input.locale) : null;
  return {
    sessionId: input.sessionId,
    status: (input.status as MatchSessionDto["status"]) ?? "gathering",
    locale: input.locale,
    requirements: input.requirements,
    missing,
    followUp,
    messages: input.messages,
    resultCount: input.resultCount,
    readyToMatch: isReadyToMatch(input.requirements),
  };
}

async function mapMessages(
  rows: Array<{ id: string; role: string; content: string; createdAt: Date }>,
): Promise<MatchMessage[]> {
  return rows
    .filter((row) => row.role === "user" || row.role === "assistant")
    .map((row) => ({
      id: row.id,
      role: row.role as "user" | "assistant",
      content: row.content,
      createdAt: row.createdAt.toISOString(),
    }));
}

async function maybeAsk(input: {
  conversationId: string;
  requirements: SearchRequirements;
  locale: string;
}): Promise<FollowUpQuestion | null> {
  if (isReadyToMatch(input.requirements)) return null;
  const missing = detectMissingFields(input.requirements);
  const field = missing[0];
  if (!field) return null;
  const question = followUpForField(field, input.locale);
  const text = await AIService.askMissingRequirement({
    requirements: input.requirements,
    question,
    locale: input.locale,
    conversationId: input.conversationId,
  });
  await addMessage({
    conversationId: input.conversationId,
    role: "assistant",
    content: `${understoodCopy(input.requirements, input.locale)} ${text}`,
    metadata: { field: question.field, options: question.options },
  });
  return question;
}

export async function runMatching(input: {
  conversationId: string;
  profileId: string;
  requirements: SearchRequirements;
}) {
  const [listings, weights] = await Promise.all([listProperties(), getScoringWeights()]);
  const matches = rankMatches(listings, input.requirements, weights);
  await replaceMatchScores({
    conversationId: input.conversationId,
    profileId: input.profileId,
    matches,
  });
  await updateProfileRequirements({
    profileId: input.profileId,
    conversationId: input.conversationId,
    requirements: input.requirements,
    status: "active",
    conversationStatus: "matching",
  });
  return matches.length;
}

type ConversationPayload = NonNullable<Awaited<ReturnType<typeof getConversation>>>;
type LoadedSession = ConversationPayload & {
  profile: NonNullable<ConversationPayload["profile"]>;
};

type AccessError = "not_found" | "forbidden";
type AccessResult =
  | { ok: true; loaded: LoadedSession }
  | { ok: false; error: AccessError };

export type MatchSessionResult =
  | { ok: true; session: MatchSessionDto }
  | { ok: false; error: AccessError };

async function loadSessionOrNull(
  sessionId: string,
  actor: MatchActor,
): Promise<AccessResult> {
  const loaded = await getConversation(sessionId);
  if (!loaded?.conversation || !loaded.profile) {
    return { ok: false, error: "not_found" };
  }
  if (!canAccessConversation(actor, loaded.conversation)) {
    return { ok: false, error: "forbidden" };
  }
  return { ok: true, loaded: loaded as LoadedSession };
}

export async function createMatchSession(input: {
  message: string;
  purposeHint?: SearchRequirements["purpose"];
  locale?: string;
  source?: string;
  hints?: Partial<SearchRequirements> & {
    city?: string;
    state?: string;
    neighborhood?: string;
    country?: string;
    locationLabel?: string;
    lat?: number;
    lng?: number;
    priceMin?: number;
    priceMax?: number;
    propertyType?: SearchRequirements["propertyType"];
  };
}) {
  const [actor, market] = await Promise.all([
    resolveMatchActor({ issueGuest: true }),
    resolveMarketFromCookies(),
  ]);
  const locale = input.locale ?? "en";

  const extracted = await AIService.extractIntent({
    messages: [{ role: "user", content: input.message }],
    current: emptyRequirements(),
    locale,
  });

  const fromHints: Partial<SearchRequirements> = {};
  if (input.hints?.propertyType) fromHints.propertyType = input.hints.propertyType;
  if (
    input.hints?.city ||
    input.hints?.state ||
    input.hints?.neighborhood ||
    input.hints?.locationLabel
  ) {
    fromHints.location = {
      city: input.hints.city,
      state: input.hints.state,
      neighborhood: input.hints.neighborhood,
      country: input.hints.country,
      label: input.hints.locationLabel,
      lat: input.hints.lat ?? null,
      lng: input.hints.lng ?? null,
    };
  }
  if (input.hints?.priceMax != null || input.hints?.priceMin != null) {
    fromHints.budget = {
      min: input.hints.priceMin,
      max: input.hints.priceMax,
      currency: market.currency.code,
    };
  }

  let requirements = await validateAndNormalizeRequirements(
    applyPurposeHint(
      mergeRequirements(
        mergeRequirements(emptyRequirements(), extracted),
        fromHints,
      ),
      input.purposeHint,
    ),
    { market, geocode: true },
  );
  requirements = { ...requirements, rawIntent: input.message };

  const { conversationId, profileId } = await createConversation({
    userId: actor.userId,
    guestId: actor.guestId,
    locale,
    source: input.source ?? "hero",
    requirements,
    rawIntent: input.message,
  });

  await addMessage({
    conversationId,
    role: "user",
    content: input.message,
  });

  let resultCount: number | null = null;
  if (isReadyToMatch(requirements)) {
    resultCount = await runMatching({ conversationId, profileId, requirements });
    await addMessage({
      conversationId,
      role: "assistant",
      content: understoodCopy(requirements, locale),
    });
  } else {
    await maybeAsk({ conversationId, requirements, locale });
  }

  return getMatchSession(conversationId, actor, resultCount);
}

export async function getMatchSession(
  sessionId: string,
  actor?: MatchActor,
  knownCount?: number | null,
): Promise<MatchSessionResult> {
  const resolved = actor ?? (await resolveMatchActor());
  const access = await loadSessionOrNull(sessionId, resolved);
  if (!access.ok) return access;
  const { conversation, profile, messages } = access.loaded;
  const requirements = (profile?.requirements ?? emptyRequirements()) as SearchRequirements;
  const resultCount =
    knownCount === undefined ? (await listMatchScores(sessionId)).length : knownCount;
  return {
    ok: true,
    session: toSessionDto({
      sessionId,
      status: conversation.status,
      locale: conversation.locale,
      requirements,
      messages: await mapMessages(messages),
      resultCount,
    }),
  };
}

export async function addSessionMessage(input: {
  sessionId: string;
  message: string;
  optionId?: string;
}): Promise<MatchSessionResult> {
  const actor = await resolveMatchActor();
  const access = await loadSessionOrNull(input.sessionId, actor);
  if (!access.ok) return access;
  const { conversation, profile, messages } = access.loaded;

  const locale = conversation.locale;
  const market = await resolveMarketFromCookies();
  let current = profile.requirements as SearchRequirements;

  const lastAssistant = [...messages].reverse().find((row) => row.role === "assistant");
  const lastField = (lastAssistant?.metadata as { field?: string } | null)?.field;

  if (input.optionId && lastField) {
    current = applyOptionAnswer(current, lastField, input.optionId);
  }

  await addMessage({
    conversationId: input.sessionId,
    role: "user",
    content: input.message,
  });

  const history = [
    ...messages.map((row) => ({
      role: row.role as "user" | "assistant",
      content: row.content,
    })),
    { role: "user" as const, content: input.message },
  ].filter((row) => row.role === "user" || row.role === "assistant");

  const extracted = await AIService.extractIntent({
    messages: history,
    current,
    locale,
    conversationId: input.sessionId,
  });

  current = await validateAndNormalizeRequirements(mergeRequirements(current, extracted), {
    market,
    geocode: true,
  });

  await updateProfileRequirements({
    profileId: profile.id,
    conversationId: input.sessionId,
    requirements: current,
  });

  let resultCount: number | null = null;
  if (isReadyToMatch(current)) {
    resultCount = await runMatching({
      conversationId: input.sessionId,
      profileId: profile.id,
      requirements: current,
    });
    await addMessage({
      conversationId: input.sessionId,
      role: "assistant",
      content: understoodCopy(current, locale),
    });
  } else {
    await maybeAsk({ conversationId: input.sessionId, requirements: current, locale });
  }

  return getMatchSession(input.sessionId, actor, resultCount);
}

export async function patchSessionRequirements(input: {
  sessionId: string;
  patch: Partial<SearchRequirements>;
}): Promise<MatchSessionResult> {
  const actor = await resolveMatchActor();
  const access = await loadSessionOrNull(input.sessionId, actor);
  if (!access.ok) return access;
  const { profile } = access.loaded;
  if (!profile) return { ok: false, error: "not_found" };
  const market = await resolveMarketFromCookies();
  const current = await validateAndNormalizeRequirements(
    mergeRequirements(profile.requirements as SearchRequirements, input.patch),
    { market, geocode: true },
  );
  await updateProfileRequirements({
    profileId: profile.id,
    conversationId: input.sessionId,
    requirements: current,
  });
  let resultCount: number | null = null;
  if (isReadyToMatch(current)) {
    resultCount = await runMatching({
      conversationId: input.sessionId,
      profileId: profile.id,
      requirements: current,
    });
  }
  return getMatchSession(input.sessionId, actor, resultCount);
}

export async function runSessionMatching(sessionId: string): Promise<MatchSessionResult> {
  const actor = await resolveMatchActor();
  const access = await loadSessionOrNull(sessionId, actor);
  if (!access.ok) return access;
  const { profile } = access.loaded;
  if (!profile) return { ok: false, error: "not_found" };
  const count = await runMatching({
    conversationId: sessionId,
    profileId: profile.id,
    requirements: profile.requirements as SearchRequirements,
  });
  return getMatchSession(sessionId, actor, count);
}

export async function getSessionResults(sessionId: string): Promise<
  | { ok: false; error: AccessError }
  | { ok: true; results: MatchResultCard[]; requirements: SearchRequirements; count: number }
> {
  const actor = await resolveMatchActor();
  const access = await loadSessionOrNull(sessionId, actor);
  if (!access.ok) return access;
  const scores = await listMatchScores(sessionId);
  const listings = await listPropertiesByIds(scores.map((row) => row.propertyId));
  const byId = new Map(listings.map((item) => [item.id, item]));
  const results: MatchResultCard[] = [];
  for (const row of scores) {
    const property = byId.get(row.propertyId);
    if (!property) continue;
    results.push({
      propertyId: row.propertyId,
      totalScore: row.totalScore,
      opportunityScore: row.opportunityScore,
      breakdown: row.breakdown as MatchResultCard["breakdown"],
      reasons: row.reasons ?? [],
      property: toMatchPropertyCard(property),
    });
  }
  return {
    ok: true,
    results,
    requirements: access.loaded.profile.requirements as SearchRequirements,
    count: results.length,
  };
}

export async function explainPropertyMatch(
  sessionId: string,
  propertyId: string,
): Promise<{ ok: false; error: AccessError } | { ok: true; explain: MatchExplainDto }> {
  const actor = await resolveMatchActor();
  const access = await loadSessionOrNull(sessionId, actor);
  if (!access.ok) return access;
  let score = await getMatchScore(sessionId, propertyId);
  const requirements = access.loaded.profile?.requirements as SearchRequirements;
  const listings = await listPropertiesByIds([propertyId]);
  const property = listings[0];
  if (!property) return { ok: false, error: "not_found" };

  if (!score && access.loaded.profile) {
    const matches = rankMatches([property], requirements, await getScoringWeights());
    const computed = matches[0];
    if (computed) {
      score = {
        id: "ephemeral",
        conversationId: sessionId,
        profileId: access.loaded.profile.id,
        propertyId,
        totalScore: computed.totalScore,
        opportunityScore: null,
        breakdown: computed.breakdown,
        reasons: computed.reasons,
        createdAt: new Date(),
      };
    }
  }
  if (!score) return { ok: false, error: "not_found" };

  const breakdown = score.breakdown as MatchResultCard["breakdown"];
  const insightFallback = buildInsight(breakdown);
  const insight = await AIService.explainMatch({
    breakdown,
    facts: toPropertyFacts(property),
    insightFallback,
    locale: access.loaded.conversation.locale,
    conversationId: sessionId,
  });

  await recordPropertyEvent({
    userId: actor.userId,
    guestId: actor.guestId,
    conversationId: sessionId,
    propertyId,
    eventType: "property_view",
  });

  return {
    ok: true,
    explain: {
      propertyId,
      totalScore: score.totalScore,
      opportunityScore: score.opportunityScore,
      breakdown,
      reasons: score.reasons ?? [],
      insight,
      property: toMatchPropertyCard(property),
      requirements,
    },
  };
}

export async function askAboutProperty(input: {
  sessionId: string;
  propertyId: string;
  question: string;
}): Promise<{ ok: true; answer: string } | { ok: false; error: AccessError }> {
  const explained = await explainPropertyMatch(input.sessionId, input.propertyId);
  if (!explained.ok) return explained;
  const actor = await resolveMatchActor();
  const access = await loadSessionOrNull(input.sessionId, actor);
  if (!access.ok) return access;
  const listings = await listPropertiesByIds([input.propertyId]);
  const property = listings[0];
  if (!property) return { ok: false, error: "not_found" };
  const answer = await AIService.answerPropertyQuestion({
    question: input.question,
    facts: toPropertyFacts(property),
    breakdown: explained.explain.breakdown,
    requirements: explained.explain.requirements,
    locale: access.loaded.conversation.locale,
    conversationId: input.sessionId,
  });
  return { ok: true, answer };
}

export async function compareSessionProperties(input: {
  sessionId: string;
  propertyIds: string[];
}): Promise<
  | { ok: true; items: MatchResultCard[]; narrative: string }
  | { ok: false; error: AccessError | "invalid_request" }
> {
  const results = await getSessionResults(input.sessionId);
  if (!results.ok) return results;
  const selected = results.results.filter((item) =>
    input.propertyIds.includes(item.propertyId),
  );
  if (selected.length < 2) return { ok: false, error: "invalid_request" };

  const actor = await resolveMatchActor();
  const access = await loadSessionOrNull(input.sessionId, actor);
  if (!access.ok) return access;

  const listings = await listPropertiesByIds(input.propertyIds);
  const listingById = new Map(listings.map((item) => [item.id, item]));

  for (const id of input.propertyIds) {
    await recordPropertyEvent({
      userId: actor.userId,
      guestId: actor.guestId,
      conversationId: input.sessionId,
      propertyId: id,
      eventType: "property_compare",
    });
  }

  const narrative = await AIService.generateComparison({
    items: selected.flatMap((item) => {
      const listing = listingById.get(item.propertyId);
      if (!listing) return [];
      return [
        {
          facts: toPropertyFacts(listing),
          totalScore: item.totalScore,
          breakdown: item.breakdown,
        },
      ];
    }),
    requirements: results.requirements,
    locale: access.loaded.conversation.locale,
    conversationId: input.sessionId,
  });

  return { ok: true, items: selected, narrative };
}

export function jsonError(code: string, status: number) {
  return NextResponse.json({ error: code }, { status });
}

export function handleAccessError(error: "not_found" | "forbidden" | "invalid_request") {
  if (error === "forbidden") return jsonError("forbidden", 403);
  if (error === "invalid_request") return jsonError("invalid_request", 400);
  return jsonError("not_found", 404);
}
