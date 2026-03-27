import { GoogleGenerativeAI } from "@google/generative-ai";

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

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash-001",
      systemInstruction: {
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
      },
    });

    const result = await model.generateContentStream(message);

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of result.stream) {
            const text = chunk.text();
            if (text) {
              controller.enqueue(encoder.encode(text));
            }
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

  } catch (error) {
    console.error("FULL ERROR:", error);

    const status = error?.status || 500;
    let errMsg = error?.message || "Internal server error";

    if (status === 403) {
      errMsg = "API key rejected. Please rotate your GEMINI_API_KEY.";
    }

    return new Response(JSON.stringify({ error: errMsg }), {
      status,
      headers: { "Content-Type": "application/json" },
    });
  }
}
