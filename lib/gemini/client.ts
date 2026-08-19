import { GoogleGenerativeAI } from "@google/generative-ai";

export function getGeminiModel() {
  const key = process.env.GEMINI_API_KEY;
  if (!key) return null;
  const genAI = new GoogleGenerativeAI(key);
  const model = process.env.GEMINI_MODEL || "gemini-2.0-flash";
  return genAI.getGenerativeModel({
    model,
    generationConfig: { temperature: 0.3 },
  });
}
