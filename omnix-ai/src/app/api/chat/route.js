import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();
    const { message } = body;

    if (!message) {
      return NextResponse.json(
        { error: "Message required" },
        { status: 400 }
      );
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    const model = genAI.getGenerativeModel({
      model: "gemini-3-flash-preview",
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

    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [{ text: message }],
        },
      ],
    });

    const responseText = result.response.text();

    return NextResponse.json(
      { content: responseText },
      { status: 200 }
    );

  } catch (error) {
    console.error("FULL ERROR:", error);

    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}