"use client";

import { type ReactNode } from "react";
import { buttonVariants } from "@/components/ui/button";
import { HOUSECALL_PRO_BOOKING_URL, openHousecallBooking } from "@/lib/housecall-pro";
import { cn } from "@/lib/utils";

type BookOnlineButtonProps = {
  children?: ReactNode;
  className?: string;
  /** Use for visually hidden / sr-friendly labels when children are enough */
};

/**
 * Opens the Housecall Pro booking modal (falls back to their hosted booking page).
 */
export function BookOnlineButton({
  children = "Book Online",
  className,
}: BookOnlineButtonProps) {
  return (
    <a
      href={HOUSECALL_PRO_BOOKING_URL}
      className={cn(className)}
      onClick={(e) => {
        e.preventDefault();
        openHousecallBooking();
      }}
    >
      {children}
    </a>
  );
}

/** Prefixed styles for common amber CTA usage */
export function bookOnlineButtonClassName(extra?: string) {
  return cn(
    buttonVariants({ size: "sm" }),
    "bg-amber-500 font-semibold text-neutral-950 hover:bg-amber-400",
    extra
  );
}
