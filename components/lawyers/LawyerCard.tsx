"use client";

import { Button } from "@/components/ui/Button";
import { Badge, Card } from "@/components/ui/Display";
import { Sheet } from "@/components/ui/Sheet";
import type { LawyerProfile } from "@/domain/lawyer";
import { MATTER_LABELS } from "@/lib/constants";
import { Check, Star } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export function LawyerCard({ lawyer }: { lawyer: LawyerProfile }) {
  const [modal, setModal] = useState(false);

  return (
    <>
      <Card>
        <div className="flex gap-4">
          <span className="flex size-14 shrink-0 items-center justify-center rounded-full bg-navy text-lg font-bold text-white">
            {lawyer.initials ?? lawyer.fullName.slice(0, 1)}
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="font-bold text-navy">{lawyer.fullName}</h2>
              <Badge tone="demo">Demo</Badge>
              {lawyer.sampleMatchPercent ? (
                <Badge tone="success">{lawyer.sampleMatchPercent}% sample match</Badge>
              ) : null}
            </div>
            <p className="mt-1 text-sm text-demo">
              {MATTER_LABELS[lawyer.practiceAreas[0]]} · {lawyer.city}
              {lawyer.yearsExperience ? ` · ${lawyer.yearsExperience} yrs` : ""}
            </p>
            {lawyer.sampleRating ? (
              <p className="mt-1 flex items-center gap-1 text-sm font-semibold text-navy">
                <Star className="size-4 fill-warning text-warning" aria-hidden />
                {lawyer.sampleRating}
                <span className="font-medium text-demo">sample rating</span>
              </p>
            ) : null}
            {lawyer.sampleFeeLabel ? (
              <p className="mt-1 text-sm text-ink">{lawyer.sampleFeeLabel}</p>
            ) : null}
          </div>
        </div>
        {lawyer.sampleMatchReasons?.length ? (
          <div className="mt-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-demo">Why shown (sample)</p>
            <ul className="mt-2 space-y-1 text-sm text-ink">
              {lawyer.sampleMatchReasons.map((reason) => (
                <li key={reason} className="flex items-center gap-2">
                  <Check className="size-4 text-success" aria-hidden />
                  {reason}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
        <div className="mt-4 flex flex-wrap gap-2">
          <Link href={`/lawyers/${lawyer.id}`}>
            <Button variant="secondary">View Profile</Button>
          </Link>
          <Button variant="accent" onClick={() => setModal(true)}>
            Request Consultation
          </Button>
        </div>
      </Card>
      <Sheet open={modal} onClose={() => setModal(false)} title="Consultations come later">
        <p className="text-sm text-ink/90">
          Matching and consultations are not live. This button is part of the companion layout.
        </p>
        <Button className="mt-4" variant="accent" onClick={() => setModal(false)}>
          Close
        </Button>
      </Sheet>
    </>
  );
}
