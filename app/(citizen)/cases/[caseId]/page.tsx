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
import { analysisService, caseRepository, documentService } from "@/services";
import { Sparkles } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const NAV = [
  ["overview", "Overview"],
  ["summary", "What is this?"],
  ["facts", "Key information"],
  ["clauses", "Important clauses"],
  ["obligations", "Obligations"],
  ["risks", "Risks"],
  ["deadlines", "Deadlines"],
  ["missing", "Missing information"],
  ["evidence", "Evidence"],
  ["legal", "Legal information"],
  ["sources", "Sources"],
  ["next", "Next steps"],
  ["questions", "Questions for a lawyer"],
] as const;

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
  const [tab, setTab] = useState<"analysis" | "document">("analysis");
  const [aiOpen, setAiOpen] = useState(false);

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

  const analysisPane = (
    <div className="space-y-10">
      <Section id="overview" title="Case overview">
        <div className="flex flex-wrap gap-2">
          <Badge tone="demo">Demo case</Badge>
          <Badge tone={record.status === "needs_more_info" ? "warning" : "success"}>
            {CASE_STATUS_LABEL[record.status]}
          </Badge>
          <Badge>{MATTER_LABELS[record.category]}</Badge>
        </div>
        <p className="mt-3 text-ink">{analysis.overview.oneLine}</p>
        <ul className="mt-3 space-y-1 text-sm text-demo">
          <li>Type: {analysis.overview.documentOrProblemType}</li>
          {analysis.overview.parties ? <li>People named in the sample: {analysis.overview.parties}</li> : null}
          <li>Opened {formatDate(record.createdAt)}</li>
        </ul>
      </Section>

      <Section id="summary" title="What is this document/problem?">
        <p className="text-ink/90">{analysis.plainLanguageSummary}</p>
      </Section>

      <Section id="facts" title="Key information">
        <ul className="list-disc space-y-2 pl-5 text-ink">
          {analysis.keyFacts.map((f) => (
            <li key={f}>{f}</li>
          ))}
        </ul>
      </Section>

      <Section
        id="clauses"
        title="Important clauses"
        description="Only shown when a document is part of the sample."
      >
        {analysis.clauses.length === 0 ? (
          <EmptyState title="No clauses extracted" body="This file was started from a description, or the sample has no clause list." />
        ) : (
          <div className="space-y-3">
            {analysis.clauses.map((cl) => (
              <details key={cl.id} className="rounded-lg border border-border bg-surface p-4">
                <summary className="cursor-pointer font-medium text-navy">{cl.heading}</summary>
                <p className="mt-2 text-sm text-ink/90">{cl.plainLanguage}</p>
                {cl.excerpt ? (
                  <blockquote className="mt-3 border-l-2 border-navy/20 pl-3 font-serif text-sm text-ink/80">
                    {cl.excerpt}
                  </blockquote>
                ) : null}
                {cl.whyItMatters ? <p className="mt-2 text-sm text-demo">{cl.whyItMatters}</p> : null}
              </details>
            ))}
          </div>
        )}
      </Section>

      <Section id="obligations" title="Obligations">
        <ul className="space-y-3">
          {analysis.obligations.map((o) => (
            <li key={o.id} className="rounded-md border border-border p-3">
              <Badge>{ACTOR_LABEL[o.actor]}</Badge>
              <p className="mt-2 text-sm text-ink">{o.text}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="risks" title="Risks / attention points">
        <ul className="space-y-3">
          {analysis.risks.map((r) => (
            <li key={r.id}>
              <Alert tone={r.severity === "serious" ? "danger" : "warning"} title={r.severity === "serious" ? "Serious" : "Attention"}>
                {r.text}
              </Alert>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="deadlines" title="Deadlines">
        <ul className="space-y-3">
          {analysis.deadlines.map((d) => (
            <li key={d.id} className="flex flex-col gap-1 rounded-md border border-border p-3 sm:flex-row sm:items-center sm:justify-between">
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
            <li key={m.id} className="rounded-md border border-dashed border-border p-3">
              <p className="font-medium text-navy">{m.question}</p>
              <p className="mt-1 text-sm text-demo">{m.whyNeeded}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="evidence" title="Evidence / documents">
        <ul className="space-y-2">
          {analysis.evidenceChecklist.map((e) => (
            <li key={e.id} className="flex items-center justify-between gap-3 rounded-md border border-border px-3 py-2 text-sm">
              <span>{e.label}</span>
              <Badge tone={e.status === "have" ? "success" : e.status === "missing" ? "warning" : "neutral"}>
                {e.status === "have" ? "You have this" : e.status === "missing" ? "Missing" : "Optional"}
              </Badge>
            </li>
          ))}
        </ul>
      </Section>

      <Section
        id="legal"
        title="Relevant legal information"
        description="Sample orientation only — not verified research for your facts."
      >
        {analysis.legalInformation.map((item) => (
          <Card key={item.id} className="mb-3">
            <Badge tone="demo">Demo · not verified</Badge>
            <p className="mt-2 font-medium text-navy">{item.title}</p>
            <p className="mt-1 text-sm text-ink/90">{item.summary}</p>
          </Card>
        ))}
      </Section>

      <Section id="sources" title="Sources">
        <ul className="space-y-3">
          {analysis.sources.map((s) => (
            <li key={s.id} className="text-sm">
              {s.url ? (
                <a className="font-medium text-navy underline-offset-2 hover:underline" href={s.url}>
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

      <Section id="questions" title="Questions to ask a lawyer">
        <ul className="list-disc space-y-2 pl-5 text-ink">
          {analysis.questionsForLawyer.map((q) => (
            <li key={q}>{q}</li>
          ))}
        </ul>
        <Link href="/lawyers" className="mt-4 inline-block">
          <Button variant="secondary">Browse sample advocates</Button>
        </Link>
      </Section>
    </div>
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm text-demo">
            <Link href="/cases" className="underline-offset-2 hover:underline">
              Cases
            </Link>{" "}
            / {record.title}
          </p>
          <h1 className="mt-1 font-serif text-3xl text-navy">{record.title}</h1>
        </div>
        <Button variant="ai" className="xl:hidden" onClick={() => setAiOpen(true)}>
          <Sparkles className="size-4" aria-hidden />
          Ask AI
        </Button>
      </div>

      <div className="mt-4 flex gap-2 border-b border-border pb-2 lg:hidden">
        <button
          type="button"
          className={`min-h-11 px-3 text-sm font-medium ${tab === "analysis" ? "text-navy" : "text-demo"}`}
          onClick={() => setTab("analysis")}
        >
          Analysis
        </button>
        <button
          type="button"
          className={`min-h-11 px-3 text-sm font-medium ${tab === "document" ? "text-navy" : "text-demo"}`}
          onClick={() => setTab("document")}
        >
          Document
        </button>
      </div>

      <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.2fr)] xl:grid-cols-[240px_minmax(0,1fr)_320px]">
        <nav className="hidden xl:block" aria-label="On this page">
          <ul className="sticky top-6 space-y-1 text-sm">
            {NAV.map(([id, label]) => (
              <li key={id}>
                <a href={`#${id}`} className="block rounded px-2 py-1 text-navy hover:bg-navy/5">
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <div className="mb-6 hidden lg:block">{documentPane}</div>
          <div className={tab === "document" ? "lg:hidden" : "hidden"}>{documentPane}</div>
          <div className={tab === "analysis" ? "block" : "hidden lg:block"}>{analysisPane}</div>
        </div>

        <aside className="hidden xl:block">
          <div className="sticky top-6 rounded-lg border border-border bg-surface p-4">
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
