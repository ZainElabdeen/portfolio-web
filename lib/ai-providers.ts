import { createOpenAI } from "@ai-sdk/openai";
import { createAnthropic } from "@ai-sdk/anthropic";
import { createGoogleGenerativeAI } from "@ai-sdk/google";

export const AI_PROVIDERS = [
  { label: "OpenAI (GPT-4o)", value: "openai" },
  { label: "Claude (Anthropic)", value: "anthropic" },
  { label: "Gemini (Google)", value: "google" },
] as const;

export type AIProviderKey = (typeof AI_PROVIDERS)[number]["value"];

// OpenRouter model IDs for each provider
// Used when OPENAI_API_KEY is an OpenRouter key (starts with "sk-or-")
const OPENROUTER_MODELS: Record<AIProviderKey, string> = {
  openai: "openai/gpt-4o-mini",          // cheaper than gpt-4o
  anthropic: "anthropic/claude-3-haiku", // cheapest Claude
  google: "google/gemini-2.0-flash-001", // fast & cheap
};

function getOpenRouter(key: string) {
  return createOpenAI({
    apiKey: key,
    baseURL: "https://openrouter.ai/api/v1",
  });
}

export function getAIModel(provider: AIProviderKey) {
  const openaiKey = process.env.OPENAI_API_KEY ?? "";
  const anthropicKey = process.env.ANTHROPIC_API_KEY ?? "";
  const googleKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY ?? "";
  const isOpenRouter = openaiKey.startsWith("sk-or-");

  switch (provider) {
    case "openai": {
      if (openaiKey && !isOpenRouter)
        return createOpenAI({ apiKey: openaiKey })("gpt-4o");
      if (isOpenRouter)
        return getOpenRouter(openaiKey)(OPENROUTER_MODELS.openai);
      throw new Error("OPENAI_API_KEY is not configured.");
    }
    case "anthropic": {
      if (anthropicKey)
        return createAnthropic({ apiKey: anthropicKey })("claude-sonnet-4-20250514");
      if (isOpenRouter)
        return getOpenRouter(openaiKey)(OPENROUTER_MODELS.anthropic);
      throw new Error("ANTHROPIC_API_KEY is not configured.");
    }
    case "google": {
      // Prefer OpenRouter for Gemini (direct free quota exhausts quickly)
      if (isOpenRouter)
        return getOpenRouter(openaiKey)(OPENROUTER_MODELS.google);
      if (googleKey)
        return createGoogleGenerativeAI({ apiKey: googleKey })("gemini-2.0-flash");
      throw new Error("GOOGLE_GENERATIVE_AI_API_KEY is not configured.");
    }
    default:
      throw new Error(`Unknown AI provider: ${provider}`);
  }
}
