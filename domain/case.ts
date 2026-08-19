import type { UserId } from "./user";

export type CaseId = string;

export type CaseStatus =
  | "draft"
  | "processing"
  | "ready"
  | "needs_more_info"
  | "error";

export type CaseSource = "document" | "description" | "document_and_description";

export type MatterCategory =
  | "consumer"
  | "tenancy"
  | "employment"
  | "family"
  | "criminal_complaint"
  | "property"
  | "documents_id"
  | "other";

export interface CaseLocation {
  city?: string;
  state?: string;
}

export interface CaseRecord {
  id: CaseId;
  citizenId: UserId;
  title: string;
  category: MatterCategory;
  source: CaseSource;
  status: CaseStatus;
  createdAt: string;
  updatedAt: string;
  location?: CaseLocation;
  isDemo: boolean;
}

export const CASE_STATUS_LABEL: Record<CaseStatus, string> = {
  draft: "Draft",
  processing: "In Progress",
  ready: "Analysis Complete",
  needs_more_info: "Awaiting Action",
  error: "Could not finish",
};

export function isOpenCase(status: CaseStatus): boolean {
  return status === "ready" || status === "needs_more_info";
}
