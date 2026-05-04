import type { Metadata } from "next";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Privacy Policy | YXE Pristine Property Services",
  description:
    "How YXE Pristine Property Services collects, uses, and protects your personal information when you use our website and services in Saskatoon and surrounding areas.",
  openGraph: {
    title: "Privacy Policy | YXE Pristine Property Services",
    description:
      "Our commitment to protecting your privacy when you book cleaning services or use our website.",
    url: "https://yxepristinepropertyservices.ca/privacy",
  },
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-purple-50/30 py-12">
      <div className="container mx-auto max-w-3xl px-4 pb-16">
        <div className="mb-10 text-center">
          <Badge className="mb-4 bg-purple-100 text-purple-900">Legal</Badge>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
            Privacy policy
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Last updated: May 4, 2026
          </p>
        </div>

        <div className="prose prose-gray max-w-none space-y-8 text-[15px] leading-relaxed text-gray-700">
          <section>
            <p>
              YXE Pristine Property Services (“we”, “us”, “our”) respects your privacy. This policy
              describes how we handle personal information when you visit{" "}
              <strong>yxepristinepropertyservices.ca</strong>, create an account, request a quote, or
              book cleaning services with us.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900">Who we are</h2>
            <p className="mt-2">
              YXE Pristine Property Services
              <br />
              1731 Ave D N, Saskatoon, SK Canada S7L 1R1
              <br />
              Phone:{" "}
              <a href="tel:+16394713393" className="text-purple-700 underline hover:text-purple-800">
                639-471-3393
              </a>
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900">Information we collect</h2>
            <ul className="mt-2 list-disc space-y-2 pl-5">
              <li>
                <strong>Contact and account details:</strong> name, email address, phone number,
                and similar information you provide when you sign up, book, or contact us.
              </li>
              <li>
                <strong>Service-related information:</strong> property/service details you share for
                quotes and scheduling (such as address or access notes when voluntarily provided).
              </li>
              <li>
                <strong>Payment-related information:</strong> payments may be processed by third
                party providers (for example Stripe or PayPal). We do not store full payment card
                numbers on our servers; those providers handle card data according to their own terms
                and security practices.
              </li>
              <li>
                <strong>Technical data:</strong> IP address, device/browser type, and similar data
                that servers and analytics tools may log to operate and secure the website.
              </li>
              <li>
                <strong>Cookies and similar technologies:</strong> we may use cookies or local
                storage where needed for authentication, preferences, fraud prevention, or site
                functionality.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900">How we use information</h2>
            <ul className="mt-2 list-disc space-y-2 pl-5">
              <li>To deliver, schedule, and support cleaning services.</li>
              <li>To respond to inquiries and send service-related notices.</li>
              <li>To operate accounts (including sign-in with providers such as Google, if enabled).</li>
              <li>To process payments and prevent fraud or abuse.</li>
              <li>To improve our website, security, and customer experience.</li>
              <li>To comply with law and enforce our agreements.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900">When we share information</h2>
            <p className="mt-2">
              We may share information with vendors who help us run the business (such as hosting,
              email delivery, analytics, or payment processors) subject to contractual safeguards
              appropriate to their role. We may also disclose information if required by law or to
              protect rights, safety, and security.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900">Retention</h2>
            <p className="mt-2">
              We retain information only as long as needed for the purposes above, including
              accounting, legal, and dispute resolution requirements. Retention periods can vary based
              on the type of record.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900">Security</h2>
            <p className="mt-2">
              We use reasonable technical and organizational measures to protect personal
              information. No method of transmission over the Internet is completely secure.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900">Your choices</h2>
            <p className="mt-2">
              Depending on your situation and applicable law, you may have rights to access,
              correct, or delete certain personal information, or to withdraw consent where
              processing is consent-based. To make a request, contact us using the details above or
              our{" "}
              <Link href="/contact" className="font-medium text-purple-700 underline hover:text-purple-800">
                contact page
              </Link>
              .
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900">Changes</h2>
            <p className="mt-2">
              We may update this policy from time to time. The updated version will be posted on
              this page with a new “Last updated” date where practical.
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
