import { Card } from "@/components/ui/Display";

export default function LegalAidPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-3xl font-extrabold text-navy">Legal Aid & Authorities</h1>
      <p className="mt-2 text-sm text-demo">
        If you cannot afford a private advocate, start with official legal-aid bodies.
      </p>
      <Card className="mt-6">
        <p className="font-bold text-navy">National Legal Services Authority</p>
        <p className="mt-2 text-sm text-ink/80">
          NALSA publishes information about free legal services for eligible people.
        </p>
        <a className="mt-3 inline-block text-sm font-semibold text-accent" href="https://nalsa.gov.in/">
          nalsa.gov.in →
        </a>
      </Card>
    </div>
  );
}
