import {
  EXTRACT_INTENT_SYSTEM,
  GROUNDED_RULES,
  extractIntentUserPrompt,
} from "../prompts/extract-intent";
import { ruleBasedProvider } from "./rule-based";
import type { AIProvider, ExtractIntentInput } from "./types";
import { partialRequirementsSchema } from "@/lib/match/schemas";

function extractJson(text: string): unknown {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start < 0 || end <= start) return null;
  try {
    return JSON.parse(text.slice(start, end + 1));
  } catch {
    return null;
  }
}

async function chat(system: string, user: string, json = false) {
  const apiKey = process.env.OPENAI_API_KEY?.trim();
  if (!apiKey) throw new Error("missing_key");
  const model = process.env.OPENAI_MODEL?.trim() || "gpt-4o-mini";

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      temperature: 0.2,
      response_format: json ? { type: "json_object" } : undefined,
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
    }),
    signal: AbortSignal.timeout(12_000),
  });
  if (!response.ok) throw new Error("provider_error");
  const data = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  return data.choices?.[0]?.message?.content?.trim() ?? "";
}

export const openaiProvider: AIProvider = {
  name: "openai",
  async extractIntent(input: ExtractIntentInput) {
    const text = await chat(EXTRACT_INTENT_SYSTEM, extractIntentUserPrompt(input), true);
    const parsed = partialRequirementsSchema.safeParse(extractJson(text));
    return parsed.success ? parsed.data : ruleBasedProvider.extractIntent(input);
  },
  async askMissingRequirement(input) {
    return (
      (await chat(
        `${GROUNDED_RULES} Ask one short question.`,
        JSON.stringify(input),
      )) || input.question.question
    );
  },
  async explainMatch(input) {
    return (await chat(GROUNDED_RULES, JSON.stringify(input))) || input.insightFallback;
  },
  async answerPropertyQuestion(input) {
    return (
      (await chat(GROUNDED_RULES, JSON.stringify(input))) ||
      "I don't have enough information to determine that."
    );
  },
  async generateComparison(input) {
    return (await chat(GROUNDED_RULES, JSON.stringify({
      items: input.items.map((item) => ({
        title: item.facts.title,
        score: item.totalScore,
      })),
    }))) || ruleBasedProvider.generateComparison(input);
  },
};
