"use client";

import { Button } from "@/components/ui/Button";
import { Alert, Badge, Card, Skeleton } from "@/components/ui/Display";
import { Sheet } from "@/components/ui/Sheet";
import type { LawyerProfile } from "@/domain/lawyer";
import { MATTER_LABELS } from "@/lib/constants";
import { lawyerRepository } from "@/services";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function LawyerProfilePage() {
  const { lawyerId } = useParams<{ lawyerId: string }>();
  const [lawyer, setLawyer] = useState<LawyerProfile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [modal, setModal] = useState(false);

  useEffect(() => {
    void lawyerRepository.getById(lawyerId).then((r) => {
      if (r.ok) setLawyer(r.data);
      else setError(r.message);
    });
  }, [lawyerId]);

  if (error) {
    return (
      <div className="p-6">
        <Alert tone="danger" title="Profile not found">
          {error}
        </Alert>
      </div>
    );
  }

  if (!lawyer) {
    return (
      <div className="p-6">
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <p className="text-sm text-demo">
        <Link href="/lawyers" className="underline-offset-2 hover:underline">
          Advocates
        </Link>{" "}
        / {lawyer.fullName}
      </p>
      <Badge tone="demo" className="mt-3">
        Demo profile — not a real advocate
      </Badge>
      <h1 className="mt-2 font-serif text-3xl text-navy">{lawyer.fullName}</h1>
      <p className="mt-1 text-demo">
        {lawyer.city}, {lawyer.state}
        {lawyer.yearsExperience ? ` · ${lawyer.yearsExperience} years (sample)` : ""}
      </p>
      {lawyer.enrollmentDisplay ? (
        <p className="mt-1 text-sm text-demo">{lawyer.enrollmentDisplay}</p>
      ) : null}

      <Card className="mt-6">
        <h2 className="font-semibold text-navy">About</h2>
        <p className="mt-2 text-ink/90">{lawyer.bio}</p>
      </Card>
      <Card className="mt-4">
        <h2 className="font-semibold text-navy">Practice areas</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {lawyer.practiceAreas.map((a) => (
            <Badge key={a}>{MATTER_LABELS[a]}</Badge>
          ))}
        </div>
      </Card>
      <Card className="mt-4">
        <h2 className="font-semibold text-navy">Languages</h2>
        <p className="mt-2 text-sm text-ink">{lawyer.languages.join(", ")}</p>
      </Card>
      <Alert tone="info" title="Consultations">
        {lawyer.consultationNote}
      </Alert>
      <div className="mt-6 flex flex-wrap gap-3">
        <Button onClick={() => setModal(true)}>Request consultation</Button>
        <Link href="/lawyers">
          <Button variant="secondary">Back to list</Button>
        </Link>
      </div>
      <Sheet open={modal} onClose={() => setModal(false)} title="Not available in Phase 1">
        <p className="text-sm text-ink/90">
          This button is here so the citizen journey feels complete. No message is sent and no
          calendar is booked.
        </p>
        <Button className="mt-4" onClick={() => setModal(false)}>
          Close
        </Button>
      </Sheet>
    </div>
  );
}
