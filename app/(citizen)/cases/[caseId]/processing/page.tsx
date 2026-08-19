"use client";

import { Alert } from "@/components/ui/Display";
import { analysisService, caseRepository } from "@/services";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const STEPS = [
  "Queued in this demo",
  "Reading the file you attached (simulated)",
  "Drafting a plain-language layout (simulated)",
];

export default function ProcessingPage() {
  const params = useParams<{ caseId: string }>();
  const router = useRouter();
  const [active, setActive] = useState(0);
  const [error, setError] = useState<string | null>(null);

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
      <h1 className="font-serif text-2xl text-navy">Preparing an explanation</h1>
      <p className="mt-2 text-sm text-demo">
        Simulated processing for this demo. No OCR or Gemini call is running.
      </p>
      <ol className="mt-8 space-y-3">
        {STEPS.map((label, i) => (
          <li
            key={label}
            className={`rounded-md border px-4 py-3 text-sm ${
              i <= active ? "border-navy/30 bg-navy/5 text-navy" : "border-border text-demo"
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
