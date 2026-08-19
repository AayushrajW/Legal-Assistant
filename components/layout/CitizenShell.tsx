"use client";

import { IconButton } from "@/components/ui/Button";
import { DisclaimerBar } from "@/components/ui/Display";
import { useSession } from "@/hooks/useSession";
import { APP_NAME, CITIZEN_NAV } from "@/lib/constants";
import { cn } from "@/lib/cn";
import { authService } from "@/services";
import { Briefcase, FilePlus2, FolderOpen, Home, LogOut, Menu, Scale, X } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

const icons = {
  "/dashboard": Home,
  "/cases": FolderOpen,
  "/cases/new": FilePlus2,
  "/lawyers": Briefcase,
} as const;

export function CitizenShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useSession();
  const [open, setOpen] = useState(false);

  async function signOut() {
    await authService.signOut();
    router.push("/");
    router.refresh();
  }

  function isActive(href: string) {
    if (href === "/dashboard") return pathname === "/dashboard";
    if (href === "/cases/new") return pathname === "/cases/new";
    if (href === "/cases") return pathname.startsWith("/cases") && pathname !== "/cases/new";
    return pathname.startsWith(href);
  }

  const nav = (
    <nav aria-label="Citizen" className="flex flex-col gap-1">
      {CITIZEN_NAV.map((item) => {
        const Icon = icons[item.href];
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setOpen(false)}
            className={cn(
              "flex min-h-11 items-center gap-3 rounded-md px-3 text-sm font-medium",
              isActive(item.href) ? "bg-navy text-white" : "text-navy hover:bg-navy/5",
            )}
          >
            <Icon className="size-4" aria-hidden />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="flex min-h-screen bg-bg">
      <aside className="hidden w-60 shrink-0 border-r border-border bg-surface md:flex md:flex-col">
        <div className="flex items-center gap-2 border-b border-border px-4 py-4">
          <Scale className="size-5 text-navy" aria-hidden />
          <Link href="/dashboard" className="font-serif text-lg text-navy">
            {APP_NAME}
          </Link>
        </div>
        <div className="flex-1 p-3">{nav}</div>
        <div className="border-t border-border p-4 text-sm">
          <p className="font-medium text-navy">{user?.displayName ?? "Citizen"}</p>
          <p className="truncate text-demo">{user?.email}</p>
          <button
            type="button"
            onClick={() => void signOut()}
            className="mt-3 inline-flex min-h-11 items-center gap-2 text-navy"
          >
            <LogOut className="size-4" aria-hidden />
            Sign out
          </button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-border bg-surface px-3 py-2 md:hidden">
          <Link href="/dashboard" className="font-serif text-lg text-navy">
            {APP_NAME}
          </Link>
          <IconButton label={open ? "Close menu" : "Open menu"} onClick={() => setOpen((v) => !v)}>
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </IconButton>
        </header>
        {open ? (
          <div className="border-b border-border bg-surface p-3 md:hidden">
            {nav}
            <button
              type="button"
              onClick={() => void signOut()}
              className="mt-3 flex min-h-11 items-center gap-2 text-sm text-navy"
            >
              <LogOut className="size-4" /> Sign out
            </button>
          </div>
        ) : null}
        <main id="main" className="flex-1 pb-20 md:pb-0">
          {children}
        </main>
        <DisclaimerBar compact />
        <nav
          aria-label="Mobile"
          className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-4 border-t border-border bg-surface md:hidden"
        >
          {CITIZEN_NAV.map((item) => {
            const Icon = icons[item.href];
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex min-h-14 flex-col items-center justify-center gap-1 text-[11px] font-medium",
                  isActive(item.href) ? "text-navy" : "text-demo",
                )}
              >
                <Icon className="size-5" aria-hidden />
                {item.label === "Find an advocate" ? "Advocates" : item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
