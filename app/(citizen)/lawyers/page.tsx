"use client";

import { LawyerCard } from "@/components/lawyers/LawyerCard";
import { EmptyState } from "@/components/ui/Display";
import { Select } from "@/components/ui/Field";
import type { MatterCategory } from "@/domain/case";
import type { LawyerProfile } from "@/domain/lawyer";
import { MATTER_LABELS } from "@/lib/constants";
import { lawyerRepository } from "@/services";
import { useEffect, useMemo, useState } from "react";

export default function LawyersPage() {
  const [lawyers, setLawyers] = useState<LawyerProfile[]>([]);
  const [city, setCity] = useState("all");
  const [area, setArea] = useState<MatterCategory | "all">("all");
  const [language, setLanguage] = useState("all");

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
    <div className="px-4 py-8 lg:px-8">
      <h1 className="text-3xl font-extrabold text-navy">Lawyers matched for you</h1>
      <p className="mt-2 max-w-2xl text-sm text-demo">
        Sample layout only. Match percentages and fees are fictional. No live matching or booking.
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
      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        {filtered.length === 0 ? (
          <EmptyState title="No sample profiles match" body="Clear a filter to see demo advocates again." />
        ) : (
          filtered.map((l) => <LawyerCard key={l.id} lawyer={l} />)
        )}
      </div>
    </div>
  );
}
