import type { MatterCategory } from "./case";

export type LawyerId = string;

export interface LawyerProfile {
  id: LawyerId;
  fullName: string;
  enrollmentDisplay?: string;
  city: string;
  state: string;
  practiceAreas: MatterCategory[];
  languages: string[];
  yearsExperience?: number;
  bio: string;
  consultationNote: string;
  isDemo: true;
}

export interface LawyerFilters {
  city?: string;
  practiceArea?: MatterCategory | "all";
  language?: string | "all";
}
