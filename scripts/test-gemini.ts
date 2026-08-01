import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;
const model = process.env.GEMINI_MODEL || "gemini-flash-latest";

if (!apiKey) {
  console.error("✗ GEMINI_API_KEY is not set in .env — nothing to test.");
  process.exit(1);
}

console.log(`Testing Gemini API with model "${model}"...`);

const ai = new GoogleGenAI({ apiKey });

try {
  const response = await ai.models.generateContent({
    model,
    contents: "Reply with the single word: OK",
  });

  const text = (response.text || "").trim();
  if (!text) {
    console.error("✗ Gemini API responded but returned no text.");
    process.exit(1);
  }

  console.log(`✓ Gemini API call succeeded. Response: "${text}"`);
  process.exit(0);
} catch (err: any) {
  console.error("✗ Gemini API call failed:", err.message || err);
  process.exit(1);
}
