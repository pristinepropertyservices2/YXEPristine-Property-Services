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

const SHOW_DELAY_MS = 1500;

export function BookingPromoPopup() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // Show on the homepage (including full refresh)
    if (pathname !== "/") {
      setOpen(false);
      return;
    }

    const timer = window.setTimeout(() => setOpen(true), SHOW_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, [pathname]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        showCloseButton
        className={cn(
          "max-h-[min(90dvh,36rem)] w-[calc(100%-1.5rem)] max-w-[28rem] gap-0 overflow-y-auto overscroll-contain",
          "rounded-lg border-0 bg-white px-5 py-8 text-center shadow-xl",
          "sm:w-full sm:max-w-md sm:rounded-none sm:px-12 sm:py-12"
        )}
      >
        <DialogHeader className="space-y-0 pr-6 text-center sm:text-center">
          <DialogTitle className="text-balance text-[1.2rem] font-medium italic leading-snug tracking-tight text-[#0077BE] sm:text-[1.5rem]">
            Carpet &amp; Air Duct Cleaning in Saskatoon, Saskatchewan
          </DialogTitle>
          <DialogDescription className="mt-4 text-pretty text-[0.95rem] leading-relaxed text-neutral-700 sm:mt-5 sm:text-[1.05rem]">
            Our all-natural cleaning formulas safely clean your carpet, upholstery, or air ducts and
            dry in about an hour.
          </DialogDescription>
        </DialogHeader>

        <a
          href={HOME_PHONE_TEL}
          className="mt-5 inline-block text-xl font-bold tracking-wide text-[#0077BE] hover:underline sm:mt-6 sm:text-2xl"
        >
          {HOME_PHONE_DISPLAY}
        </a>

        <div className="mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:justify-center sm:gap-4">
          <a
            href={HOME_PHONE_TEL}
            className={cn(
              buttonVariants({ size: "lg" }),
              "min-h-12 w-full rounded-md bg-[#0077BE] px-6 text-base font-semibold text-white hover:bg-[#0066a3] sm:w-auto sm:flex-none sm:px-8"
            )}
          >
            Call Us
          </a>
          <a
            href={HOUSECALL_PRO_BOOKING_URL}
            onClick={(e) => {
              e.preventDefault();
              setOpen(false);
              openHousecallBooking();
            }}
            className={cn(
              buttonVariants({ size: "lg" }),
              "min-h-12 w-full rounded-md bg-[#0077BE] px-6 text-base font-semibold text-white hover:bg-[#0066a3] sm:w-auto sm:flex-none sm:px-8"
            )}
          >
            Book Online
          </a>
        </div>
      </DialogContent>
    </Dialog>
  );
}
