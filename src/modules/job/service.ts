import { generateCompletion } from "@anvia/core";
import { getModel } from "../../llm/model";
import { AnalysisOutputSchema } from "./schema";

const SYSTEM_INSTRUCTIONS = `
You are an expert Product Analyst. Analyze incoming user feedback considering feedback text, source platform, and user tier.

Classify and provide:
- sentiment: "POSITIVE" | "NEGATIVE" | "NEUTRAL"
- category: "BUG_REPORT" | "FEATURE_REQUEST" | "PRICING" | "OTHER"
- urgencyScore: Integer from 1 (lowest) to 5 (critical blocker/data loss/severe churn risk), factoring in userTier.
- summary: A crisp 1-2 sentence summary of the core issue.
- actionItem: A concrete, actionable next step for the engineering/product team.
`.trim();

export async function generateFeedbackAnalysis({
  feedbackText,
  source,
  userTier,
}: {
  feedbackText: string;
  source?: string;
  userTier?: string;
}) {
  console.log(`Generating feedback analysis...`);
  const PROMPT = `Please analyze the following user feedback:
<feedback_context>
- source platform: ${source ?? "unknown"}
- user tier: ${userTier ?? "free"}
</feedback_context>

<feedback_text>
${feedbackText}
</feedback_text>

Provide your structured analysis according to the instructions.`.trim();

  const response = await generateCompletion({
    model: getModel(),
    prompt: PROMPT,
    instructions: SYSTEM_INSTRUCTIONS,
    outputSchema: AnalysisOutputSchema,
  });

  console.log("Generating done");

  return response.output;
}
