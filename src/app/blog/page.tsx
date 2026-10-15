import type { Metadata } from "next";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SITE_URL } from "@/lib/site-seo";

export const metadata: Metadata = {
  title: "Blog — cleaning tips for Saskatoon homes & businesses",
  description:
    "Guides and tips from YXE Pristine Property Services on carpet care, duct cleaning, post-construction cleanup, and keeping healthier spaces in Saskatoon.",
  alternates: { canonical: `${SITE_URL}/blog` },
  openGraph: {
    title: "YXE Pristine Blog",
    url: `${SITE_URL}/blog`,
    description: "Cleaning tips and service insights for Saskatoon and surrounding communities.",
  },
};

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto max-w-3xl px-4">
        <Badge className="mb-4 bg-amber-100 text-amber-900">Blog</Badge>
        <h1 className="mb-4 text-3xl font-bold md:text-4xl">Cleaning tips &amp; updates</h1>
        <p className="mb-8 text-muted-foreground md:text-lg">
          Practical advice on carpets, ducts, post-construction cleanup, and healthier spaces —
          from the YXE Pristine team serving Saskatoon and surrounding communities.
        </p>

        <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-8 text-center">
          <p className="text-base text-neutral-700 md:text-lg">
            New articles are coming soon. In the meantime, explore our services or book a visit
            online.
          </p>
          <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button asChild className="bg-amber-500 font-semibold text-neutral-950 hover:bg-amber-400">
              <Link href="/book">Book Online</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/services">View Services</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
