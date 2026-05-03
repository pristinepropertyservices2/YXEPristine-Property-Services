"use client";

import { memo } from "react";
import Link from "next/link";
import { Phone } from "lucide-react";
import { HOME_PHONE_TEL } from "@/lib/home-data";
import { cn } from "@/lib/utils";

type StickyMobileCtaProps = {
  className?: string;
};

export const StickyMobileCta = memo(function StickyMobileCta({ className }: StickyMobileCtaProps) {
  return (
    <div
      className={cn(
        "fixed inset-x-0 bottom-0 z-[90] md:hidden",
        "border-t border-neutral-200/80 bg-white/95 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 shadow-[0_-8px_30px_rgba(0,0,0,0.08)] backdrop-blur-md",
        className
      )}
      role="region"
      aria-label="Quick actions"
    >
      <div className="container mx-auto flex gap-3 px-4">
        <a
          href={HOME_PHONE_TEL}
          className={cn(
            "flex min-h-12 flex-1 items-center justify-center gap-2 rounded-xl border-2 border-neutral-300",
            "bg-white text-base font-semibold text-neutral-900 active:bg-neutral-50"
          )}
        >
          <Phone className="h-5 w-5 shrink-0" aria-hidden />
          Call now
        </a>
        <Link
          href="/book"
          prefetch={false}
          className={cn(
            "flex min-h-12 flex-1 items-center justify-center rounded-xl text-base font-semibold",
            "bg-amber-500 text-neutral-950 shadow-md active:scale-[0.99] active:bg-amber-400"
          )}
        >
          Book now
        </Link>
      </div>
    </div>
  );
});
