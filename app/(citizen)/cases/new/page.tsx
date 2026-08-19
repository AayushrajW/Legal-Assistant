"use client";

import { Button } from "@/components/ui/Button";
import { Alert, Card } from "@/components/ui/Display";
import { Checkbox, Input, Select, Textarea } from "@/components/ui/Field";
import { FileDropzone, Stepper, type LocalFile } from "@/components/ui/FileDropzone";
import { useSession } from "@/hooks/useSession";
import { MATTER_LABELS } from "@/lib/constants";
import type { CaseSource, MatterCategory } from "@/domain/case";
import { caseRepository } from "@/services";
import { useRouter } from "next/navigation";
import { useState } from "react";

const STEPS = ["How to start", "Details", "Review"];
const CATEGORIES = Object.keys(MATTER_LABELS) as MatterCategory[];

export default function NewCasePage() {
  const router = useRouter();
  const { user } = useSession();
  const [step, setStep] = useState(0);
  const [mode, setMode] = useState<"document" | "description" | "both">("both");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<MatterCategory>("tenancy");
  const [city, setCity] = useState("");
  const [stateName, setStateName] = useState("");
  const [file, setFile] = useState<LocalFile | null>(null);
  const [narrative, setNarrative] = useState("");
  const [whatHappened, setWhatHappened] = useState("");
  const [ack, setAck] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const source: CaseSource =
    mode === "both" ? "document_and_description" : mode === "document" ? "document" : "description";

  function nextFromStart() {
    setError(null);
    setStep(1);
  }

  function nextFromDetails() {
    if (!title.trim()) {
      setError("Give this case a short name you will recognise.");
      return;
    }
    if ((mode === "document" || mode === "both") && !file) {
      setError("Add a PDF or photo, or go back and choose “I can describe the problem”.");
      return;
    }
    if ((mode === "description" || mode === "both") && narrative.trim().length < 20) {
      setError("Write a little more about what happened (at least a couple of sentences).");
      return;
    }
    setError(null);
    setStep(2);
  }

  async function submit() {
    if (!ack) {
      setError("Please confirm you understand this is not legal advice.");
      return;
    }
    if (!user) {
      setError("Sign in again to continue this demo.");
      return;
    }
    setPending(true);
    setError(null);
    const result = await caseRepository.createDraft(user.id, {
      title,
      category,
      source,
      city,
      state: stateName,
      document: file ?? undefined,
      description:
        mode === "document"
          ? undefined
          : {
              narrative,
              whatHappened: whatHappened || undefined,
            },
    });
    setPending(false);
    if (!result.ok) {
      setError(result.message);
      return;
    }
    router.push(`/cases/${result.data.id}/processing`);
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="font-serif text-3xl text-navy">Start a case</h1>
      <p className="mt-2 text-sm text-demo">
        Files stay in this browser for the prototype. They are not uploaded to cloud storage.
      </p>
      <div className="mt-6">
        <Stepper steps={STEPS} current={step} />
      </div>

      {step === 0 ? (
        <div className="mt-8 grid gap-3">
          {(
            [
              ["document", "I have a document", "PDF or photo of a notice, contract, or letter."],
              ["description", "I can describe the problem", "Tell us what happened in your own words."],
              ["both", "I have both", "Best path if you can add a paper and a short story."],
            ] as const
          ).map(([value, label, hint]) => (
            <button
              key={value}
              type="button"
              onClick={() => setMode(value)}
              className={`rounded-lg border p-4 text-left ${mode === value ? "border-navy bg-navy/5" : "border-border bg-surface"}`}
            >
              <p className="font-medium text-navy">{label}</p>
              <p className="mt-1 text-sm text-demo">{hint}</p>
            </button>
          ))}
          <Button className="mt-2" onClick={nextFromStart}>
            Continue
          </Button>
        </div>
      ) : null}

      {step === 1 ? (
        <div className="mt-8 space-y-4">
          <Input
            id="title"
            label="Short title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Rent notice from landlord"
          />
          <Select
            id="category"
            label="What is this about?"
            value={category}
            onChange={(e) => setCategory(e.target.value as MatterCategory)}
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {MATTER_LABELS[c]}
              </option>
            ))}
          </Select>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input id="city" label="City" value={city} onChange={(e) => setCity(e.target.value)} />
            <Input
              id="state"
              label="State / UT"
              value={stateName}
              onChange={(e) => setStateName(e.target.value)}
            />
          </div>
          {mode !== "description" ? (
            <div>
              <p className="mb-2 text-sm font-medium text-ink">Document</p>
              <FileDropzone value={file} onChange={setFile} />
            </div>
          ) : null}
          {mode !== "document" ? (
            <>
              <Textarea
                id="narrative"
                label="What happened?"
                hint="Names, dates, and what you want, in everyday words."
                value={narrative}
                onChange={(e) => setNarrative(e.target.value)}
              />
              <Input
                id="want"
                label="What would a good ending look like? (optional)"
                value={whatHappened}
                onChange={(e) => setWhatHappened(e.target.value)}
              />
            </>
          ) : null}
          {error ? (
            <p className="text-sm text-danger" role="alert">
              {error}
            </p>
          ) : null}
          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => setStep(0)}>
              Back
            </Button>
            <Button onClick={nextFromDetails}>Review</Button>
          </div>
        </div>
      ) : null}

      {step === 2 ? (
        <div className="mt-8 space-y-4">
          <Card>
            <p className="text-sm text-demo">Title</p>
            <p className="font-medium text-navy">{title}</p>
            <p className="mt-3 text-sm text-demo">Type</p>
            <p className="text-ink">{MATTER_LABELS[category]} · {source.replaceAll("_", " ")}</p>
            {file ? (
              <p className="mt-3 text-sm text-ink">File: {file.fileName}</p>
            ) : null}
          </Card>
          <Alert tone="warning" title="NyayaSetu is not a lawyer">
            The next screen simulates reading your papers. The explanation is demo content, not legal
            advice and not a prediction of any court result.
          </Alert>
          <Checkbox
            id="ack"
            label="I understand this prototype organises information and does not replace an advocate."
            checked={ack}
            onChange={(e) => setAck(e.target.checked)}
          />
          {error ? (
            <p className="text-sm text-danger" role="alert">
              {error}
            </p>
          ) : null}
          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => setStep(1)}>
              Back
            </Button>
            <Button onClick={() => void submit()} disabled={pending}>
              {pending ? "Saving locally…" : "Create case"}
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
