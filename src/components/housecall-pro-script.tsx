"use client";

import Script from "next/script";
import { HOUSECALL_PRO_SCRIPT_SRC } from "@/lib/housecall-pro";

/** Loads Housecall Pro online booking widget once site-wide. */
export function HousecallProScript() {
  return <Script src={HOUSECALL_PRO_SCRIPT_SRC} strategy="afterInteractive" />;
}
