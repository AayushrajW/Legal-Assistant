import { Card } from "@/components/ui/Display";

export default function ResourcesPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-3xl font-extrabold text-navy">Legal Resources</h1>
      <p className="mt-2 text-sm text-demo">Official starting points. This is not legal advice.</p>
      <div className="mt-6 grid gap-4">
        <Card>
          <p className="font-bold text-navy">India Code</p>
          <a className="mt-2 inline-block text-sm font-semibold text-accent" href="https://www.indiacode.nic.in/">
            indiacode.nic.in →
          </a>
        </Card>
        <Card>
          <p className="font-bold text-navy">eCourts Services</p>
          <a className="mt-2 inline-block text-sm font-semibold text-accent" href="https://ecourts.gov.in/">
            ecourts.gov.in →
          </a>
        </Card>
        <Card>
          <p className="font-bold text-navy">National Consumer Helpline</p>
          <a className="mt-2 inline-block text-sm font-semibold text-accent" href="https://consumerhelpline.gov.in/">
            consumerhelpline.gov.in →
          </a>
        </Card>
      </div>
    </div>
  );
}
