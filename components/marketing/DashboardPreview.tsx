import { Bell, FileSearch, Plus, Search } from "lucide-react";

/** Static marketing illustration of the companion dashboard. Not interactive. */
export function DashboardPreview() {
  return (
    <div
      aria-hidden
      className="overflow-hidden rounded-2xl border border-border bg-bg shadow-card"
    >
      <div className="flex min-h-[22rem]">
        <div className="hidden w-20 shrink-0 flex-col gap-3 bg-sidebar p-3 sm:flex">
          <span className="size-8 rounded-lg bg-accent" />
          <span className="h-8 rounded-lg bg-white/15" />
          <span className="h-8 rounded-lg bg-white/10" />
          <span className="h-8 rounded-lg bg-white/10" />
        </div>
        <div className="flex-1 p-4">
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm font-extrabold text-navy">Good morning, Meera! 👋</p>
            <span className="inline-flex items-center gap-1 rounded-xl bg-accent px-2.5 py-1 text-[11px] font-bold text-white">
              <Plus className="size-3" /> New Case
            </span>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2">
            {[
              { title: "Understand a Document", tint: "bg-info/15 text-info", icon: FileSearch },
              { title: "Describe a Legal Problem", tint: "bg-warning/15 text-warning", icon: Search },
            ].map((item) => (
              <div key={item.title} className="rounded-xl border border-border bg-surface p-3 shadow-card">
                <span className={`inline-flex size-8 items-center justify-center rounded-lg ${item.tint}`}>
                  <item.icon className="size-4" />
                </span>
                <p className="mt-2 text-xs font-bold text-navy">{item.title}</p>
                <p className="mt-1 text-[11px] font-semibold text-accent">Start now →</p>
              </div>
            ))}
          </div>
          <div className="mt-3 rounded-xl border border-border bg-surface p-3 shadow-card">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold text-navy">Security deposit dispute</p>
              <span className="rounded-full bg-info/10 px-2 py-0.5 text-[10px] font-semibold text-info">
                In Progress
              </span>
            </div>
            <p className="mt-1 text-[11px] text-demo">NS-2041 · Updated today</p>
          </div>
          <div className="mt-3 flex items-center gap-2 rounded-xl border border-warning/30 bg-warning/10 p-3">
            <Bell className="size-4 text-warning" />
            <p className="text-[11px] font-semibold text-navy">Upcoming deadline · sample date</p>
          </div>
        </div>
      </div>
    </div>
  );
}
