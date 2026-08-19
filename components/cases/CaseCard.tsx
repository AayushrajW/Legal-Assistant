import { CASE_STATUS_LABEL, type CaseRecord } from "@/domain/case";
import { formatDate } from "@/lib/format";
import { Badge } from "@/components/ui/Display";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

function statusTone(status: CaseRecord["status"]) {
  if (status === "ready") return "success" as const;
  if (status === "needs_more_info") return "warning" as const;
  if (status === "processing") return "info" as const;
  if (status === "error") return "urgent" as const;
  return "neutral" as const;
}

export function CaseCard({ record }: { record: CaseRecord }) {
  const href =
    record.status === "processing"
      ? `/cases/${record.id}/processing`
      : `/cases/${record.id}`;
  return (
    <Link
      href={href}
      className="flex items-center gap-4 rounded-2xl border border-border bg-surface p-4 shadow-[0_8px_24px_rgb(21_27_75_/_0.06)] hover:border-accent/30"
    >
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="font-semibold text-navy">{record.title}</p>
          {record.isDemo ? <Badge tone="demo">Demo</Badge> : null}
        </div>
        <p className="mt-1 text-xs text-demo">
          {record.id} · Updated {formatDate(record.updatedAt)}
        </p>
      </div>
      <Badge tone={statusTone(record.status)}>{CASE_STATUS_LABEL[record.status]}</Badge>
      <ChevronRight className="size-5 shrink-0 text-demo" aria-hidden />
    </Link>
  );
}
