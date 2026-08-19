import { generateDemoAnalysis } from "@/data/mocks/generateAnalysis";
import type { AnalysisService } from "@/services/types";
import { analysisPersistence, caseRepo, documentRepo } from "@/services/runtime";

export const fallbackAnalysisService: AnalysisService = {
  getAnalysis: (caseId) => analysisPersistence().getAnalysis(caseId),
  saveAnalysis: (analysis) => analysisPersistence().saveAnalysis(analysis),
  async startProcessing(caseId) {
    const record = await caseRepo().getById(caseId);
    if (!record.ok) return record;
    const desc = await documentRepo().getDescription(caseId);
    const analysis = generateDemoAnalysis(
      record.data,
      desc.ok ? desc.data?.narrative : undefined,
    );
    const saved = await analysisPersistence().saveAnalysis(analysis);
    if (!saved.ok) return saved;
    await caseRepo().updateStatus(caseId, "ready");
    return saved;
  },
};
