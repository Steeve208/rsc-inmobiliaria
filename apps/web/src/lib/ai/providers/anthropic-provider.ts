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

async function chat(system: string, user: string) {
  const apiKey = process.env.ANTHROPIC_API_KEY?.trim();
  if (!apiKey) throw new Error("missing_key");
  const model = process.env.ANTHROPIC_MODEL?.trim() || "claude-3-5-haiku-latest";

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model,
      max_tokens: 800,
      system,
      messages: [{ role: "user", content: user }],
    }),
    signal: AbortSignal.timeout(12_000),
  });
  if (!response.ok) throw new Error("provider_error");
  const data = (await response.json()) as {
    content?: Array<{ type?: string; text?: string }>;
  };
  return data.content?.filter((part) => part.type === "text").map((part) => part.text ?? "").join("") ?? "";
}

export const anthropicProvider: AIProvider = {
  name: "anthropic",
  async extractIntent(input: ExtractIntentInput) {
    const text = await chat(EXTRACT_INTENT_SYSTEM, extractIntentUserPrompt(input));
    const parsed = partialRequirementsSchema.safeParse(extractJson(text));
    return parsed.success ? parsed.data : ruleBasedProvider.extractIntent(input);
  },
  async askMissingRequirement(input) {
    return (await chat(GROUNDED_RULES, JSON.stringify(input))) || input.question.question;
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
    return (await chat(GROUNDED_RULES, JSON.stringify(input.items.map((item) => ({
      title: item.facts.title,
      score: item.totalScore,
    }))))) || ruleBasedProvider.generateComparison(input);
  },
};
