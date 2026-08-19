export const APP_NAME = "NyayaSetu";

export const DISCLAIMER_SHORT =
  "NyayaSetu explains and organises information. It is not a lawyer and does not give legal advice.";

export const DISCLAIMER_LONG =
  "NyayaSetu is a citizen-facing assistant. It helps you read documents, organise facts, and prepare questions. It does not replace an advocate, legal aid counsel, or a court. Demo cases in this prototype are fictional. Legal information shown here is unverified sample content, not research for your situation.";

export const DEMO_AUTH_NOTE =
  "Demo sign-in — accounts are not stored on a server yet. Any name and email will open the prototype.";

export const FIREBASE_AUTH_NOTE =
  "This form uses Firebase Authentication. NyayaSetu still does not give legal advice.";

export const SESSION_COOKIE = "nyayasetu_session";

export const CITIZEN_NAV = [
  { href: "/dashboard", label: "Home" },
  { href: "/cases", label: "Cases" },
  { href: "/cases/new", label: "New case" },
  { href: "/lawyers", label: "Find an advocate" },
] as const;

export const MATTER_LABELS: Record<string, string> = {
  consumer: "Consumer",
  tenancy: "Tenancy / rent",
  employment: "Employment",
  family: "Family",
  criminal_complaint: "Police / complaint",
  property: "Property",
  documents_id: "IDs and records",
  other: "Other",
};
