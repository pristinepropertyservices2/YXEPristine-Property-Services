import type { Metadata } from "next";
import { HomePageClient } from "@/components/home/home-page-client";
import { JsonLd } from "@/components/seo/json-ld";
import { homeTestimonials } from "@/lib/home-data";
import { SITE_URL } from "@/lib/site-seo";
import { homePageGraphJsonLd } from "@/lib/structured-data";

/** Static shell + ISR: cache homepage at the edge CDN for high traffic */
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Saskatoon Carpet, Duct & Upholstery Cleaning",
  description:
    "Book insured, eco-friendly carpet, duct, upholstery, tile, dryer vent, mattress, hardwood & post-construction cleaning in Saskatoon, Martensville & Warman. Low-moisture, family-safe.",
  openGraph: {
    title: "YXE Pristine | Saskatoon Cleaning Experts",
    description:
      "Insured, eco-friendly home & commercial cleaning. Carpets, ducts, upholstery, tile, post-construction & more.",
    url: SITE_URL,
    siteName: "YXE Pristine Property Services",
    type: "website",
    locale: "en_CA",
  },
  twitter: {
    card: "summary_large_image",
    title: "YXE Pristine Property Services",
    description: "Eco-friendly Saskatoon cleaning—book online 24/7.",
  },
  alternates: {
    canonical: SITE_URL,
  },
};

export default function Page() {
  return (
    <>
      <JsonLd data={homePageGraphJsonLd(homeTestimonials)} />
      <HomePageClient />
    </>
  );
}
