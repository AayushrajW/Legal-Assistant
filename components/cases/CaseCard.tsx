import { CASE_STATUS_LABEL, type CaseRecord } from "@/domain/case";
import { MATTER_LABELS } from "@/lib/constants";
import { formatDate } from "@/lib/format";
import { Badge } from "@/components/ui/Display";
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
      className="block rounded-lg border border-border bg-surface p-4 hover:border-navy/30"
    >
      <div className="flex flex-wrap items-center gap-2">
        <Badge tone="demo">Demo</Badge>
        <Badge tone={statusTone(record.status)}>{CASE_STATUS_LABEL[record.status]}</Badge>
        <span className="text-xs text-demo">{MATTER_LABELS[record.category]}</span>
      </div>
      <p className="mt-2 font-medium text-navy">{record.title}</p>
      <p className="mt-1 text-sm text-demo">
        {record.location?.city ? `${record.location.city} · ` : ""}
        Updated {formatDate(record.updatedAt)}
      </p>
    </Link>
  );
}
