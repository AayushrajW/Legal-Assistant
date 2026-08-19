import { cn } from "@/lib/cn";
import type { HTMLAttributes, ReactNode } from "react";

type Tone = "info" | "success" | "warning" | "urgent" | "demo" | "ai" | "neutral";

const tones: Record<Tone, string> = {
  info: "bg-info/10 text-info",
  success: "bg-success/10 text-success",
  warning: "bg-warning/10 text-warning",
  urgent: "bg-danger/10 text-danger",
  demo: "bg-navy/10 text-demo",
  ai: "bg-ai/10 text-ai",
  neutral: "bg-navy/5 text-navy",
};

export function Badge({
  tone = "neutral",
  className,
  children,
}: {
  tone?: Tone;
  className?: string;
  children: ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

export function Card({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("rounded-2xl border border-border bg-surface p-5 shadow-card", className)}
      {...props}
    >
      {children}
    </div>
  );
}

export function Section({
  id,
  title,
  description,
  children,
  actions,
}: {
  id?: string;
  title: string;
  description?: string;
  children: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24 space-y-3">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-navy">{title}</h2>
          {description ? <p className="mt-1 text-sm text-demo">{description}</p> : null}
        </div>
        {actions}
      </div>
      {children}
    </section>
  );
}

export function EmptyState({
  title,
  body,
  action,
}: {
  title: string;
  body: string;
  action?: ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-border bg-surface px-6 py-10 text-center">
      <p className="font-medium text-navy">{title}</p>
      <p className="mx-auto mt-2 max-w-md text-sm text-demo">{body}</p>
      {action ? <div className="mt-5 flex justify-center">{action}</div> : null}
    </div>
  );
}

type AlertTone = "info" | "success" | "warning" | "danger";

const alertClass: Record<AlertTone, string> = {
  info: "border-info/30 bg-info/8 text-ink",
  success: "border-success/30 bg-success/8 text-ink",
  warning: "border-warning/35 bg-warning/10 text-ink",
  danger: "border-danger/30 bg-danger/8 text-ink",
};

export function Alert({
  tone = "info",
  title,
  children,
}: {
  tone?: AlertTone;
  title: string;
  children?: ReactNode;
}) {
  return (
    <div
      role={tone === "danger" ? "alert" : "status"}
      className={cn("rounded-xl border px-4 py-3 text-sm", alertClass[tone])}
    >
      <p className="font-semibold text-navy">{title}</p>
      {children ? <div className="mt-1 text-ink/90">{children}</div> : null}
    </div>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-2xl bg-navy/10", className)} />;
}

export function DisclaimerBar() {
  return (
    <p className="border-t border-border bg-navy/[0.03] px-4 py-2 text-xs text-demo">
      NyayaSetu explains and organises information. It is not a lawyer and does not give
      legal advice.
    </p>
  );
}
