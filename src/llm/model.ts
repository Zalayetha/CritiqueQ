import { OpenAIClient } from "@anvia/openai";
import "dotenv/config";

const apiKey = process.env.OPENAI_API_KEY;
if (!apiKey) {
  throw new Error("Missing OPENAI_API_KEY environment variable");
}

export const client = new OpenAIClient({
  apiKey,
  baseUrl: process.env.OPENAI_BASE_URL,
});

export function getModel(modelId?: string) {
  return client.completionModel({
    modelId: modelId || "gpt-5.6-luna",
  });
}
