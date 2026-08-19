"use client";

import { firebaseReady, geminiReady } from "@/lib/features";

export function ModeBanner() {
  const firebase = firebaseReady();
  const gemini = geminiReady();
  if (!firebase && !gemini) return null;
  return (
    <p className="border-b border-border bg-info/10 px-4 py-2 text-xs text-ink">
      {firebase ? "Firebase is on for accounts and case storage. " : "Cases stay in this browser. "}
      {gemini
        ? "Explanations and Ask AI use Gemini on the server. Still not legal advice."
        : "Explanations still use the sample/mock analyser."}
    </p>
  );
}
