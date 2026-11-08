import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { HOUSECALL_PRO_BOOKING_URL } from "@/lib/housecall-pro";
import { SITE_URL } from "@/lib/site-seo";

export const metadata: Metadata = {
  title: "Book a cleaning",
  description:
    "Schedule carpet, upholstery, duct, tile, or specialty cleaning online. Serving Saskatoon, Martensville, and Warman.",
  alternates: { canonical: `${SITE_URL}/book` },
  robots: { index: true, follow: true },
};

/** Old /book route now sends customers to Housecall Pro online booking. */
export default function BookPage() {
  redirect(HOUSECALL_PRO_BOOKING_URL);
}
