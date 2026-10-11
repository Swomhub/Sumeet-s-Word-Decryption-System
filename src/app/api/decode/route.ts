import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

// Rate limiting: simple in-memory store
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 20; // requests per minute
const RATE_WINDOW = 60 * 1000; // 1 minute

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_WINDOW });
    return true;
  }

  if (entry.count >= RATE_LIMIT) {
    return false;
  }

  entry.count++;
  return true;
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const ip =
      request.headers.get("x-forwarded-for") ||
      request.headers.get("x-real-ip") ||
      "anonymous";
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: "Too many requests. Please wait a moment and try again." },
        { status: 429 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { text, sourceLang, targetLang, mode } = body;

    // Input validation
    if (!text || typeof text !== "string") {
      return NextResponse.json(
        { error: "Please enter some text to decode." },
        { status: 400 }
      );
    }

    if (text.trim().length === 0) {
      return NextResponse.json(
        { error: "Please enter some text to decode." },
        { status: 400 }
      );
    }

    if (text.length > 500) {
      return NextResponse.json(
        { error: "Text is too long. Please keep it under 500 characters." },
        { status: 400 }
      );
    }

    // Check for API key
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        {
          error:
            "Gemini API key is not configured. Please add GEMINI_API_KEY to your environment variables.",
        },
        { status: 500 }
      );
    }

    // Initialize Gemini
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-3.8-flash" });

    // Build the prompt
    const prompt = buildPrompt(text, sourceLang, targetLang, mode);

    // Call Gemini API
    const result = await model.generateContent(prompt);
    const response = result.response;
    const responseText = response.text();

    // Parse the structured response
    const parsed = parseGeminiResponse(responseText);

    return NextResponse.json(parsed);
  } catch (error: unknown) {
    console.error("Decode error:", error);

    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";

    if (errorMessage.includes("API_KEY_INVALID") || errorMessage.includes("API key")) {
      return NextResponse.json(
        { error: "Invalid API key. Please check your GEMINI_API_KEY." },
        { status: 401 }
      );
    }

    if (errorMessage.includes("QUOTA") || errorMessage.includes("quota")) {
      return NextResponse.json(
        { error: "API quota exceeded. Please try again later." },
        { status: 429 }
      );
    }

    return NextResponse.json(
      {
        error:
          "Something went wrong while decoding. Please try again in a moment.",
      },
      { status: 500 }
    );
  }
}

function buildPrompt(
  text: string,
  sourceLang: string,
  targetLang: string,
  mode: string
): string {
  const sourceDesc =
    sourceLang === "auto"
      ? "Auto-detect the language (could be English, Hindi, Marathi, Hinglish, Hindi written in English letters/Romanized Hindi, or Marathi written in English letters/Romanized Marathi)"
      : sourceLang;

  const targetDesc = targetLang || "English";

  let modeInstruction = "";
  switch (mode) {
    case "meaning":
      modeInstruction =
        "Focus on explaining the meaning, context, and usage of the phrase.";
      break;
    case "translate":
      modeInstruction = `Focus on providing an accurate translation to ${targetDesc}.`;
      break;
    case "transliterate":
      modeInstruction =
        "Focus on providing the transliteration (how it sounds when written in the target script).";
      break;
    default:
      modeInstruction =
        "Provide a comprehensive decoding: meaning, translation, and cultural context.";
  }

  return `You are Sumeet's Word Decryption System — an expert multilingual decoder specializing in English, Hindi, Marathi, Hinglish, Romanized Hindi (Hindi written using English letters), and Romanized Marathi (Marathi written using English letters).

A user wants to decode/understand the following text:

INPUT TEXT: "${text}"
SOURCE LANGUAGE: ${sourceDesc}
TARGET LANGUAGE: ${targetDesc}
MODE: ${modeInstruction}

Please respond in EXACTLY this JSON format (no markdown, no code fences, just pure JSON):
{
  "detectedLanguage": "the language you detected the input is in",
  "coreMeaning": "a clear, concise explanation of what this phrase means in everyday language",
  "translation": "direct translation into ${targetDesc}",
  "transliteration": "how the original text sounds when written in ${targetDesc} script (if applicable, otherwise same as translation)",
  "context": "cultural or situational context — when and how this phrase is typically used",
  "alternatives": "alternative interpretations or similar phrases (if any, otherwise empty string)",
  "tone": "the tone/mood of the phrase (casual, formal, friendly, humorous, etc.)"
}

Important rules:
- Be accurate and culturally aware
- For Romanized Hindi/Marathi (like "kay kartoy bhava", "mala ghari jaychay"), recognize these as Hindi/Marathi written in English letters
- Explain slang and colloquial usage clearly
- Keep explanations concise but informative
- Return ONLY valid JSON, no other text`;
}

function parseGeminiResponse(text: string): {
  detectedLanguage: string;
  coreMeaning: string;
  translation: string;
  transliteration: string;
  context: string;
  alternatives: string;
  tone: string;
} {
  try {
    // Try to extract JSON from the response
    let jsonStr = text.trim();

    // Remove markdown code fences if present
    if (jsonStr.startsWith("```")) {
      jsonStr = jsonStr.replace(/^```(?:json)?\s*\n?/, "").replace(/\n?```\s*$/, "");
    }

    const parsed = JSON.parse(jsonStr);
    return {
      detectedLanguage: parsed.detectedLanguage || "Unknown",
      coreMeaning: parsed.coreMeaning || "Could not determine meaning.",
      translation: parsed.translation || "",
      transliteration: parsed.transliteration || "",
      context: parsed.context || "",
      alternatives: parsed.alternatives || "",
      tone: parsed.tone || "",
    };
  } catch {
    // If JSON parsing fails, return the raw text as the meaning
    return {
      detectedLanguage: "Unknown",
      coreMeaning: text,
      translation: "",
      transliteration: "",
      context: "",
      alternatives: "",
      tone: "",
    };
  }
}
