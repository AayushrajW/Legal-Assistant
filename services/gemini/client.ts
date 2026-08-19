import type { CaseAnalysis } from "@/domain/analysis";
import type { ChatMessage } from "@/domain/chat";
import { getCaseFile } from "@/lib/blobCache";
import { firebaseReady } from "@/lib/features";
import { appendFirebaseMessages } from "@/services/firebase/cases";
import { mockChatService } from "@/services/mock/chat";
import {
  analysisPersistence,
  caseRepo,
  chatPersistence,
  documentRepo,
} from "@/services/runtime";
import type { AnalysisService, ChatService } from "@/services/types";

export const geminiAnalysisService: AnalysisService = {
  getAnalysis: (caseId) => analysisPersistence().getAnalysis(caseId),
  saveAnalysis: (analysis) => analysisPersistence().saveAnalysis(analysis),
  async startProcessing(caseId) {
    const record = await caseRepo().getById(caseId);
    if (!record.ok) return record;
    const [desc, doc] = await Promise.all([
      documentRepo().getDescription(caseId),
      documentRepo().getByCaseId(caseId),
    ]);
    const file = getCaseFile(caseId);
    const response = await fetch("/api/ai/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        caseId,
        title: record.data.title,
        category: record.data.category,
        city: record.data.location?.city,
        state: record.data.location?.state,
        narrative: desc.ok ? desc.data?.narrative : undefined,
        document: file
          ? { fileName: file.fileName, mimeType: file.mimeType, base64: file.base64 }
          : undefined,
        hasDocumentRecord: doc.ok && Boolean(doc.data),
      }),
    });
    const json = (await response.json()) as { ok: boolean; data?: CaseAnalysis; message?: string };
    if (!json.ok || !json.data) {
      return {
        ok: false,
        code: "unavailable",
        message: json.message || "Could not analyse this case with Gemini.",
      };
    }
    const saved = await analysisPersistence().saveAnalysis(json.data);
    if (!saved.ok) return saved;
    const status = json.data.missingInformation.length > 2 ? "needs_more_info" : "ready";
    await caseRepo().updateStatus(caseId, status);
    return saved;
  },
};

export const geminiChatService: ChatService = {
  list: (caseId) => chatPersistence().list(caseId),
  async send(caseId, content) {
    const trimmed = content.trim();
    if (!trimmed) {
      return { ok: false, code: "invalid", message: "Type a question first." };
    }
    const existing = await chatPersistence().list(caseId);
    const history = existing.ok ? existing.data : [];
    const analysis = await analysisPersistence().getAnalysis(caseId);
    const response = await fetch("/api/ai/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: trimmed,
        analysisSummary: analysis.ok
          ? `${analysis.data.overview.oneLine}\n${analysis.data.plainLanguageSummary}`
          : "",
        history: history.map((m) => ({
          role: m.role === "assistant" ? "assistant" : "user",
          content: m.content,
        })),
      }),
    });
    const json = (await response.json()) as {
      ok: boolean;
      data?: { content: string };
      message?: string;
    };
    if (!json.ok || !json.data) {
      return {
        ok: false,
        code: "unavailable",
        message: json.message || "Could not get a Gemini reply.",
      };
    }
    const now = new Date().toISOString();
    const userMsg: ChatMessage = {
      id: `m-${Date.now()}`,
      caseId,
      role: "user",
      content: trimmed,
      createdAt: now,
    };
    const assistantMsg: ChatMessage = {
      id: `m-${Date.now()}-a`,
      caseId,
      role: "assistant",
      content: json.data.content,
      createdAt: now,
      isDemo: false,
    };
    if (firebaseReady()) {
      await appendFirebaseMessages(caseId, [userMsg, assistantMsg]);
      return chatPersistence().list(caseId);
    }
    return mockChatService.append(caseId, [userMsg, assistantMsg]);
  },
};
