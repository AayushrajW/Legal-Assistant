"use client";

import { BrandMark } from "@/components/layout/BrandMark";
import { ModeBanner } from "@/components/layout/ModeBanner";
import { IconButton } from "@/components/ui/Button";
import { DisclaimerBar } from "@/components/ui/Display";
import { useSession } from "@/hooks/useSession";
import { CITIZEN_NAV, MOBILE_NAV } from "@/lib/constants";
import { cn } from "@/lib/cn";
import { authService } from "@/services";
import {
  Bookmark,
  Briefcase,
  FileText,
  FolderOpen,
  Home,
  Landmark,
  Library,
  LogOut,
  Menu,
  MessageSquare,
  Settings,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import type { LucideIcon } from "lucide-react";

const icons: Record<string, LucideIcon> = {
  "/dashboard": Home,
  "/cases": FolderOpen,
  "/messages": MessageSquare,
  "/lawyers": Briefcase,
  "/resources": Library,
  "/legal-aid": Landmark,
  "/documents": FileText,
  "/bookmarks": Bookmark,
  "/settings": Settings,
};

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
    if (href === "/cases") return pathname.startsWith("/cases");
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  const nav = (
    <nav aria-label="Citizen" className="flex flex-col gap-1">
      {CITIZEN_NAV.map((item) => {
        const Icon = icons[item.href] ?? Home;
        const active = isActive(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setOpen(false)}
            className={cn(
              "flex min-h-12 items-center gap-3 rounded-xl px-3 text-sm font-medium",
              active ? "bg-white/15 text-white" : "text-white/70 hover:bg-white/10 hover:text-white",
            )}
          >
            <Icon className="size-5" aria-hidden />
            <span className="flex-1">{item.label}</span>
            {"badge" in item && item.badge ? (
              <span
                title="Preview badge — messaging is not live"
                className="rounded-full bg-danger px-1.5 text-[10px] font-bold text-white"
              >
                1
              </span>
            ) : null}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="flex min-h-screen bg-bg">
      <aside className="sticky top-0 hidden h-svh w-[260px] shrink-0 bg-sidebar text-white md:flex md:flex-col">
        <div className="px-4 py-5">
          <BrandMark inverted />
        </div>
        <div className="flex-1 px-3">{nav}</div>
        <div className="border-t border-white/10 p-4">
          <div className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-full bg-accent text-sm font-bold">
              {(user?.displayName ?? "C").slice(0, 1)}
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">{user?.displayName ?? "Citizen"}</p>
              <p className="truncate text-xs text-white/60">{user?.email}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => void signOut()}
            className="mt-3 inline-flex min-h-10 items-center gap-2 text-sm text-white/80 hover:text-white"
          >
            <LogOut className="size-4" aria-hidden />
            Sign out
          </button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-border bg-surface px-3 py-2 md:hidden">
          <BrandMark />
          <IconButton label={open ? "Close menu" : "Open menu"} onClick={() => setOpen((v) => !v)}>
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </IconButton>
        </header>
        {open ? (
          <div className="bg-sidebar p-3 md:hidden">{nav}</div>
        ) : null}
        <ModeBanner />
        <main id="main" className="flex-1 pb-20 md:pb-0">
          {children}
        </main>
        <DisclaimerBar />
        <nav
          aria-label="Mobile"
          className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-4 border-t border-border bg-surface md:hidden"
        >
          {MOBILE_NAV.map((item) => {
            const Icon = icons[item.href] ?? Home;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex min-h-14 flex-col items-center justify-center gap-1 text-[11px] font-semibold",
                  isActive(item.href) ? "text-accent" : "text-demo",
                )}
              >
                <Icon className="size-5" aria-hidden />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
