import { replicate } from "@ai-sdk/replicate";
import { convertToCoreMessages, streamText } from "ai";
import { setAIContext } from "@auth0/ai-vercel";

import { evaluateBidsTool } from "@/lib/tools/evaluate-bids";
import { awardContractTool } from "@/lib/tools/award-contract";

export const maxDuration = 60;

const SYSTEM_PROMPT = `
You are the Auth Ecosystem Procurement Agent, powered by IBM Granite 3.1.
You assist users in analyzing complex bids, managing proposals, and securely awarding contracts.
Important: Any request to 'award a contract' requires you to use the awardContractTool, which requires human-in-the-loop approval. Be clear with the user that they will need to approve it on their device via Auth0 CIBA.
When evaluating bids, use the evaluateBidsTool to analyze compliance and technical scores.
`;

export async function POST(req: Request) {
  try {
    let body;
    try {
      body = await req.json();
    } catch {
      return new Response("Invalid JSON in request body", { status: 400 });
    }

    const { messages, id } = body;

    // Validate required fields
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return new Response("Messages array is required and must not be empty", { status: 400 });
    }

    if (!id || typeof id !== "string") {
      return new Response("Thread ID is required and must be a string", { status: 400 });
    }

    // Attach thread context for Auth0 AI handling
    setAIContext({ threadID: id });

    const result = streamText({
      model: replicate.languageModel("ibm-granite/granite-3.1-8b-instruct") as any,
      system: SYSTEM_PROMPT,
      messages: convertToCoreMessages(messages),
      tools: {
        evaluateBidsTool,
        awardContractTool,
      },
    });

    return result.toDataStreamResponse({
      sendReasoning: true,
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return new Response("Internal server error", { status: 500 });
  }
}
