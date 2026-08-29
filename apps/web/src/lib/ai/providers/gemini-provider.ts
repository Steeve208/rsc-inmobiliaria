import {
  EXTRACT_INTENT_SYSTEM,
  GROUNDED_RULES,
  extractIntentUserPrompt,
} from "../prompts/extract-intent";
import { generateJson, generateText } from "./gemini-client";
import { ruleBasedProvider } from "./rule-based";
import type { AIProvider, ExtractIntentInput } from "./types";
import { partialRequirementsSchema } from "@/lib/match/schemas";

function parsePartial(json: unknown) {
  const parsed = partialRequirementsSchema.safeParse(json);
  return parsed.success ? parsed.data : {};
}

export const geminiProvider: AIProvider = {
  name: "gemini",
  async extractIntent(input: ExtractIntentInput) {
    const result = await generateJson({
      system: EXTRACT_INTENT_SYSTEM,
      user: extractIntentUserPrompt(input),
    });
    const parsed = parsePartial(result.json);
    if (Object.keys(parsed).length === 0) {
      return ruleBasedProvider.extractIntent(input);
    }
    return parsed;
  },
  async askMissingRequirement(input) {
    const result = await generateText({
      system: `${GROUNDED_RULES} Ask one short, human question. Do not list filters.`,
      user: JSON.stringify({
        locale: input.locale,
        question: input.question,
        requirements: input.requirements,
      }),
    });
    return result.text || input.question.question;
  },
  async explainMatch(input) {
    const result = await generateText({
      system: `${GROUNDED_RULES} Write 2 sentences of insight using only the scores and facts. Do not change the match percentage.`,
      user: JSON.stringify({
        locale: input.locale,
        fallback: input.insightFallback,
        totalScore: input.breakdown.totalScore,
        dimensions: input.breakdown.dimensions,
        facts: input.facts,
      }),
    });
    return result.text || input.insightFallback;
  },
  async answerPropertyQuestion(input) {
    const result = await generateText({
      system: GROUNDED_RULES,
      user: JSON.stringify({
        locale: input.locale,
        question: input.question,
        facts: input.facts,
        breakdown: input.breakdown,
        requirements: input.requirements,
      }),
    });
    return result.text || "I don't have enough information to determine that.";
  },
  async generateComparison(input) {
    const result = await generateText({
      system: `${GROUNDED_RULES} Compare using match scores and listed facts only. Name the strongest match and why, in 2-3 sentences.`,
      user: JSON.stringify({
        locale: input.locale,
        requirements: input.requirements,
        items: input.items.map((item) => ({
          title: item.facts.title,
          price: item.facts.price,
          score: item.totalScore,
          size: item.facts.area,
          bedrooms: item.facts.bedrooms,
          strongest: item.breakdown.strongest,
        })),
      }),
    });
    return result.text || ruleBasedProvider.generateComparison(input);
  },
};
