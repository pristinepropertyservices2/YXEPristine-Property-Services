import type { Metadata } from "next";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { SITE_URL } from "@/lib/site-seo";

export const metadata: Metadata = {
  title: "Terms of Service | YXE Pristine Property Services",
  description:
    "Terms and conditions for using the YXE Pristine Property Services website and booking residential and commercial cleaning in Saskatoon and surrounding areas.",
  alternates: { canonical: `${SITE_URL}/terms` },
  openGraph: {
    title: "Terms of Service | YXE Pristine Property Services",
    description:
      "Terms governing use of our site, quotes, bookings, payments, cancellations, and limitations of liability.",
    url: `${SITE_URL}/terms`,
  },
};

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-purple-50/30 py-12">
      <div className="container mx-auto max-w-3xl px-4 pb-16">
        <div className="mb-10 text-center">
          <Badge className="mb-4 bg-purple-100 text-purple-900">Legal</Badge>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
            Terms of service
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Last updated: May 4, 2026
          </p>
        </div>

        <div className="prose prose-gray max-w-none space-y-8 text-[15px] leading-relaxed text-gray-700">
          <section>
            <p>
              These Terms of Service (“Terms”) govern your access to{" "}
              <strong>yxepristinepropertyservices.ca</strong> and your booking or use of services
              provided by <strong>YXE Pristine Property Services</strong> (“we”, “us”, “our”).
              By using our website or requesting services, you agree to these Terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900">Services and Information</h2>
            <p className="mt-2">
              We provide cleaning and related property services as described on our website.
              Quotations are estimates unless otherwise confirmed in writing. Service scope, timing,
              and pricing depend on-site conditions disclosed by you (for example occupancy, access,
              hazards, delicate surfaces).
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900">Booking and Scheduling</h2>
            <p className="mt-2">
              Appointments are subject to availability. We may decline or reschedule work for safety,
              staffing, severe weather, or access issues (for example unsecured pets, inaccessible
              entry, or hazardous conditions).
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900">Payments</h2>
            <p className="mt-2">
              You agree to pay the fees communicated at booking or invoicing. Payments may be
              processed via third-party processors (such as Stripe or PayPal); their terms and fees
              may also apply where used.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900">Cancellations &amp; Changes</h2>
            <p className="mt-2">
              Cancellation policies may vary by job type or promotion and will be communicated at
              booking when applicable. Late cancellations or no-shows may incur fees reasonably
              reflecting reserved labor and routing.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900">Customer Responsibilities</h2>
            <ul className="mt-2 list-disc space-y-2 pl-5">
              <li>Provide safe access and accurate information about pets, hazards, and fragile items.</li>
              <li>Secure valuables, cash, and sensitive documents before service.</li>
              <li>Tell us about materials or warranties that restrict certain cleaning agents or methods.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900">Disclaimer of Warranties</h2>
            <p className="mt-2">
              We strive for professional workmanship, but indoor cleaning depends on stains, fibers,
              prior damage, concealed conditions, and materials. Except where prohibited by law,
              services are provided <strong>“as is”</strong>. We cannot guarantee restoration of prior
              damage, discoloration removal, odors, allergens, microbial conditions, third-party manufacturer
              claims, or health outcomes beyond responsible professional standards.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900">Limitation of Liability</h2>
            <p className="mt-2">
              To the fullest extent permitted by applicable law in Saskatchewan, Canada, we will not be
              liable for indirect, incidental, special, consequential, or punitive damages (including lost
              profits or data loss). Our aggregate liability arising out of or relating to services for a
              single job is limited to the amount you paid for that job unless a higher limitation is required
              by law. Claims must be promptly reported using the contact methods below so we may inspect and
              assess when appropriate.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900">Indemnity</h2>
            <p className="mt-2">
              To the fullest extent permitted by law, you will defend and indemnify us against claims arising
              from misrepresentations about the premises, obstruction of lawful work, or violations of these
              Terms, except to the extent caused by our gross negligence or willful misconduct.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900">Website Use</h2>
            <p className="mt-2">
              You agree not to misuse the site (for example attempting unauthorized access, scraping in
              violation of applicable law, or interfering with service delivery). We may suspend access
              where necessary to protect security or users.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900">Changes to These Terms</h2>
            <p className="mt-2">
              We may update these Terms from time to time. The updated Terms will be posted on this page
              with a new “Last updated” date. Continued use after changes constitutes acceptance of the
              revised Terms, except where required otherwise by law.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900">Governing Law</h2>
            <p className="mt-2">
              These Terms are governed by the laws of the Province of Saskatchewan and the federal laws of
              Canada applicable therein, without regard to conflict-of-law rules. Courts in Saskatchewan have
              exclusive jurisdiction, subject to mandatory consumer protections where applicable.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900">Contact</h2>
            <p className="mt-2">
              YXE Pristine Property Services
              <br />
              1731 Ave D N, Saskatoon, SK Canada S7L 1R1
              <br />
              Phone:{" "}
              <a href="tel:+16394713393" className="text-purple-700 underline hover:text-purple-800">
                639-471-3393
              </a>
              <br />
              Or use our{" "}
              <Link href="/contact" className="font-medium text-purple-700 underline hover:text-purple-800">
                contact form
              </Link>
              .
            </p>
          </section>
        </div>

        <p className="mt-12 text-center text-sm text-muted-foreground">
          <Link href="/" className="text-purple-700 underline hover:text-purple-800">
            Back to home
          </Link>
        </p>
      </div>
    </div>
  );
}
