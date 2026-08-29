import { and, asc, desc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import {
  aiConversation,
  aiMessage,
  aiUsage,
  matchScoringConfig,
  propertyMatchScore,
  searchPreference,
  searchProfile,
  userPropertyEvent,
  type MatchScoringWeights,
} from "@/lib/db/schema";
import { DEFAULT_MATCH_WEIGHTS, type SearchRequirements } from "./types";
import type { RankedMatch } from "./types";

function newId(prefix: string) {
  return `${prefix}_${crypto.randomUUID()}`;
}

export async function getScoringWeights(): Promise<MatchScoringWeights> {
  try {
    const [row] = await db
      .select()
      .from(matchScoringConfig)
      .where(eq(matchScoringConfig.id, "default"))
      .limit(1);
    if (row?.weights) return row.weights;
  } catch {
    // Table may not exist yet in local/dev.
  }
  return { ...DEFAULT_MATCH_WEIGHTS };
}

export async function createConversation(input: {
  userId: string | null;
  guestId: string | null;
  locale: string;
  source: string;
  requirements: SearchRequirements;
  rawIntent?: string;
}) {
  const conversationId = newId("match");
  const profileId = newId("profile");

  await db.insert(aiConversation).values({
    id: conversationId,
    userId: input.userId,
    guestId: input.guestId,
    locale: input.locale,
    status: "gathering",
    source: input.source,
  });

  await db.insert(searchProfile).values({
    id: profileId,
    conversationId,
    userId: input.userId,
    guestId: input.guestId,
    status: "draft",
    requirements: input.requirements,
    rawIntent: input.rawIntent,
  });

  await replacePreferences(profileId, input.requirements);

  return { conversationId, profileId };
}

export async function getConversation(id: string) {
  const [conversation] = await db
    .select()
    .from(aiConversation)
    .where(eq(aiConversation.id, id))
    .limit(1);
  if (!conversation) return null;

  const [profile] = await db
    .select()
    .from(searchProfile)
    .where(eq(searchProfile.conversationId, id))
    .limit(1);

  const messages = await db
    .select()
    .from(aiMessage)
    .where(eq(aiMessage.conversationId, id))
    .orderBy(asc(aiMessage.createdAt));

  return { conversation, profile, messages };
}

export async function addMessage(input: {
  conversationId: string;
  role: "user" | "assistant" | "system";
  content: string;
  metadata?: Record<string, unknown>;
}) {
  const id = newId("msg");
  await db.insert(aiMessage).values({
    id,
    conversationId: input.conversationId,
    role: input.role,
    content: input.content,
    metadata: input.metadata,
  });
  await db
    .update(aiConversation)
    .set({ updatedAt: new Date() })
    .where(eq(aiConversation.id, input.conversationId));
  return id;
}

export async function updateProfileRequirements(input: {
  profileId: string;
  conversationId: string;
  requirements: SearchRequirements;
  status?: string;
  conversationStatus?: string;
}) {
  await db
    .update(searchProfile)
    .set({
      requirements: input.requirements,
      rawIntent: input.requirements.rawIntent,
      status: input.status,
      updatedAt: new Date(),
    })
    .where(eq(searchProfile.id, input.profileId));

  if (input.conversationStatus) {
    await db
      .update(aiConversation)
      .set({ status: input.conversationStatus, updatedAt: new Date() })
      .where(eq(aiConversation.id, input.conversationId));
  }

  await replacePreferences(input.profileId, input.requirements);
}

async function replacePreferences(profileId: string, requirements: SearchRequirements) {
  await db.delete(searchPreference).where(eq(searchPreference.profileId, profileId));

  const rows = [
    ...requirements.mustHave.map((item) => ({
      id: newId("pref"),
      profileId,
      kind: "must_have",
      type: item.type,
      importance: "high" as const,
      value: item.value != null ? { value: item.value } : null,
    })),
    ...requirements.preferences.map((item) => ({
      id: newId("pref"),
      profileId,
      kind: "preference",
      type: item.type,
      importance: item.importance,
      value: null,
    })),
  ];

  if (rows.length > 0) {
    await db.insert(searchPreference).values(rows);
  }
}

export async function replaceMatchScores(input: {
  conversationId: string;
  profileId: string;
  matches: RankedMatch[];
}) {
  await db
    .delete(propertyMatchScore)
    .where(eq(propertyMatchScore.conversationId, input.conversationId));

  if (input.matches.length === 0) return;

  await db.insert(propertyMatchScore).values(
    input.matches.map((match) => ({
      id: newId("score"),
      conversationId: input.conversationId,
      profileId: input.profileId,
      propertyId: match.propertyId,
      totalScore: match.totalScore,
      opportunityScore: match.opportunityScore,
      breakdown: match.breakdown,
      reasons: match.reasons,
    })),
  );
}

export async function listMatchScores(conversationId: string) {
  return db
    .select()
    .from(propertyMatchScore)
    .where(eq(propertyMatchScore.conversationId, conversationId))
    .orderBy(desc(propertyMatchScore.totalScore));
}

export async function getMatchScore(conversationId: string, propertyId: string) {
  const [row] = await db
    .select()
    .from(propertyMatchScore)
    .where(
      and(
        eq(propertyMatchScore.conversationId, conversationId),
        eq(propertyMatchScore.propertyId, propertyId),
      ),
    )
    .limit(1);
  return row ?? null;
}

export async function recordPropertyEvent(input: {
  userId: string | null;
  guestId: string | null;
  conversationId?: string | null;
  propertyId: string;
  eventType: string;
  metadata?: Record<string, unknown>;
}) {
  await db.insert(userPropertyEvent).values({
    id: newId("evt"),
    userId: input.userId,
    guestId: input.guestId,
    conversationId: input.conversationId ?? null,
    propertyId: input.propertyId,
    eventType: input.eventType,
    metadata: input.metadata,
  });
}

export async function recordAiUsage(input: {
  conversationId?: string | null;
  provider: string;
  model?: string;
  operation: string;
  inputTokens?: number;
  outputTokens?: number;
  latencyMs?: number;
  success: boolean;
}) {
  try {
    await db.insert(aiUsage).values({
      id: newId("usage"),
      conversationId: input.conversationId ?? null,
      provider: input.provider,
      model: input.model,
      operation: input.operation,
      inputTokens: input.inputTokens,
      outputTokens: input.outputTokens,
      latencyMs: input.latencyMs,
      success: input.success,
    });
  } catch {
    // Usage tracking must never break matching.
  }
}
