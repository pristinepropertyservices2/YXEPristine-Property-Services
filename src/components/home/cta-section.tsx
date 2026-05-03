"use client";

import { memo, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { SECTION_H2, SECTION_LEAD } from "@/lib/home-layout";

type CTASectionProps = {
  id?: string;
  title: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
  innerClassName?: string;
  variant?: "muted" | "brand" | "dark";
};

const shell: Record<NonNullable<CTASectionProps["variant"]>, string> = {
  muted: "border-y border-neutral-200/80 bg-neutral-100/90",
  brand: "border-y border-amber-200/60 bg-gradient-to-r from-amber-50 via-white to-amber-50/80",
  dark: "bg-neutral-900 text-white",
};

export const CTASection = memo(function CTASection({
  id,
  title,
  subtitle,
  children,
  className,
  innerClassName,
  variant = "muted",
}: CTASectionProps) {
  return (
    <section
      id={id}
      className={cn("py-10 md:py-14", shell[variant], className)}
      aria-labelledby={id ? `${id}-heading` : undefined}
    >
      <div className={cn("container mx-auto flex flex-col items-center gap-6 px-4 text-center md:gap-8", innerClassName)}>
        <h2
          id={id ? `${id}-heading` : undefined}
          className={cn(SECTION_H2, variant === "dark" ? "text-white" : "text-neutral-900", "max-w-2xl")}
        >
          {title}
        </h2>
        {subtitle ? (
          <p className={cn(SECTION_LEAD, "max-w-xl", variant === "dark" && "text-neutral-200")}>{subtitle}</p>
        ) : null}
        <div className="flex w-full max-w-lg flex-col gap-3 sm:max-w-none sm:flex-row sm:flex-wrap sm:justify-center sm:gap-4">
          {children}
        </div>
      </div>
    </section>
  );
});
