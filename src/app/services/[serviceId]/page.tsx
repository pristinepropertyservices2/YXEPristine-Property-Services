import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { JsonLd } from "@/components/seo/json-ld";
import { serviceDetails, serviceDetailMap } from "@/lib/service-details";
import { SITE_URL } from "@/lib/site-seo";
import { faqPageJsonLd, serviceOfferJsonLd } from "@/lib/structured-data";
import { cn } from "@/lib/utils";

type PageProps = {
  params: Promise<{ serviceId: string }>;
};

export function generateStaticParams() {
  return serviceDetails.map((s) => ({ serviceId: s.id }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { serviceId } = await params;
  const service = serviceDetailMap[serviceId as keyof typeof serviceDetailMap];
  if (!service) {
    return { title: "Service not found" };
  }
  const url = `${SITE_URL}/services/${service.id}`;
  const title = `${service.name} in Saskatoon, SK | Starting ${service.startingPrice}`;
  return {
    title,
    description: `${service.shortDescription} Serving Saskatoon, Martensville & Warman. ${service.includes}. Book online.`,
    alternates: { canonical: url },
    openGraph: {
      title,
      description: service.shortDescription,
      url,
      type: "website",
      locale: "en_CA",
      images: [{ url: `${SITE_URL}${service.heroImage}`, alt: service.name }],
    },
  };
}

const comparisonContent: Partial<
  Record<
    keyof typeof serviceDetailMap,
    { title: string; traditional: string; ours: string }
  >
> = {
  carpet: {
    title: "Low-Moisture Carpet Cleaning vs. Traditional Steam Cleaning",
    traditional:
      "Traditional steam cleaning can saturate carpet with heavy water use, longer dry times, and detergent residue that can attract new dirt.",
    ours: "Our all-natural low-moisture process dries fast, leaves no sticky residue, and helps keep carpets fresh longer.",
  },
  upholstery: {
    title: "Targeted Fabric Care vs. One-Size-Fits-All Cleaning",
    traditional:
      "Generic cleaning approaches can over-wet delicate fabrics and leave residue that shortens furniture life.",
    ours: "We use fabric-safe methods and balanced moisture for a deep clean that refreshes upholstery without harsh chemical buildup.",
  },
  airduct: {
    title: "Complete Duct Cleaning vs. Surface-Only Cleaning",
    traditional:
      "Quick cleanings often miss deeper buildup inside duct runs and key system components.",
    ours: "Our process targets the full system to remove dust and contaminants for fresher air and better airflow.",
  },
  tile: {
    title: "Deep Grout Cleaning vs. Regular Mopping",
    traditional:
      "Mopping handles surface dirt but leaves embedded grime and discoloration in grout lines.",
    ours: "We deep clean tile and grout to lift buildup, restore appearance, and help maintain a cleaner finish.",
  },
  dryervent: {
    title: "Professional Vent Cleaning vs. DIY Lint Removal",
    traditional:
      "Basic lint-trap cleaning does not clear hidden lint and debris in the full vent path.",
    ours: "We clean the complete vent line to improve airflow, shorten dry times, and reduce fire risk.",
  },
  mattress: {
    title: "Deep Mattress Cleaning vs. Surface Spot Treatment",
    traditional:
      "Surface-only treatment can leave allergens and odor trapped below the top fabric layer.",
    ours: "Our low-moisture cleaning targets deeper buildup for a cleaner, healthier sleep surface.",
  },
  wood: {
    title: "Floor-Safe Cleaning vs. Over-Wetting Hardwood",
    traditional:
      "Over-wetting and harsh chemicals can dull finishes and damage wood over time.",
    ours: "We use hardwood-safe products and controlled moisture to clean thoroughly while protecting finish quality.",
  },
  postconstruction: {
    title: "Detail-Focused Final Cleanup vs. Basic Debris Removal",
    traditional:
      "Basic post-build cleanup can leave dust in vents, corners, and hard-to-reach finishing areas.",
    ours: "We provide top-to-bottom detailing so homes and commercial spaces are clean, polished, and move-in ready.",
  },
};

const serviceFaqs: Partial<
  Record<keyof typeof serviceDetailMap, { question: string; answer: string }[]>
> = {
  carpet: [
    {
      question: "How long does carpet cleaning take?",
      answer:
        "Most carpet appointments take 1-3 hours depending on square footage, room count, and soil level.",
    },
    {
      question: "How quickly will carpets dry?",
      answer:
        "With our low-moisture process, most carpets are dry in about 1 hour, with high-traffic areas sometimes taking a little longer.",
    },
    {
      question: "Are your products safe for kids and pets?",
      answer:
        "Yes. We use all-natural, eco-friendly products selected to be effective on dirt while remaining family and pet friendly.",
    },
  ],
};

const defaultFaqs = [
  {
    question: "How long does this service usually take?",
    answer:
      "Most appointments range from 1-3 hours depending on scope, condition, and accessibility.",
  },
  {
    question: "Are your products safe for homes and businesses?",
    answer:
      "Yes. We use eco-friendly products and service methods designed for safe, effective cleaning in both environments.",
  },
  {
    question: "Do you include deodorizing and disinfecting?",
    answer:
      "Yes. We include deodorizing and disinfecting in our process for all applicable services listed on this page.",
  },
];

const advantageBullets = [
  "Eco-friendly cleaning products",
  "Locally owned and operated",
  "Residential and commercial service",
  "Friendly, trained technicians",
  "Transparent pricing and clear scope",
  "Fast booking and reliable arrival windows",
];

export default async function ServiceDetailPage({ params }: PageProps) {
  const { serviceId } = await params;
  const service = serviceDetailMap[serviceId as keyof typeof serviceDetailMap];

  if (!service) notFound();
  const comparison = comparisonContent[service.id];
  const faqs = serviceFaqs[service.id] ?? defaultFaqs;
  const pageUrl = `${SITE_URL}/services/${service.id}`;

  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-50/95 via-white to-purple-50/25 pb-16 pt-10 md:pb-24 md:pt-12">
      <JsonLd data={serviceOfferJsonLd(service)} />
      <JsonLd data={faqPageJsonLd(faqs, pageUrl)} />
      <div className="container mx-auto px-4">
        {/* Hero */}
        <div className="grid items-stretch gap-8 lg:grid-cols-12 lg:gap-10">
          <div className="relative overflow-hidden lg:col-span-7">
            <div
              className={cn(
                "relative aspect-[4/3] overflow-hidden rounded-[1.375rem] bg-neutral-100",
                "ring-1 ring-neutral-950/[0.06] shadow-[0_24px_50px_-12px_rgba(62,31,107,0.14)] lg:aspect-auto lg:min-h-[460px]",
                "lg:h-full lg:rounded-2xl"
              )}
            >
              <Image
                src={service.heroImage}
                alt={`${service.name} in Saskatoon — YXE Pristine Property Services`}
                fill
                priority
                fetchPriority="high"
                quality={72}
                sizes="(max-width: 1024px) 100vw, 58vw"
                className="object-cover"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-purple-950/45 via-transparent to-transparent" aria-hidden />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-purple-950/50 to-transparent lg:hidden" aria-hidden />
            </div>
          </div>

          <div className="flex flex-col justify-center lg:col-span-5">
            <div className="rounded-[1.375rem] border border-neutral-200/90 bg-white/95 p-6 shadow-none ring-1 ring-neutral-950/[0.04] backdrop-blur-sm md:p-8 lg:h-full lg:rounded-2xl lg:p-10">
              <Badge
                className={cn(
                  "mb-6 border border-amber-200/80 bg-gradient-to-r from-[#B8860B]/15 via-[#D4AF37]/20 to-[#C9971A]/15",
                  "px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-amber-900"
                )}
              >
                {service.name}
              </Badge>
              <h1 className="text-[2rem] font-semibold leading-[1.12] tracking-tight text-neutral-900 md:text-4xl lg:text-[2.75rem] lg:leading-tight">
                {service.name}
              </h1>
              <p className="mt-4 text-lg font-medium leading-relaxed text-purple-950/85 md:text-xl">
                {service.shortDescription}
              </p>
              <p className="mt-4 text-[15px] leading-relaxed text-neutral-600 md:text-base">{service.longDescription}</p>

              <div className="mt-8 rounded-2xl border border-purple-100/90 bg-gradient-to-br from-purple-50/95 to-purple-100/35 p-5 md:p-6">
                <p className="text-sm font-semibold uppercase tracking-wide text-purple-900">
                  {service.includes}
                </p>
                <p className="mt-2 text-2xl font-semibold tracking-tight text-neutral-900">
                  Starting at{" "}
                  <span className="bg-gradient-to-r from-amber-600 to-[#D4AF37] bg-clip-text text-transparent">
                    {service.startingPrice}
                  </span>
                </p>
              </div>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Button
                  size="lg"
                  className="group relative w-full overflow-hidden rounded-2xl border-0 bg-gradient-to-r from-[#3a1f58] via-[#5E2C8A] to-[#4a2570] px-8 py-6 text-sm font-semibold tracking-wide text-white shadow-[0_12px_34px_-8px_rgba(62,31,107,0.5)] transition-[transform,box-shadow,filter] duration-300 hover:shadow-[0_18px_44px_-8px_rgba(62,31,107,0.55)] hover:brightness-[1.06] active:scale-[0.99] sm:w-auto"
                  asChild
                >
                  <Link href="/book" className="inline-flex items-center justify-center gap-2">
                    Book this service
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full rounded-2xl border-neutral-200/90 bg-white px-8 py-6 text-sm font-semibold text-neutral-800 shadow-sm hover:bg-neutral-50 sm:w-auto"
                  asChild
                >
                  <Link href="/services">All services</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 space-y-10 md:mt-16 md:space-y-14">
          <section
            className={cn(
              "overflow-hidden rounded-[1.375rem] border border-neutral-200/90 bg-white",
              "shadow-[0_20px_45px_-16px_rgba(62,31,107,0.12)] ring-1 ring-neutral-950/[0.03]"
            )}
          >
            <div className="border-b border-neutral-100 bg-gradient-to-r from-purple-950/[0.04] via-transparent to-amber-500/[0.04] px-6 py-6 md:px-10 md:py-8">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-purple-900/80">
                  Transparent pricing
                </span>
                <span aria-hidden className="h-1 w-1 rounded-full bg-purple-300" />
                <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-amber-800/90">
                  No surprises
                </span>
              </div>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-neutral-900 md:text-3xl">
                Pricing details
              </h2>
              <p className="mt-2 max-w-2xl text-sm text-neutral-600 md:text-[15px]">
                Typical jobs and options we quote most often — your exact estimate is confirmed when you book.
              </p>
            </div>
            <div className="grid gap-0 md:grid-cols-2 md:divide-x md:divide-neutral-100">
              <ul className="space-y-0 md:divide-y md:divide-neutral-100">
                {service.pricingItems.slice(0, Math.ceil(service.pricingItems.length / 2)).map((item) => (
                  <li
                    key={item}
                    className="flex gap-4 px-6 py-4 text-[15px] leading-snug text-neutral-700 md:px-10 md:py-5"
                  >
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-purple-700" strokeWidth={2.5} aria-hidden />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <ul className="space-y-0 md:divide-y md:divide-neutral-100">
                {service.pricingItems.slice(Math.ceil(service.pricingItems.length / 2)).map((item) => (
                  <li
                    key={item}
                    className="flex gap-4 px-6 py-4 text-[15px] leading-snug text-neutral-700 md:px-10 md:py-5"
                  >
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-purple-700" strokeWidth={2.5} aria-hidden />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <Card
            className={cn(
              "overflow-hidden rounded-[1.375rem] border border-purple-100/80 shadow-[0_20px_45px_-16px_rgba(62,31,107,0.1)] ring-1 ring-purple-950/[0.04]"
            )}
          >
            <CardHeader className="space-y-1 border-b border-purple-50 bg-purple-50/40 px-6 py-8 md:px-10">
              <CardTitle className="text-[1.65rem] font-semibold tracking-tight text-purple-950 md:text-3xl lg:text-[2rem] lg:leading-tight">
                All-natural {service.name} for your home or business
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5 px-6 py-8 text-[15px] leading-relaxed text-neutral-700 md:px-10 md:text-base">
              <p>
                Residential and commercial clients across Saskatoon trust our trained technicians for consistently
                high-end results — thorough prep, disciplined technique, and care for your fixtures and finishes.
              </p>
              <p>
                Every visit is coordinated around your schedule, with clear arrival windows and product choices that
                respect kids, pets, and indoor air quality.
              </p>
            </CardContent>
          </Card>

          {comparison && (
            <Card
              className={cn(
                "overflow-hidden rounded-[1.375rem] border border-neutral-200/85",
                "bg-white shadow-[0_20px_45px_-16px_rgba(62,31,107,0.1)] ring-1 ring-neutral-950/[0.03]"
              )}
            >
              <CardHeader className="px-6 pb-2 pt-8 md:px-10 md:pb-4 md:pt-10">
                <CardTitle className="max-w-3xl text-[1.5rem] font-semibold tracking-tight text-neutral-900 md:text-3xl lg:text-[2rem] lg:leading-tight">
                  {comparison.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="grid gap-5 px-6 pb-8 pt-2 md:grid-cols-2 md:gap-8 md:px-10 md:pb-10">
                <div className="rounded-2xl border border-neutral-200/90 bg-neutral-50/70 p-6 md:p-8">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-500">
                    Typical approach
                  </p>
                  <h3 className="mt-3 text-xl font-semibold text-neutral-900">Traditional method</h3>
                  <p className="mt-4 text-sm leading-relaxed text-neutral-700 md:text-[15px]">
                    {comparison.traditional}
                  </p>
                </div>
                <div className="rounded-2xl border border-purple-100 bg-gradient-to-b from-purple-50/95 to-purple-100/35 p-6 ring-1 ring-purple-200/70 md:p-8">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-purple-900/75">
                    YXE Pristine
                  </p>
                  <h3 className="mt-3 text-xl font-semibold text-purple-950">Our method</h3>
                  <p className="mt-4 text-sm leading-relaxed text-neutral-800 md:text-[15px]">
                    {comparison.ours}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          <Card
            className={cn(
              "rounded-[1.375rem] border border-neutral-200/85 bg-white",
              "shadow-[0_18px_40px_-14px_rgba(0,0,0,0.08)] ring-1 ring-neutral-950/[0.03]"
            )}
          >
            <CardHeader className="border-b border-neutral-100 px-6 py-7 md:px-10 md:py-9">
              <CardTitle className="text-[1.5rem] font-semibold tracking-tight text-neutral-900 md:text-2xl lg:text-[1.875rem]">
                Frequently asked questions
              </CardTitle>
              <p className="mt-2 text-sm font-normal text-neutral-600 md:text-[15px]">
                Straight answers before you reserve a visit.
              </p>
            </CardHeader>
            <CardContent className="divide-y divide-neutral-100 px-0 py-0 md:pb-4">
              {faqs.map((faq) => (
                <div key={faq.question} className="px-6 py-6 md:px-10 md:py-8">
                  <p className="text-base font-semibold text-neutral-900 md:text-lg">{faq.question}</p>
                  <p className="mt-2 text-[15px] leading-relaxed text-neutral-700 md:text-base">{faq.answer}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <section
            className={cn(
              "relative overflow-hidden rounded-[1.375rem]",
              "bg-gradient-to-br from-[#301850] via-[#5E2C8A] to-[#3a2460]",
              "px-6 py-10 text-white shadow-[0_28px_60px_-12px_rgba(62,31,107,0.45)] md:px-12 md:py-14"
            )}
          >
            <div aria-hidden className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-amber-400/12 blur-3xl" />
            <div aria-hidden className="pointer-events-none absolute -bottom-16 left-10 h-48 w-48 rounded-full bg-white/10 blur-3xl" />
            <h2 className="relative text-[1.5rem] font-semibold tracking-tight md:text-3xl lg:text-[2rem] lg:leading-tight">
              The YXE Pristine advantage
            </h2>
            <ul className="relative mt-8 grid gap-3 text-[15px] leading-snug md:grid-cols-2 md:gap-x-12 md:gap-y-4 md:text-base">
              {advantageBullets.map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="mt-1 flex h-2 w-2 shrink-0 rounded-full bg-amber-400" aria-hidden />
                  <span className="text-white/92">{item}</span>
                </li>
              ))}
            </ul>
            <div className="relative mt-10">
              <Button
                size="lg"
                className="rounded-2xl border-2 border-white/25 bg-white/10 px-8 py-6 text-base font-semibold text-white backdrop-blur-sm hover:bg-white/20"
                asChild
              >
                <Link href="/book" className="inline-flex items-center gap-2">
                  Schedule now
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
