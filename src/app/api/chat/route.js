import { GoogleGenerativeAI } from "@google/generative-ai";
import { matchesOmnixCreatorQuestion, OMNIX_CREATOR_REPLY } from "@/lib/omnixCreatorQuestion";

const SYSTEM_INSTRUCTION = {
  parts: [
    {
      text: `
You are **OMNIX** — a capable, clear, and thoughtful AI assistant.

Use the full conversation so far: remember what the user asked earlier, follow up naturally, and avoid repeating the same introduction in every reply.

**How to answer**
- Prefer structured answers: short intro when helpful, then bullets, numbered steps, or small tables for comparisons.
- Use GitHub-flavored Markdown: headings, **bold**, \`inline code\`, fenced code blocks with a language tag, and tables when they clarify things.
- For code: show complete, runnable examples when possible; explain briefly what non-obvious lines do.
- If something is uncertain, say so and offer how to verify.
- Be concise when a one-line answer is enough; go deeper when the user asks for detail.

**Hindi**
- If the user writes in Hindi, reply in Hindi.
- Use **feminine** first-person grammar, e.g. "कर सकती हूँ", "बताती हूँ", "समझाती हूँ", "मदद कर सकती हूँ".
- Do **not** use masculine forms like "कर सकता हूँ", "बताता हूँ".

**Tone**
Warm, professional, and natural — like a smart colleague, not a corporate script.

**Creator**
If anyone asks who made you, who developed or created you or OMNIX, who the creator is, or similar, answer clearly that **Akshay Chaudhari** created OMNIX and built you. Do not name other people or companies as the creator.
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
  const defaults = [
    "gemini-2.5-flash",   // ✅ best balance (recommended)
    "gemini-1.5-flash",   // ✅ stable fallback
    "gemini-2.0-flash"    // ✅ backup
  ];
  const list = fromEnv ? [fromEnv, ...defaults] : defaults;
  return [...new Set(list)];
}

function normalizeMessages(body) {
  let msgs = body.messages;
  if (!Array.isArray(msgs) || msgs.length === 0) {
    if (typeof body.message === "string" && body.message.trim()) {
      msgs = [{ role: "user", content: body.message.trim() }];
    } else {
      return null;
    }
  }

  const out = [];
  for (const m of msgs) {
    const role = m.role === "assistant" ? "assistant" : "user";
    const content = typeof m.content === "string" ? m.content : String(m.content ?? "");
    if (!content.trim() && role === "user") continue;
    out.push({ role, content });
  }
  if (!out.length) return null;
  const last = out[out.length - 1];
  if (last.role !== "user") return null;
  return out;
}

function toGeminiHistory(msgsWithoutLast) {
  return msgsWithoutLast.map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: (m.content ?? "").trim() || " " }],
  }));
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
    const msgs = normalizeMessages(body);

    if (!msgs) {
      return new Response(JSON.stringify({ error: "Message(s) required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      return new Response(JSON.stringify({ error: "AI API key is not configured on the server." }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    const genAI = new GoogleGenerativeAI(key);
    const candidates = modelCandidates();
    let lastError = null;

    const lastUserText = msgs[msgs.length - 1].content;

    if (matchesOmnixCreatorQuestion(lastUserText)) {
      return new Response(JSON.stringify({ content: OMNIX_CREATOR_REPLY }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    const history = toGeminiHistory(msgs.slice(0, -1));

    for (const modelId of candidates) {
      try {
        const model = genAI.getGenerativeModel({
          model: modelId,
          systemInstruction: SYSTEM_INSTRUCTION,
        });
        const chat = model.startChat({ history });
        const result = await chat.sendMessageStream(lastUserText);
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
      errMsg = "API key rejected. Update your server’s AI API key configuration.";
    } else if (status === 429 || isQuotaError(error)) {
      errMsg =
        "The AI service is temporarily busy (rate limit). Wait a moment and try again. If you self-host OMNIX, check your API quota and model settings in your environment.";
    }

    return new Response(JSON.stringify({ error: errMsg }), {
      status: status === 429 ? 429 : status,
      headers: { "Content-Type": "application/json" },
    });
  }
}
