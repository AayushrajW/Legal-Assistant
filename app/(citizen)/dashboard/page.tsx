"use client";

import { CaseCard } from "@/components/cases/CaseCard";
import { Button, IconButton } from "@/components/ui/Button";
import { Alert, Card, EmptyState, Skeleton } from "@/components/ui/Display";
import { useSession } from "@/hooks/useSession";
import { firstName, greetingForNow } from "@/lib/greeting";
import { caseRepository } from "@/services";
import type { CaseRecord } from "@/domain/case";
import { Bell, Briefcase, FileSearch, MessageCircle, Plus, Search } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

const ACTIONS = [
  {
    href: "/cases/new",
    title: "Understand a Document",
    cta: "Upload now",
    icon: FileSearch,
    tint: "bg-info/15 text-info",
  },
  {
    href: "/cases/new",
    title: "Describe a Legal Problem",
    cta: "Start now",
    icon: Search,
    tint: "bg-warning/15 text-warning",
  },
  {
    href: "/cases",
    title: "AI Legal Assistant",
    cta: "Ask now",
    icon: MessageCircle,
    tint: "bg-accent/15 text-accent",
  },
  {
    href: "/lawyers",
    title: "Find a Lawyer",
    cta: "Browse now",
    icon: Briefcase,
    tint: "bg-success/15 text-success",
  },
];

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

  const stats = useMemo(() => {
    const list = cases ?? [];
    return {
      active: list.filter((c) => c.status !== "error").length,
      awaiting: list.filter((c) => c.status === "needs_more_info").length,
      complete: list.filter((c) => c.status === "ready").length,
    };
  }, [cases]);

  if (!ready) {
    return (
      <div className="space-y-3 p-6">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-28 w-full" />
      </div>
    );
  }

  const recent = cases?.slice(0, 4) ?? [];

  return (
    <div className="px-4 py-6 lg:px-8">
      <div className="mb-6 md:hidden">
        <label htmlFor="help-search" className="sr-only">
          How can we help you today?
        </label>
        <form action="/cases/new" className="flex min-h-12 items-center gap-2 rounded-2xl border border-border bg-surface px-4 shadow-[0_8px_24px_rgb(21_27_75_/_0.06)]">
          <Search className="size-4 text-demo" aria-hidden />
          <input
            id="help-search"
            name="q"
            className="w-full bg-transparent text-sm outline-none"
            placeholder="How can we help you today?"
          />
        </form>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-extrabold text-navy md:text-3xl">
          {greetingForNow()}, {firstName(user?.displayName)}!{" "}
          <span aria-hidden>👋</span>
        </h1>
        <div className="flex items-center gap-2">
          <Link href="/messages">
            <IconButton label="Notifications" className="bg-surface shadow-sm">
              <Bell className="size-5" />
            </IconButton>
          </Link>
          <Link href="/cases/new">
            <Button variant="accent">
              <Plus className="size-4" aria-hidden />
              New Case
            </Button>
          </Link>
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {ACTIONS.map((action) => (
          <Link
            key={action.title}
            href={action.href}
            className="rounded-2xl border border-border bg-surface p-5 shadow-[0_8px_24px_rgb(21_27_75_/_0.06)] hover:border-accent/30"
          >
            <span className={`inline-flex size-11 items-center justify-center rounded-2xl ${action.tint}`}>
              <action.icon className="size-5" aria-hidden />
            </span>
            <p className="mt-4 font-bold text-navy">{action.title}</p>
            <p className="mt-2 text-sm font-semibold text-accent">
              {action.cta} →
            </p>
          </Link>
        ))}
      </div>

      {error ? (
        <div className="mt-6">
          <Alert tone="danger" title="Could not load cases">
            {error}
          </Alert>
        </div>
      ) : null}

      <div className="mt-8 grid gap-6 xl:grid-cols-[minmax(0,1fr)_300px]">
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-navy">Your Cases</h2>
            <Link href="/cases" className="text-sm font-semibold text-accent">
              See all
            </Link>
          </div>
          <div className="grid gap-3">
            {cases === null && !error ? <Skeleton className="h-24" /> : null}
            {cases && recent.length === 0 ? (
              <EmptyState
                title="No cases yet"
                body="Create a case from a notice, contract photo, or a short description of what happened."
                action={
                  <Link href="/cases/new">
                    <Button variant="accent">Create a case</Button>
                  </Link>
                }
              />
            ) : null}
            {recent.map((record) => (
              <CaseCard key={record.id} record={record} />
            ))}
          </div>
        </section>

        <aside className="space-y-4">
          <Card>
            <h2 className="font-bold text-navy">At a Glance</h2>
            <dl className="mt-4 grid grid-cols-3 gap-2 text-center">
              <div>
                <dt className="text-xs text-demo">Active</dt>
                <dd className="text-xl font-extrabold text-navy">{stats.active}</dd>
              </div>
              <div>
                <dt className="text-xs text-demo">Awaiting</dt>
                <dd className="text-xl font-extrabold text-warning">{stats.awaiting}</dd>
              </div>
              <div>
                <dt className="text-xs text-demo">Ready</dt>
                <dd className="text-xl font-extrabold text-success">{stats.complete}</dd>
              </div>
            </dl>
          </Card>
          <Card className="border-warning/30 bg-warning/10">
            <p className="text-xs font-semibold uppercase tracking-wide text-warning">Upcoming deadline</p>
            <p className="mt-2 font-bold text-navy">Check dates on an open case</p>
            <p className="mt-1 text-sm text-ink/80">
              Open a case to see sample deadlines. NyayaSetu does not file anything for you.
            </p>
            <Link href="/cases" className="mt-3 inline-block text-sm font-semibold text-navy">
              View cases →
            </Link>
          </Card>
          <Card>
            <h2 className="font-bold text-navy">Need a person today?</h2>
            <p className="mt-2 text-sm text-ink/80">
              Legal aid:{" "}
              <a className="font-semibold text-accent" href="https://nalsa.gov.in/">
                nalsa.gov.in
              </a>
              . Courts:{" "}
              <a className="font-semibold text-accent" href="https://ecourts.gov.in/">
                ecourts.gov.in
              </a>
              .
            </p>
          </Card>
        </aside>
      </div>
    </div>
  );
}
