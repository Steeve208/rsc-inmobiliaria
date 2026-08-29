import type { FollowUpQuestion, MatchBreakdown, SearchRequirements } from "@/lib/match/types";

export type ChatTurn = {
  role: "user" | "assistant";
  content: string;
};

export type PropertyFacts = {
  title: string;
  price: number;
  currency: string;
  city: string;
  neighborhood: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  type: string;
  garage: number;
  pool: boolean;
  condoFee?: number;
  iptu?: number;
  description?: string;
  transaction?: string;
};

export type ExtractIntentInput = {
  messages: ChatTurn[];
  current: SearchRequirements;
  locale: string;
};

export type ExplainMatchInput = {
  breakdown: MatchBreakdown;
  facts: PropertyFacts;
  insightFallback: string;
  locale: string;
};

export type PropertyQuestionInput = {
  question: string;
  facts: PropertyFacts;
  breakdown?: MatchBreakdown | null;
  requirements?: SearchRequirements;
  locale: string;
};

export type CompareInput = {
  items: Array<{
    facts: PropertyFacts;
    totalScore: number;
    breakdown: MatchBreakdown;
  }>;
  requirements: SearchRequirements;
  locale: string;
};

export type AIProviderName = "gemini" | "openai" | "anthropic" | "rule_based";

export type AIProvider = {
  name: AIProviderName;
  extractIntent(input: ExtractIntentInput): Promise<Partial<SearchRequirements>>;
  askMissingRequirement(input: {
    requirements: SearchRequirements;
    question: FollowUpQuestion;
    locale: string;
  }): Promise<string>;
  explainMatch(input: ExplainMatchInput): Promise<string>;
  answerPropertyQuestion(input: PropertyQuestionInput): Promise<string>;
  generateComparison(input: CompareInput): Promise<string>;
};

export type AIUsageMeta = {
  provider: string;
  model?: string;
  inputTokens?: number;
  outputTokens?: number;
};
