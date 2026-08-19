import { caseAnalysisSchema } from "@/domain/analysisSchema";
import { getGeminiModel } from "@/lib/gemini/client";
import { ANALYZE_SYSTEM } from "@/lib/gemini/prompts";
import { NextResponse } from "next/server";

export const maxDuration = 60;

export async function POST(request: Request) {
  const model = getGeminiModel();
  if (!model) {
    return NextResponse.json(
      { ok: false, message: "GEMINI_API_KEY is not set on the server." },
      { status: 503 },
    );
  }

  const body = (await request.json()) as {
    caseId?: string;
    title?: string;
    category?: string;
    city?: string;
    state?: string;
    narrative?: string;
    document?: { fileName: string; mimeType: string; base64: string };
  };

  if (!body.caseId) {
    return NextResponse.json({ ok: false, message: "Missing case id." }, { status: 400 });
  }

  const parts: Array<{ text: string } | { inlineData: { mimeType: string; data: string } }> = [
    {
      text: `${ANALYZE_SYSTEM}

Return JSON for caseId "${body.caseId}".
Title: ${body.title ?? ""}
Category: ${body.category ?? ""}
Place: ${body.city ?? ""} ${body.state ?? ""}
Citizen description:
${body.narrative ?? "(none)"}

Schema fields: caseId, overview{oneLine,documentOrProblemType,parties}, plainLanguageSummary, keyFacts[], clauses[], obligations[], risks[], deadlines[], missingInformation[], evidenceChecklist[], legalInformation[], sources[], nextSteps[], questionsForLawyer[].`,
    },
  ];

  if (body.document?.base64) {
    parts.push({
      inlineData: {
        mimeType: body.document.mimeType || "application/octet-stream",
        data: body.document.base64,
      },
    });
    parts.push({ text: `Attached file name: ${body.document.fileName}` });
  }

  try {
    const result = await model.generateContent({
      contents: [{ role: "user", parts }],
      generationConfig: { responseMimeType: "application/json" },
    });
    const text = result.response.text();
    const parsed = caseAnalysisSchema.safeParse({
      ...JSON.parse(text),
      caseId: body.caseId,
    });
    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, message: "The model returned a shape we could not use. Try again or use mock mode." },
        { status: 422 },
      );
    }
    const analysis = parsed.data;
    analysis.legalInformation = analysis.legalInformation.map((item) => ({
      ...item,
      verification: "model_unverified" as const,
    }));
    return NextResponse.json({ ok: true, data: analysis });
  } catch {
    return NextResponse.json(
      { ok: false, message: "Gemini could not finish this explanation. Try again later." },
      { status: 502 },
    );
  }
}
