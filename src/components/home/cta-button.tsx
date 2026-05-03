"use client";

import { memo, type ReactNode } from "react";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type CTAButtonVariant = "accent" | "neutral" | "outline" | "ghostLight";

const variantClass: Record<CTAButtonVariant, string> = {
  accent: cn(
    "bg-amber-500 text-neutral-950 shadow-md hover:bg-amber-400 hover:shadow-lg",
    "focus-visible:ring-2 focus-visible:ring-amber-300 focus-visible:ring-offset-2"
  ),
  neutral: cn(
    "border border-neutral-300 bg-white text-neutral-900 shadow-sm hover:bg-neutral-50 hover:shadow-md"
  ),
  outline: cn(
    "border-2 border-purple-800/25 bg-transparent text-purple-950 hover:border-purple-700/40 hover:bg-purple-50/80"
  ),
  ghostLight: cn(
    "border-2 border-white/85 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20 hover:text-white"
  ),
};

export type CTAButtonProps = {
  children: ReactNode;
  href?: string;
  variant?: CTAButtonVariant;
  className?: string;
  type?: "button" | "submit";
  onClick?: () => void;
  prefetch?: boolean;
};

export const CTAButton = memo(function CTAButton({
  children,
  href,
  variant = "accent",
  className,
  type = "button",
  onClick,
  prefetch = true,
}: CTAButtonProps) {
  const base = cn(
    buttonVariants({ size: "lg" }),
    "inline-flex min-h-12 items-center justify-center gap-2 px-6 text-base font-semibold transition-[box-shadow,transform,background-color,border-color]",
    "active:scale-[0.98]",
    variantClass[variant],
    className
  );

  if (href) {
    if (href.startsWith("tel:") || href.startsWith("mailto:")) {
      return (
        <a href={href} className={base}>
          {children}
        </a>
      );
    }
    return (
      <Link href={href} prefetch={prefetch} className={base}>
        {children}
      </Link>
    );
  }

  return (
    <Button type={type} className={base} onClick={onClick}>
      {children}
    </Button>
  );
});
