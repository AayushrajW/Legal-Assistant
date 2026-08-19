"use client";

import { Button } from "@/components/ui/Button";
import { Alert, Badge, Card, Skeleton } from "@/components/ui/Display";
import { Sheet } from "@/components/ui/Sheet";
import type { LawyerProfile } from "@/domain/lawyer";
import { MATTER_LABELS } from "@/lib/constants";
import { lawyerRepository } from "@/services";
import { Star } from "lucide-react";
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
    <div className="mx-auto max-w-3xl px-4 py-8 pb-28">
      <p className="text-sm text-demo">
        <Link href="/lawyers" className="font-semibold text-accent">
          Lawyers
        </Link>{" "}
        / {lawyer.fullName}
      </p>
      <div className="mt-4 overflow-hidden rounded-3xl bg-navy px-6 py-10 text-white">
        <span className="flex size-16 items-center justify-center rounded-full bg-accent text-xl font-bold">
          {lawyer.initials ?? "A"}
        </span>
        <h1 className="mt-4 text-3xl font-extrabold">{lawyer.fullName}</h1>
        <p className="mt-1 text-white/75">
          {lawyer.city}, {lawyer.state}
        </p>
        <Badge tone="demo" className="mt-3 bg-white/15 text-white">
          Demo profile — not a real advocate
        </Badge>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3">
        <Card>
          <p className="text-xs text-demo">Sample experience</p>
          <p className="text-xl font-extrabold text-navy">{lawyer.yearsExperience ?? "—"} yrs</p>
        </Card>
        <Card>
          <p className="text-xs text-demo">Sample rating</p>
          <p className="flex items-center gap-1 text-xl font-extrabold text-navy">
            <Star className="size-5 fill-warning text-warning" />
            {lawyer.sampleRating ?? "—"}
          </p>
        </Card>
        {lawyer.sampleCasesHandledLabel ? (
          <Card>
            <p className="text-xs text-demo">Cases handled</p>
            <p className="text-xl font-extrabold text-navy">{lawyer.sampleCasesHandledLabel}</p>
          </Card>
        ) : null}
        {lawyer.sampleSuccessRateLabel ? (
          <Card>
            <p className="text-xs text-demo">Success rate</p>
            <p className="text-xl font-extrabold text-navy">{lawyer.sampleSuccessRateLabel}</p>
          </Card>
        ) : null}
      </div>
      <Card className="mt-4">
        <h2 className="font-bold text-navy">About me</h2>
        <p className="mt-2 text-ink/90">{lawyer.bio}</p>
      </Card>
      <Card className="mt-4">
        <h2 className="font-bold text-navy">Practice areas</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {lawyer.practiceAreas.map((a) => (
            <Badge key={a}>{MATTER_LABELS[a]}</Badge>
          ))}
        </div>
      </Card>
      <Alert tone="info" title="Consultations">
        {lawyer.consultationNote}
      </Alert>
      <div className="fixed inset-x-0 bottom-16 z-30 flex gap-2 border-t border-border bg-surface p-3 md:static md:mt-6 md:border-0 md:p-0">
        <Button className="flex-1" variant="accent" onClick={() => setModal(true)}>
          Request Consultation
        </Button>
        <Link href="/bookmarks" className="flex-1">
          <Button className="w-full" variant="secondary">
            Save Lawyer
          </Button>
        </Link>
      </div>
      <Sheet open={modal} onClose={() => setModal(false)} title="Not available yet">
        <p className="text-sm text-ink/90">
          No message is sent and no calendar is booked. This is layout only.
        </p>
        <Button className="mt-4" variant="accent" onClick={() => setModal(false)}>
          Close
        </Button>
      </Sheet>
    </div>
  );
}
