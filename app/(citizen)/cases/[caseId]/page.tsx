"use client";

import { AskAiPanel } from "@/components/assistant/AskAiPanel";
import { Button } from "@/components/ui/Button";
import { Alert, Badge, Card, EmptyState, Section, Skeleton } from "@/components/ui/Display";
import { Sheet } from "@/components/ui/Sheet";
import {
  ACTOR_LABEL,
  URGENCY_LABEL,
  type CaseAnalysis,
} from "@/domain/analysis";
import { CASE_STATUS_LABEL, type CaseRecord } from "@/domain/case";
import type { ProblemDescription, UploadedDocument } from "@/domain/document";
import { MATTER_LABELS } from "@/lib/constants";
import { formatDate } from "@/lib/format";
import { LawyerCard } from "@/components/lawyers/LawyerCard";
import { analysisService, caseRepository, documentService, lawyerRepository } from "@/services";
import type { LawyerProfile } from "@/domain/lawyer";
import { Sparkles } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

function urgencyTone(u: CaseAnalysis["deadlines"][number]["urgency"]) {
  if (u === "urgent") return "urgent" as const;
  if (u === "soon") return "warning" as const;
  if (u === "upcoming") return "info" as const;
  return "neutral" as const;
}

export default function CaseAnalysisPage() {
  const { caseId } = useParams<{ caseId: string }>();
  const [record, setRecord] = useState<CaseRecord | null>(null);
  const [analysis, setAnalysis] = useState<CaseAnalysis | null>(null);
  const [doc, setDoc] = useState<UploadedDocument | null>(null);
  const [desc, setDesc] = useState<ProblemDescription | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<"overview" | "documents" | "legal" | "plan" | "lawyers">("overview");
  const [aiOpen, setAiOpen] = useState(false);
  const [lawyers, setLawyers] = useState<LawyerProfile[]>([]);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      const c = await caseRepository.getById(caseId);
      if (!c.ok) {
        if (!cancelled) setError(c.message);
        return;
      }
      if (!cancelled) setRecord(c.data);
      const [a, d, p] = await Promise.all([
        analysisService.getAnalysis(caseId),
        documentService.getByCaseId(caseId),
        documentService.getDescription(caseId),
      ]);
      if (cancelled) return;
      if (a.ok) setAnalysis(a.data);
      else setError(a.message);
      if (d.ok) setDoc(d.data);
      if (p.ok) setDesc(p.data);
      const listed = await lawyerRepository.list();
      if (!cancelled && listed.ok) setLawyers(listed.data.slice(0, 3));
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, [caseId]);

  if (error && !record) {
    return (
      <div className="p-6">
        <Alert tone="danger" title="Case not found">
          {error}{" "}
          <Link className="font-medium underline" href="/cases">
            Back to cases
          </Link>
        </Alert>
      </div>
    );
  }

  if (!record || !analysis) {
    return (
      <div className="space-y-3 p-6">
        <Skeleton className="h-12 w-2/3" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  const documentPane = (
    <div className="space-y-3">
      {doc?.previewUrl ? (
        <div className="overflow-hidden rounded-lg border border-border bg-white">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={doc.previewUrl} alt={`Preview of ${doc.fileName}`} className="w-full" />
        </div>
      ) : doc ? (
        <EmptyState
          title={doc.fileName}
          body="In-browser PDF preview is not included in this prototype. The file name is stored locally only."
        />
      ) : (
        <EmptyState
          title="No document in this file"
          body={desc?.narrative ?? "This case was started from a description."}
        />
      )}
      {desc ? (
        <Card>
          <p className="text-sm font-semibold text-navy">Your description</p>
          <p className="mt-2 text-sm text-ink/90">{desc.narrative}</p>
        </Card>
      ) : null}
    </div>
  );

  const steps = [
    { label: "Case created", done: true },
    { label: "Papers read", done: record.status !== "processing" },
    { label: "Explanation ready", done: record.status === "ready" || record.status === "needs_more_info" },
    { label: "Next steps listed", done: analysis.nextSteps.length > 0 },
  ];
  const progress = Math.round((steps.filter((s) => s.done).length / steps.length) * 100);
  const firstStep = analysis.nextSteps.slice().sort((a, b) => a.order - b.order)[0];

  const tabs = [
    ["overview", "Overview"],
    ["documents", "Documents"],
    ["legal", "Legal Information"],
    ["plan", "Action Plan"],
    ["lawyers", "Lawyers"],
  ] as const;

  return (
    <div className="px-4 py-6 lg:px-8">
      <p className="text-sm text-demo">
        <Link href="/cases" className="font-semibold text-accent">
          My Cases
        </Link>{" "}
        / {record.title}
      </p>
      <div className="mt-2 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-navy md:text-3xl">{record.title}</h1>
          <div className="mt-2 flex flex-wrap gap-2">
            {record.isDemo ? <Badge tone="demo">Demo case</Badge> : null}
            <Badge tone={record.status === "needs_more_info" ? "warning" : record.status === "ready" ? "success" : "info"}>
              {CASE_STATUS_LABEL[record.status]}
            </Badge>
            <Badge>{MATTER_LABELS[record.category]}</Badge>
          </div>
        </div>
        <Button variant="accent" className="xl:hidden" onClick={() => setAiOpen(true)}>
          <Sparkles className="size-4" aria-hidden />
          Ask AI
        </Button>
      </div>

      <div className="mt-6 flex gap-1 overflow-x-auto border-b border-border">
        {tabs.map(([id, label]) => (
          <button
            key={id}
            type="button"
            className={`min-h-11 shrink-0 border-b-2 px-4 text-sm font-semibold ${
              tab === id ? "border-accent text-accent" : "border-transparent text-demo"
            }`}
            onClick={() => setTab(id)}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div>
          {tab === "overview" ? (
            <div className="grid gap-4 lg:grid-cols-2">
              <Card>
                <h2 className="font-bold text-navy">Case summary</h2>
                <p className="mt-2 text-ink/90">{analysis.plainLanguageSummary}</p>
              </Card>
              <Card>
                <h2 className="font-bold text-navy">Analysis progress</h2>
                <p className="mt-2 text-3xl font-extrabold text-accent">{progress}% completed</p>
                <ul className="mt-3 space-y-2 text-sm">
                  {steps.map((s) => (
                    <li key={s.label} className={s.done ? "text-success" : "text-demo"}>
                      {s.done ? "✓" : "○"} {s.label}
                    </li>
                  ))}
                </ul>
              </Card>
              <Card>
                <h2 className="font-bold text-navy">What you need to know</h2>
                <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-ink">
                  {analysis.keyFacts.slice(0, 5).map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
              </Card>
              <Card>
                <h2 className="font-bold text-navy">Next step</h2>
                <p className="mt-2 text-sm text-ink">{firstStep?.text ?? "Open the action plan for a full list."}</p>
                <Button className="mt-4" variant="primary" onClick={() => setTab("plan")}>
                  View Action Plan
                </Button>
              </Card>
              <div className="lg:col-span-2 space-y-3">
                {analysis.risks.map((r) => (
                  <Alert key={r.id} tone={r.severity === "serious" ? "danger" : "warning"} title={r.severity === "serious" ? "Serious" : "Attention"}>
                    {r.text}
                  </Alert>
                ))}
              </div>
            </div>
          ) : null}

          {tab === "documents" ? (
            <div className="space-y-6">
              {documentPane}
              <Section id="evidence" title="Evidence / documents">
                <ul className="space-y-2">
                  {analysis.evidenceChecklist.map((e) => (
                    <li key={e.id} className="flex items-center justify-between gap-3 rounded-xl border border-border bg-surface px-3 py-2 text-sm">
                      <span>{e.label}</span>
                      <Badge tone={e.status === "have" ? "success" : e.status === "missing" ? "warning" : "neutral"}>
                        {e.status === "have" ? "You have this" : e.status === "missing" ? "Missing" : "Optional"}
                      </Badge>
                    </li>
                  ))}
                </ul>
              </Section>
            </div>
          ) : null}

          {tab === "legal" ? (
            <div className="space-y-8">
              <Section id="clauses" title="Important clauses">
                {analysis.clauses.length === 0 ? (
                  <EmptyState title="No clauses extracted" body="This file was started from a description, or the sample has no clause list." />
                ) : (
                  <div className="space-y-3">
                    {analysis.clauses.map((cl) => (
                      <details key={cl.id} className="rounded-2xl border border-border bg-surface p-4">
                        <summary className="cursor-pointer font-semibold text-navy">{cl.heading}</summary>
                        <p className="mt-2 text-sm text-ink/90">{cl.plainLanguage}</p>
                        {cl.excerpt ? (
                          <blockquote className="mt-3 border-l-2 border-accent/40 pl-3 text-sm text-ink/80">
                            {cl.excerpt}
                          </blockquote>
                        ) : null}
                      </details>
                    ))}
                  </div>
                )}
              </Section>
              <Section id="obligations" title="Obligations">
                <ul className="space-y-3">
                  {analysis.obligations.map((o) => (
                    <li key={o.id} className="rounded-xl border border-border bg-surface p-3">
                      <Badge>{ACTOR_LABEL[o.actor]}</Badge>
                      <p className="mt-2 text-sm text-ink">{o.text}</p>
                    </li>
                  ))}
                </ul>
              </Section>
              <Section id="legal" title="Relevant legal information" description="Not verified research for your facts.">
                {analysis.legalInformation.map((item) => (
                  <Card key={item.id} className="mb-3">
                    <Badge tone="demo">
                      {item.verification === "model_unverified" ? "Model · not verified" : "Demo · not verified"}
                    </Badge>
                    <p className="mt-2 font-semibold text-navy">{item.title}</p>
                    <p className="mt-1 text-sm text-ink/90">{item.summary}</p>
                  </Card>
                ))}
              </Section>
            </div>
          ) : null}

          {tab === "plan" ? (
            <div className="space-y-8">
              <Section id="next" title="Next steps">
                <ol className="space-y-3">
                  {analysis.nextSteps
                    .slice()
                    .sort((a, b) => a.order - b.order)
                    .map((s) => (
                      <li key={s.id} className="flex gap-3">
                        <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-navy text-xs text-white">
                          {s.order}
                        </span>
                        <div>
                          <Badge tone="neutral">{s.kind.replaceAll("_", " ")}</Badge>
                          <p className="mt-1 text-sm text-ink">{s.text}</p>
                        </div>
                      </li>
                    ))}
                </ol>
              </Section>
              <Section id="deadlines" title="Deadlines">
                <ul className="space-y-3">
                  {analysis.deadlines.map((d) => (
                    <li
                      key={d.id}
                      className="flex flex-col gap-1 rounded-xl border border-border bg-surface p-3 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div>
                        <p className="font-medium text-navy">{d.label}</p>
                        <p className="text-sm text-demo">
                          {d.date ? formatDate(d.date) : "No calendar date"} {d.note ? `· ${d.note}` : ""}
                        </p>
                      </div>
                      <Badge tone={urgencyTone(d.urgency)}>{URGENCY_LABEL[d.urgency]}</Badge>
                    </li>
                  ))}
                </ul>
              </Section>
              <Section id="missing" title="Missing information">
                <ul className="space-y-3">
                  {analysis.missingInformation.map((m) => (
                    <li key={m.id} className="rounded-xl border border-dashed border-border bg-surface p-3">
                      <p className="font-medium text-navy">{m.question}</p>
                      <p className="mt-1 text-sm text-demo">{m.whyNeeded}</p>
                    </li>
                  ))}
                </ul>
              </Section>
              <Section id="questions" title="Questions to ask a lawyer">
                <ul className="list-disc space-y-2 pl-5 text-ink">
                  {analysis.questionsForLawyer.map((q) => (
                    <li key={q}>{q}</li>
                  ))}
                </ul>
                <Button className="mt-4" variant="accent" onClick={() => setTab("lawyers")}>
                  See sample lawyers
                </Button>
              </Section>
              <Section id="sources" title="Sources">
                <ul className="space-y-3">
                  {analysis.sources.map((s) => (
                    <li key={s.id} className="text-sm">
                      {s.url ? (
                        <a className="font-medium text-accent underline-offset-2 hover:underline" href={s.url}>
                          {s.label}
                        </a>
                      ) : (
                        <span className="font-medium text-navy">{s.label}</span>
                      )}
                      <p className="text-demo">{s.note}</p>
                    </li>
                  ))}
                </ul>
              </Section>
            </div>
          ) : null}

          {tab === "lawyers" ? (
            <div className="space-y-4">
              <p className="text-sm text-demo">
                Sample matches only. Profiles are fictional. Consultations are not booked from this app.
              </p>
              {lawyers.map((lawyer) => (
                <LawyerCard key={lawyer.id} lawyer={lawyer} />
              ))}
              <Link href="/lawyers">
                <Button variant="secondary">See all sample lawyers</Button>
              </Link>
            </div>
          ) : null}
        </div>

        <aside className="hidden xl:block">
          <div className="sticky top-6 rounded-2xl border border-border bg-surface p-4 shadow-card">
            <AskAiPanel caseId={caseId} />
          </div>
        </aside>
      </div>

      <Sheet open={aiOpen} onClose={() => setAiOpen(false)} title="Ask AI">
        <AskAiPanel caseId={caseId} />
      </Sheet>
    </div>
  );
}
