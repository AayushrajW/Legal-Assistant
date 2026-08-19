import { Card } from "@/components/ui/Display";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

export function ComingSoon({
  title,
  body,
}: {
  title: string;
  body: string;
}) {
  return (
    <div className="mx-auto max-w-lg px-4 py-16">
      <Card>
        <p className="text-xs font-semibold uppercase tracking-wide text-accent">Preview</p>
        <h1 className="mt-2 text-2xl font-extrabold text-navy">{title}</h1>
        <p className="mt-3 text-sm text-ink/80">{body}</p>
        <Link href="/dashboard" className="mt-6 inline-block">
          <Button variant="accent">Back to dashboard</Button>
        </Link>
      </Card>
    </div>
  );
}
