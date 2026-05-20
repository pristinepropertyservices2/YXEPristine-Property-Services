import type { Metadata } from "next";
import Link from "next/link";
import { Check, ShieldCheck, Sparkles, Clock3 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { pricingPlans } from "@/lib/marketing-content";
import { SITE_URL } from "@/lib/site-seo";

export const metadata: Metadata = {
  title: "Pricing & service plans",
  description:
    "Flexible one-time and recurring cleaning plans for Saskatoon. No hidden fees — compare plans and book online.",
  alternates: { canonical: `${SITE_URL}/pricing` },
  openGraph: {
    title: "Pricing | YXE Pristine",
    url: `${SITE_URL}/pricing`,
    description: "Transparent pricing for residential and commercial cleaning in Saskatoon.",
  },
};

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-purple-50/40 py-12">
      <div className="container mx-auto px-4 space-y-10">
        <div className="mx-auto mb-10 max-w-3xl text-center space-y-4">
          <Badge className="mb-4 bg-amber-100 text-amber-900">Pricing</Badge>
          <h1 className="text-3xl font-bold md:text-5xl">Flexible Plans for Every Need</h1>
          <p className="text-muted-foreground md:text-lg">
            Start with one-time service or save with recurring plans.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-muted-foreground">
            <span className="rounded-full bg-white px-3 py-1 border">No hidden fees</span>
            <span className="rounded-full bg-white px-3 py-1 border">Cancel anytime</span>
            <span className="rounded-full bg-white px-3 py-1 border">Secure payment</span>
          </div>
        </div>

        <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-3">
          {pricingPlans.map((plan) => (
            <Card
              key={plan.id}
              className={
                plan.popular
                  ? "relative border-amber-500 border-2 shadow-xl bg-white"
                  : "relative border border-purple-100 shadow-sm bg-white/95"
              }
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="bg-amber-600 text-white">Most Popular</Badge>
                </div>
              )}
              <CardHeader className="text-center space-y-2">
                <CardTitle>{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
                {plan.discount > 0 && (
                  <div className="space-y-1 pt-1">
                    <p className="text-3xl font-bold text-amber-700">{plan.discount}% OFF</p>
                    <p className="text-xs text-muted-foreground">on recurring services</p>
                  </div>
                )}
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-amber-700" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button
                  asChild
                  className={plan.popular ? "w-full bg-amber-600 hover:bg-amber-700 text-white" : "w-full"}
                  variant={plan.popular ? "default" : "outline"}
                >
                  <Link href="/book">{plan.id === "one-time" ? "Get Started" : "Subscribe"}</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="mx-auto grid max-w-5xl gap-4 md:grid-cols-3">
          <div className="rounded-xl border bg-white p-4">
            <div className="mb-2 inline-flex h-9 w-9 items-center justify-center rounded-lg bg-purple-100">
              <ShieldCheck className="h-5 w-5 text-purple-700" />
            </div>
            <h3 className="font-semibold">Satisfaction guarantee</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              If anything is missed, we return and make it right.
            </p>
          </div>
          <div className="rounded-xl border bg-white p-4">
            <div className="mb-2 inline-flex h-9 w-9 items-center justify-center rounded-lg bg-amber-100">
              <Sparkles className="h-5 w-5 text-amber-700" />
            </div>
            <h3 className="font-semibold">Eco-safe products</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Family and pet friendly products with professional-grade results.
            </p>
          </div>
          <div className="rounded-xl border bg-white p-4">
            <div className="mb-2 inline-flex h-9 w-9 items-center justify-center rounded-lg bg-purple-100">
              <Clock3 className="h-5 w-5 text-purple-700" />
            </div>
            <h3 className="font-semibold">Flexible scheduling</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Easy rescheduling and recurring options that fit your routine.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

