import { z } from "zod";

const urgency = z.enum(["none", "upcoming", "soon", "urgent"]);

export const caseAnalysisSchema = z.object({
  caseId: z.string(),
  overview: z.object({
    oneLine: z.string(),
    documentOrProblemType: z.string(),
    parties: z.string().optional(),
  }),
  plainLanguageSummary: z.string(),
  keyFacts: z.array(z.string()),
  clauses: z.array(
    z.object({
      id: z.string(),
      heading: z.string(),
      plainLanguage: z.string(),
      excerpt: z.string().optional(),
      whyItMatters: z.string().optional(),
    }),
  ),
  obligations: z.array(
    z.object({
      id: z.string(),
      actor: z.enum(["you", "other_party", "unclear"]),
      text: z.string(),
    }),
  ),
  risks: z.array(
    z.object({
      id: z.string(),
      severity: z.enum(["attention", "serious"]),
      text: z.string(),
    }),
  ),
  deadlines: z.array(
    z.object({
      id: z.string(),
      label: z.string(),
      date: z.string().optional(),
      urgency,
      note: z.string().optional(),
    }),
  ),
  missingInformation: z.array(
    z.object({
      id: z.string(),
      question: z.string(),
      whyNeeded: z.string(),
    }),
  ),
  evidenceChecklist: z.array(
    z.object({
      id: z.string(),
      label: z.string(),
      status: z.enum(["have", "missing", "optional"]),
    }),
  ),
  legalInformation: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      summary: z.string(),
      verification: z.enum(["demo_unverified", "model_unverified"]),
    }),
  ),
  sources: z.array(
    z.object({
      id: z.string(),
      label: z.string(),
      kind: z.enum(["official_body", "procedure_guide", "legislation_portal", "court_services"]),
      url: z.string().optional(),
      note: z.string(),
    }),
  ),
  nextSteps: z.array(
    z.object({
      id: z.string(),
      order: z.number(),
      text: z.string(),
      kind: z.enum(["self", "official", "legal_aid", "lawyer"]),
    }),
  ),
  questionsForLawyer: z.array(z.string()),
});
