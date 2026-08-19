import { getGeminiModel } from "@/lib/gemini/client";
import { CHAT_SYSTEM } from "@/lib/gemini/prompts";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const model = getGeminiModel();
  if (!model) {
    return NextResponse.json(
      { ok: false, message: "GEMINI_API_KEY is not set on the server." },
      { status: 503 },
    );
  }

  const body = (await request.json()) as {
    message?: string;
    analysisSummary?: string;
    history?: Array<{ role: "user" | "assistant"; content: string }>;
  };

  if (!body.message?.trim()) {
    return NextResponse.json({ ok: false, message: "Type a question first." }, { status: 400 });
  }

  const historyText = (body.history ?? [])
    .slice(-8)
    .map((m) => `${m.role}: ${m.content}`)
    .join("\n");

  try {
    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `${CHAT_SYSTEM}

Case summary for context:
${body.analysisSummary ?? "No summary."}

Recent messages:
${historyText || "(none)"}

Citizen question:
${body.message.trim()}`,
            },
          ],
        },
      ],
    });
    const content = result.response.text().trim();
    return NextResponse.json({ ok: true, data: { content } });
  } catch {
    return NextResponse.json(
      { ok: false, message: "Gemini could not answer just now." },
      { status: 502 },
    );
  }
}
