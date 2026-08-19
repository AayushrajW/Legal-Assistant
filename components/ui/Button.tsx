"use client";

import { cn } from "@/lib/cn";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger" | "ai" | "accent";
type Size = "md" | "lg" | "sm";

const variantClass: Record<Variant, string> = {
  primary:
    "bg-navy text-white hover:bg-navy-800 focus-visible:outline-navy shadow-sm",
  accent:
    "bg-accent text-white hover:bg-accent-600 focus-visible:outline-accent shadow-sm",
  secondary:
    "border border-border bg-surface text-navy hover:bg-navy/5 focus-visible:outline-navy",
  ghost: "text-navy hover:bg-navy/5 focus-visible:outline-navy",
  danger: "bg-danger text-white hover:bg-danger/90 focus-visible:outline-danger",
  ai: "bg-accent text-white hover:bg-accent-600 focus-visible:outline-accent",
};

const sizeClass: Record<Size, string> = {
  sm: "min-h-10 rounded-lg px-3 text-sm",
  md: "min-h-11 rounded-xl px-4 text-sm",
  lg: "min-h-12 rounded-xl px-5 text-base",
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
}

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex items-center justify-center gap-2 font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2",
        variantClass[variant],
        sizeClass[size],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
}

export function IconButton({ label, className, children, ...props }: IconButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      className={cn(
        "inline-flex min-h-11 min-w-11 items-center justify-center rounded-xl text-navy hover:bg-navy/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:opacity-50",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
