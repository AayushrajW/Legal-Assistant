"use client";

import { Alert } from "@/components/ui/Display";
import { geminiReady } from "@/lib/features";
import { analysisService, caseRepository } from "@/services";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ProcessingPage() {
  const params = useParams<{ caseId: string }>();
  const router = useRouter();
  const [active, setActive] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const gemini = geminiReady();
  const steps = gemini
    ? ["Queued", "Sending your papers to Gemini", "Checking the explanation shape"]
    : ["Queued in this demo", "Reading the file you attached (simulated)", "Drafting a plain-language layout (simulated)"];

  useEffect(() => {
    let cancelled = false;
    const timers = [
      window.setTimeout(() => setActive(1), 700),
      window.setTimeout(() => setActive(2), 1400),
    ];

    async function run() {
      const existing = await caseRepository.getById(params.caseId);
      if (!existing.ok) {
        if (!cancelled) setError(existing.message);
        return;
      }
      if (existing.data.status === "ready" || existing.data.status === "needs_more_info") {
        router.replace(`/cases/${params.caseId}`);
        return;
      }
      const result = await analysisService.startProcessing(params.caseId);
      if (cancelled) return;
      if (!result.ok) {
        setError(result.message);
        return;
      }
      router.replace(`/cases/${params.caseId}`);
    }

    void run();
    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
  }, [params.caseId, router]);

  return (
    <div className="mx-auto max-w-lg px-4 py-16">
      <h1 className="text-2xl font-extrabold text-navy">Preparing an explanation</h1>
      <p className="mt-2 text-sm text-demo">
        {gemini
          ? "Gemini will draft a plain-language layout. It is not a lawyer and may be wrong."
          : "Simulated processing for this demo. No OCR or Gemini call is running."}
      </p>
      <ol className="mt-8 space-y-3">
        {steps.map((label, i) => (
          <li
            key={label}
            className={`rounded-2xl border px-4 py-3 text-sm ${
              i <= active ? "border-accent/40 bg-accent/5 text-navy" : "border-border text-demo"
            }`}
          >
            {i < active ? "Done — " : i === active ? "In progress — " : "Waiting — "}
            {label}
          </li>
        ))}
      </ol>
      {error ? (
        <div className="mt-6">
          <Alert tone="danger" title="Could not finish">
            {error}
          </Alert>
        </div>
      ) : null}
    </div>
  );
}
