import type { Metadata } from "next";
import { BookingWizard } from "./booking-wizard";
import { SITE_URL } from "@/lib/site-seo";

export const metadata: Metadata = {
  title: "Book a cleaning",
  description:
    "Schedule carpet, upholstery, duct, tile, or specialty cleaning online. Serving Saskatoon, Martensville, and Warman.",
  alternates: { canonical: `${SITE_URL}/book` },
  robots: { index: true, follow: true },
};

export default function BookPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50/50 to-background py-10">
      <BookingWizard />
    </div>
  );
}
