import type { Metadata } from "next";
import { ServicesDirectory } from "./services-directory";
import { services } from "@/lib/marketing-content";
import type { ServiceListingCardService } from "@/components/service-listing-card";
import { SITE_URL } from "@/lib/site-seo";

export const metadata: Metadata = {
  title: "Cleaning services in Saskatoon",
  description:
    "Carpet, upholstery, air duct, tile & grout, dryer vent, mattress, hardwood, and post-construction cleaning. Insured, eco-friendly, transparent pricing.",
  alternates: { canonical: `${SITE_URL}/services` },
  openGraph: {
    title: "Services | YXE Pristine Property Services",
    url: `${SITE_URL}/services`,
    description: "Browse professional cleaning services for homes and businesses in Saskatoon and area.",
  },
};

export default function ServicesPage() {
  const listing: ServiceListingCardService[] = services.map((s) => ({
    id: s.id,
    name: s.name,
    description: s.description,
    price: s.price,
    duration: s.duration,
    mediaType: s.mediaType,
    mediaSrc: s.mediaSrc,
    features: [...s.features],
  }));

  return <ServicesDirectory services={listing} />;
}
