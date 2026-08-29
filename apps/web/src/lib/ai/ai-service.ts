import { anthropicProvider } from "./providers/anthropic-provider";
import { geminiProvider } from "./providers/gemini-provider";
import { openaiProvider } from "./providers/openai-provider";
import { ruleBasedProvider } from "./providers/rule-based";
import type {
  AIProvider,
  AIProviderName,
  CompareInput,
  ExplainMatchInput,
  ExtractIntentInput,
  PropertyQuestionInput,
} from "./providers/types";
import { recordAiUsage } from "@/lib/match/repository";
import type { FollowUpQuestion, SearchRequirements } from "@/lib/match/types";

function configuredProvider(): AIProviderName {
  const raw = process.env.AI_PROVIDER?.trim().toLowerCase();
  if (raw === "openai" || raw === "anthropic" || raw === "gemini" || raw === "rule_based") {
    return raw;
  }
  return "gemini";
}

function getProvider(): AIProvider {
  const name = configuredProvider();
  if (name === "rule_based") return ruleBasedProvider;
  if (name === "openai" && process.env.OPENAI_API_KEY?.trim()) return openaiProvider;
  if (name === "anthropic" && process.env.ANTHROPIC_API_KEY?.trim()) return anthropicProvider;
  if (process.env.GEMINI_API_KEY?.trim()) return geminiProvider;
  if (process.env.OPENAI_API_KEY?.trim()) return openaiProvider;
  if (process.env.ANTHROPIC_API_KEY?.trim()) return anthropicProvider;
  return ruleBasedProvider;
}

async function withFallback<T>(
  operation: string,
  conversationId: string | undefined,
  run: (provider: AIProvider) => Promise<T>,
  fallback: () => Promise<T>,
): Promise<T> {
  const provider = getProvider();
  const started = Date.now();
  try {
    const result = await run(provider);
    await recordAiUsage({
      conversationId,
      provider: provider.name,
      operation,
      latencyMs: Date.now() - started,
      success: true,
    });
    return result;
  } catch {
    await recordAiUsage({
      conversationId,
      provider: provider.name,
      operation,
      latencyMs: Date.now() - started,
      success: false,
    });
    return fallback();
  }
}

export const AIService = {
  extractIntent(input: ExtractIntentInput & { conversationId?: string }) {
    return withFallback(
      "extractIntent",
      input.conversationId,
      (provider) => provider.extractIntent(input),
      () => ruleBasedProvider.extractIntent(input),
    );
  },

  askMissingRequirement(input: {
    requirements: SearchRequirements;
    question: FollowUpQuestion;
    locale: string;
    conversationId?: string;
  }) {
    return withFallback(
      "askMissingRequirement",
      input.conversationId,
      (provider) => provider.askMissingRequirement(input),
      () => ruleBasedProvider.askMissingRequirement(input),
    );
  },

  explainMatch(input: ExplainMatchInput & { conversationId?: string }) {
    return withFallback(
      "explainMatch",
      input.conversationId,
      (provider) => provider.explainMatch(input),
      () => ruleBasedProvider.explainMatch(input),
    );
  },

  answerPropertyQuestion(input: PropertyQuestionInput & { conversationId?: string }) {
    return withFallback(
      "answerPropertyQuestion",
      input.conversationId,
      (provider) => provider.answerPropertyQuestion(input),
      () => ruleBasedProvider.answerPropertyQuestion(input),
    );
  },

  generateComparison(input: CompareInput & { conversationId?: string }) {
    return withFallback(
      "generateComparison",
      input.conversationId,
      (provider) => provider.generateComparison(input),
      () => ruleBasedProvider.generateComparison(input),
    );
  },
};
