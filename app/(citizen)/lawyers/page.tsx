"use client";

import { Badge, Card, EmptyState } from "@/components/ui/Display";
import { Select } from "@/components/ui/Field";
import { Sheet } from "@/components/ui/Sheet";
import type { MatterCategory } from "@/domain/case";
import type { LawyerProfile } from "@/domain/lawyer";
import { MATTER_LABELS } from "@/lib/constants";
import { lawyerRepository } from "@/services";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

function LawyerCard({
  lawyer,
  onConsult,
}: {
  lawyer: LawyerProfile;
  onConsult: () => void;
}) {
  return (
    <Card>
      <Badge tone="demo">Demo profile</Badge>
      <h2 className="mt-2 font-serif text-xl text-navy">{lawyer.fullName}</h2>
      <p className="text-sm text-demo">
        {lawyer.city}, {lawyer.state}
        {lawyer.yearsExperience ? ` · ${lawyer.yearsExperience} years (sample)` : ""}
      </p>
      <p className="mt-3 text-sm text-ink/90">{lawyer.bio}</p>
      <div className="mt-3 flex flex-wrap gap-1">
        {lawyer.practiceAreas.map((a) => (
          <Badge key={a}>{MATTER_LABELS[a]}</Badge>
        ))}
      </div>
      <p className="mt-2 text-xs text-demo">Languages: {lawyer.languages.join(", ")}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        <Link href={`/lawyers/${lawyer.id}`}>
          <Button variant="secondary">View profile</Button>
        </Link>
        <Button variant="ghost" onClick={onConsult}>
          Request consultation
        </Button>
      </div>
    </Card>
  );
}

export default function LawyersPage() {
  const [lawyers, setLawyers] = useState<LawyerProfile[]>([]);
  const [city, setCity] = useState("all");
  const [area, setArea] = useState<MatterCategory | "all">("all");
  const [language, setLanguage] = useState("all");
  const [modal, setModal] = useState(false);

  useEffect(() => {
    void lawyerRepository.list().then((r) => {
      if (r.ok) setLawyers(r.data);
    });
  }, []);

  const cities = useMemo(() => [...new Set(lawyers.map((l) => l.city))], [lawyers]);
  const languages = useMemo(
    () => [...new Set(lawyers.flatMap((l) => l.languages))].sort(),
    [lawyers],
  );

  const filtered = lawyers.filter((l) => {
    if (city !== "all" && l.city !== city) return false;
    if (area !== "all" && !l.practiceAreas.includes(area)) return false;
    if (language !== "all" && !l.languages.includes(language)) return false;
    return true;
  });

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="font-serif text-3xl text-navy">Find an advocate</h1>
      <p className="mt-2 max-w-2xl text-sm text-demo">
        Preview only. These are fictional profiles so you can see how discovery might look. Matching,
        messaging, and bookings are not built yet.
      </p>
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <Select id="city" label="City" value={city} onChange={(e) => setCity(e.target.value)}>
          <option value="all">All cities</option>
          {cities.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </Select>
        <Select
          id="area"
          label="Practice area"
          value={area}
          onChange={(e) => setArea(e.target.value as MatterCategory | "all")}
        >
          <option value="all">All areas</option>
          {Object.entries(MATTER_LABELS).map(([k, v]) => (
            <option key={k} value={k}>
              {v}
            </option>
          ))}
        </Select>
        <Select
          id="lang"
          label="Language"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
        >
          <option value="all">All languages</option>
          {languages.map((l) => (
            <option key={l} value={l}>
              {l}
            </option>
          ))}
        </Select>
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {filtered.length === 0 ? (
          <EmptyState title="No sample profiles match" body="Clear a filter to see demo advocates again." />
        ) : (
          filtered.map((l) => (
            <LawyerCard key={l.id} lawyer={l} onConsult={() => setModal(true)} />
          ))
        )}
      </div>
      <Sheet open={modal} onClose={() => setModal(false)} title="Consultations come later">
        <p className="text-sm text-ink/90">
          Matching and consultations are not live in this prototype. In a later release you would
          request a time and the advocate would accept or decline.
        </p>
        <Button className="mt-4" onClick={() => setModal(false)}>
          Close
        </Button>
      </Sheet>
    </div>
  );
}
