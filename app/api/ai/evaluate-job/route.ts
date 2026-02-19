import { generateText } from "ai";
import { getAIModel, type AIProviderKey } from "@/lib/ai-providers";
import { buildSystemPrompt, buildUserPrompt } from "@/lib/ai-prompts";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const jobDescription: string = body.jobDescription ?? body.prompt;
    const provider: string = body.provider;
    const profileData = body.profileData;

    if (!jobDescription || !provider || !profileData) {
      return new Response("Missing required fields", { status: 400 });
    }

    const model = getAIModel(provider as AIProviderKey);

    // Use generateText (not streamText) so errors surface before headers are sent
    const { text } = await generateText({
      model,
      system: buildSystemPrompt(),
      prompt: buildUserPrompt(jobDescription, profileData),
    });

    return new Response(text, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to evaluate job";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
