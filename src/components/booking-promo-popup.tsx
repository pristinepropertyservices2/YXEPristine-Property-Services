"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { buttonVariants } from "@/components/ui/button";
import { HOME_PHONE_DISPLAY, HOME_PHONE_TEL } from "@/lib/home-data";
import { HOUSECALL_PRO_BOOKING_URL, openHousecallBooking } from "@/lib/housecall-pro";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "yxe-booking-promo-dismissed";
const SHOW_DELAY_MS = 1800;

/** Paths where the promo popup should not appear */
const SKIP_PREFIXES = ["/book", "/auth", "/admin", "/dashboard", "/reset-password", "/forgot-password"];

export function BookingPromoPopup() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (SKIP_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`))) {
      setOpen(false);
      return;
    }

    try {
      if (sessionStorage.getItem(STORAGE_KEY) === "1") return;
    } catch {
      /* ignore */
    }

    const timer = window.setTimeout(() => setOpen(true), SHOW_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, [pathname]);

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    if (!next) {
      try {
        sessionStorage.setItem(STORAGE_KEY, "1");
      } catch {
        /* ignore */
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        showCloseButton
        className="max-w-[min(100%-2rem,28rem)] gap-0 rounded-none border-0 bg-white px-8 py-10 text-center shadow-xl sm:max-w-md sm:px-12 sm:py-12"
      >
        <DialogHeader className="space-y-0 text-center sm:text-center">
          <DialogTitle className="text-balance text-[1.35rem] font-medium italic leading-snug tracking-tight text-[#0077BE] sm:text-[1.5rem]">
            Carpet &amp; Air Duct Cleaning in Saskatoon, Saskatchewan
          </DialogTitle>
          <DialogDescription className="mt-5 text-pretty text-base leading-relaxed text-neutral-700 sm:text-[1.05rem]">
            Our all-natural cleaning formulas safely clean your carpet, upholstery, or air ducts and
            dry in about an hour.
          </DialogDescription>
        </DialogHeader>

        <a
          href={HOME_PHONE_TEL}
          className="mt-6 inline-block text-xl font-bold tracking-wide text-[#0077BE] hover:underline sm:text-2xl"
        >
          {HOME_PHONE_DISPLAY}
        </a>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center sm:gap-4">
          <a
            href={HOME_PHONE_TEL}
            className={cn(
              buttonVariants({ size: "lg" }),
              "min-h-11 flex-1 rounded-md bg-[#0077BE] px-8 text-base font-semibold text-white hover:bg-[#0066a3] sm:flex-none"
            )}
          >
            Call Us
          </a>
          <a
            href={HOUSECALL_PRO_BOOKING_URL}
            onClick={(e) => {
              e.preventDefault();
              handleOpenChange(false);
              openHousecallBooking();
            }}
            className={cn(
              buttonVariants({ size: "lg" }),
              "min-h-11 flex-1 rounded-md bg-[#0077BE] px-8 text-base font-semibold text-white hover:bg-[#0066a3] sm:flex-none"
            )}
          >
            Book Online
          </a>
        </div>
      </DialogContent>
    </Dialog>
  );
}
