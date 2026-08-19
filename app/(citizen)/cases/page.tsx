"use client";

import { CaseCard } from "@/components/cases/CaseCard";
import { Button } from "@/components/ui/Button";
import { EmptyState, Skeleton } from "@/components/ui/Display";
import { Select } from "@/components/ui/Field";
import { useSession } from "@/hooks/useSession";
import type { CaseRecord, CaseStatus } from "@/domain/case";
import { CASE_STATUS_LABEL } from "@/domain/case";
import { caseRepository } from "@/services";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

export default function CaseHistoryPage() {
  const { user } = useSession();
  const [cases, setCases] = useState<CaseRecord[] | null>(null);
  const [filter, setFilter] = useState<CaseStatus | "all">("all");

  useEffect(() => {
    if (!user) return;
    void caseRepository.listByCitizen(user.id).then((result) => {
      if (result.ok) setCases(result.data);
    });
  }, [user]);

  const visible = useMemo(() => {
    if (!cases) return [];
    if (filter === "all") return cases;
    return cases.filter((c) => c.status === filter);
  }, [cases, filter]);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl text-navy">Case history</h1>
          <p className="mt-1 text-sm text-demo">Sample and locally saved demo cases only.</p>
        </div>
        <Link href="/cases/new">
          <Button>New case</Button>
        </Link>
      </div>
      <div className="mt-6 max-w-xs">
        <Select
          id="status"
          label="Status"
          value={filter}
          onChange={(e) => setFilter(e.target.value as CaseStatus | "all")}
        >
          <option value="all">All</option>
          {(Object.keys(CASE_STATUS_LABEL) as CaseStatus[]).map((s) => (
            <option key={s} value={s}>
              {CASE_STATUS_LABEL[s]}
            </option>
          ))}
        </Select>
      </div>
      <div className="mt-6 grid gap-3">
        {cases === null ? <Skeleton className="h-24" /> : null}
        {cases && visible.length === 0 ? (
          <EmptyState title="Nothing in this list" body="Try another status, or start a new case." />
        ) : null}
        {visible.map((record) => (
          <CaseCard key={record.id} record={record} />
        ))}
      </div>
    </div>
  );
}
