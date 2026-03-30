import { GoogleGenerativeAI } from "@google/generative-ai";

const SYSTEM_INSTRUCTION = {
  parts: [
    {
      text: `
You are a polite, intelligent, elegant Indian female AI assistant.

Focus ONLY on the user's current message. Do NOT reference or discuss any previous conversation.
Just answer what the user is asking RIGHT NOW with a fresh perspective.

IMPORTANT RULES:
- When speaking in Hindi, ALWAYS use feminine grammar.
- Use words like:
  • "कर सकती हूँ"
  • "बताती हूँ"
  • "समझाती हूँ"
  • "मदद कर सकती हूँ"
- NEVER use masculine forms like:
  • "कर सकता हूँ"
  • "बताता हूँ"

Tone:
- Soft
- Friendly
- Professional
- Natural Indian conversational style

Language Rules:
- If user writes in Hindi → reply in Hindi (feminine form).
- If user writes in English → reply in English.
`,
    },
  ],
};

function isQuotaError(err) {
  const msg = String(err?.message || err || "");
  return (
    err?.status === 429 ||
    msg.includes("429") ||
    msg.includes("quota") ||
    msg.includes("Quota exceeded") ||
    msg.includes("RESOURCE_EXHAUSTED")
  );
}

function modelCandidates() {
  const fromEnv = process.env.GEMINI_MODEL?.trim();
  /* Prefer models that often have separate free-tier quotas; 2.0-flash can show limit: 0 on some projects. */
  const defaults = [
    "gemini-3-flash-preview",
    "gemini-2.5-flash-preview",
    "gemini-2.5-flash",
    "gemini-1.5-flash",
    "gemini-1.5-flash-8b",
    "gemini-2.0-flash",
    "gemini-2.0-flash-001",
  ];
  const list = fromEnv ? [fromEnv, ...defaults] : defaults;
  return [...new Set(list)];
}

function streamResponse(result) {
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of result.stream) {
          const text = chunk.text();
          if (text) controller.enqueue(encoder.encode(text));
        }
      } catch (err) {
        controller.enqueue(encoder.encode(`\n[ERROR]: ${err.message}`));
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache",
    },
  });
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { message } = body;

    if (!message) {
      return new Response(JSON.stringify({ error: "Message required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      return new Response(JSON.stringify({ error: "GEMINI_API_KEY is not set." }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    const genAI = new GoogleGenerativeAI(key);
    const candidates = modelCandidates();
    let lastError = null;

    for (const modelId of candidates) {
      try {
        const model = genAI.getGenerativeModel({
          model: modelId,
          systemInstruction: SYSTEM_INSTRUCTION,
        });
        const result = await model.generateContentStream(message);
        return streamResponse(result);
      } catch (err) {
        lastError = err;
        if (isQuotaError(err) && candidates.indexOf(modelId) < candidates.length - 1) {
          console.warn(`[api/chat] Quota or error on ${modelId}, trying next model…`);
          continue;
        }
        throw err;
      }
    }

    throw lastError || new Error("No model available");
  } catch (error) {
    console.error("FULL ERROR:", error);

    const status = error?.status || 500;
    let errMsg = error?.message || "Internal server error";

    if (status === 403) {
      errMsg = "API key rejected. Please rotate your GEMINI_API_KEY.";
    } else if (status === 429 || isQuotaError(error)) {
      errMsg =
        "Gemini API quota exceeded for the models we tried. Options: wait and retry, enable billing in Google AI Studio, or set GEMINI_MODEL in .env.local to a model your project still has quota for (see https://ai.google.dev/gemini-api/docs/rate-limits ).";
    }

    return new Response(JSON.stringify({ error: errMsg }), {
      status: status === 429 ? 429 : status,
      headers: { "Content-Type": "application/json" },
    });
  }
}
