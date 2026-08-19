"use client";

import { CaseCard } from "@/components/cases/CaseCard";
import { Button } from "@/components/ui/Button";
import { Alert, EmptyState, Skeleton } from "@/components/ui/Display";
import { useSession } from "@/hooks/useSession";
import { caseRepository } from "@/services";
import type { CaseRecord } from "@/domain/case";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const { user, ready } = useSession();
  const [cases, setCases] = useState<CaseRecord[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    void caseRepository.listByCitizen(user.id).then((result) => {
      if (!result.ok) {
        setError(result.message);
        return;
      }
      setCases(result.data);
    });
  }, [user]);

  if (!ready) {
    return (
      <div className="space-y-3 p-6">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-28 w-full" />
      </div>
    );
  }

  const recent = cases?.slice(0, 3) ?? [];

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <p className="text-sm text-demo">Namaste{user ? `, ${user.displayName}` : ""}</p>
      <h1 className="mt-1 font-serif text-3xl text-navy">Your cases</h1>
      <p className="mt-2 max-w-2xl text-ink/85">
        Start with a paper or a story. NyayaSetu will organise it in plain language. This is a demo
        — nothing is sent to a court or an advocate.
      </p>
      <div className="mt-6">
        <Link href="/cases/new">
          <Button size="lg">Start a new case</Button>
        </Link>
      </div>

      {error ? (
        <div className="mt-6">
          <Alert tone="danger" title="Could not load cases">
            {error}
          </Alert>
        </div>
      ) : null}

      <h2 className="mt-10 font-serif text-xl text-navy">Continue</h2>
      <div className="mt-4 grid gap-3">
        {cases === null && !error ? <Skeleton className="h-24" /> : null}
        {cases && recent.length === 0 ? (
          <EmptyState
            title="No cases yet"
            body="Create a case from a notice, contract photo, or a short description of what happened."
            action={
              <Link href="/cases/new">
                <Button>Create a case</Button>
              </Link>
            }
          />
        ) : null}
        {recent.map((record) => (
          <CaseCard key={record.id} record={record} />
        ))}
      </div>

      <aside className="mt-10 rounded-lg border border-border bg-surface p-5">
        <h2 className="font-semibold text-navy">If you need a person today</h2>
        <p className="mt-2 text-sm text-ink/85">
          Legal aid:{" "}
          <a className="font-medium text-navy underline-offset-2 hover:underline" href="https://nalsa.gov.in/">
            nalsa.gov.in
          </a>
          . Court information:{" "}
          <a className="font-medium text-navy underline-offset-2 hover:underline" href="https://ecourts.gov.in/">
            ecourts.gov.in
          </a>
          . Sample advocate listings in this app are not a live directory.
        </p>
      </aside>
    </div>
  );
}
