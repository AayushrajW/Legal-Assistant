import { APP_NAME, APP_TAGLINE } from "@/lib/constants";
import { Scale } from "lucide-react";
import Link from "next/link";

export function BrandMark({
  inverted = false,
  href = "/dashboard",
}: {
  inverted?: boolean;
  href?: string;
}) {
  return (
    <Link href={href} className="flex items-center gap-3">
      <span className="flex size-10 items-center justify-center rounded-xl bg-accent text-white">
        <Scale className="size-5" aria-hidden />
      </span>
      <span className="leading-tight">
        <span className={`block text-base font-extrabold ${inverted ? "text-white" : "text-navy"}`}>
          {APP_NAME}
        </span>
        <span className={`block text-[11px] font-medium ${inverted ? "text-white/70" : "text-demo"}`}>
          {APP_TAGLINE}
        </span>
      </span>
    </Link>
  );
}
