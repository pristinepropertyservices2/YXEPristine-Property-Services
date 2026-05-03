import type { Metadata } from "next";
import { HomePageClient } from "@/components/home/home-page-client";

/** Static shell + ISR: cache homepage at the edge CDN for high traffic */
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "YXE Pristine Property Services | Professional Cleaning in Saskatoon",
  description:
    "Book insured, eco-friendly carpet, duct, upholstery, tile & post-construction cleaning in Saskatoon. Fast quotes—low-moisture, family-safe cleaning.",
  openGraph: {
    title: "YXE Pristine Property Services | Saskatoon Cleaning Experts",
    description:
      "Insured, eco-friendly home & commercial cleaning. Instant quotes—carpets, ducts, upholstery, tile, and more.",
    url: "https://yxepristinepropertyservices.ca",
    siteName: "YXE Pristine Property Services",
    type: "website",
    locale: "en_CA",
  },
  twitter: {
    card: "summary_large_image",
    title: "YXE Pristine Property Services",
    description: "Eco-friendly Saskatoon cleaning—book today.",
  },
  alternates: {
    canonical: "https://yxepristinepropertyservices.ca",
  },
};

export default function Page() {
  return <HomePageClient />;
}
