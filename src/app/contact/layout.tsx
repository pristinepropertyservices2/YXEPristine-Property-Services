import type { Metadata } from "next";
import { SITE_URL } from "@/lib/site-seo";

export const metadata: Metadata = {
  title: "Contact us",
  description:
    "Call or message YXE Pristine Property Services in Saskatoon for quotes and booking. Carpet, duct, upholstery, tile, and post-construction cleaning.",
  alternates: { canonical: `${SITE_URL}/contact` },
  openGraph: {
    title: "Contact YXE Pristine | Saskatoon Cleaning",
    url: `${SITE_URL}/contact`,
    description: "Get in touch for quotes, scheduling, and service questions.",
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
