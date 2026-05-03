"use client";

import { memo } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import type { HomePlan } from "@/lib/home-data";
import { SECTION_INTRO_GAP, SECTION_H2, SECTION_LEAD, SECTION_Y } from "@/lib/home-layout";
import { Check, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

type PricingPlansSectionProps = {
  plans: HomePlan[];
  onSelectPlan: (plan: HomePlan) => void;
};

export const PricingPlansSection = memo(function PricingPlansSection({
  plans,
  onSelectPlan,
}: PricingPlansSectionProps) {
  return (
    <section id="pricing" className={cn(SECTION_Y, "bg-white")} aria-labelledby="pricing-heading">
      <div className="container mx-auto px-4">
        <div className={cn("mx-auto max-w-3xl text-center", SECTION_INTRO_GAP)}>
          <Badge className="mb-4 border-0 bg-gradient-to-r from-[#B8860B] via-[#D4AF37] to-[#C9971A] text-black">
            Pricing plans
          </Badge>
          <h2 id="pricing-heading" className={cn(SECTION_H2, "text-gray-900")}>
            Flexible plans for every need
          </h2>
          <p className={cn(SECTION_LEAD, "mx-auto")}>
            Limited-time promotional rates on recurring plans. Only a few priority slots left this month—lock in your discount when you subscribe.
          </p>
          <div
            className="mx-auto mt-6 flex max-w-xl flex-wrap items-center justify-center gap-2 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-950"
            role="status"
          >
            <Sparkles className="h-4 w-4 shrink-0 text-amber-700" aria-hidden />
            <span>Limited-time offer · Limited priority booking slots remaining</span>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl gap-6 pt-2 md:grid-cols-3 md:gap-8 md:pt-3">
          {plans.map((plan) => (
            <Card
              key={plan.id}
              className={cn(
                "relative overflow-visible transition-shadow hover:shadow-md",
                plan.popular && "z-[1] border-2 border-amber-400 shadow-xl ring-2 ring-amber-400/35"
              )}
            >
              {plan.popular ? (
                <>
                  <div className="pointer-events-none absolute -right-10 top-8 z-0 rotate-45 bg-amber-500 px-10 py-1 text-center text-[11px] font-bold uppercase tracking-wide text-neutral-950 shadow-sm sm:-right-12 sm:px-12 sm:text-xs">
                    Best value
                  </div>
                  <div className="relative z-10 flex justify-center px-6 pt-4">
                    <Badge className="border border-amber-700/80 bg-amber-600 px-4 py-1.5 text-sm font-semibold text-white shadow-md">
                      Most popular
                    </Badge>
                  </div>
                </>
              ) : null}
              <CardHeader className={cn("text-center", plan.popular ? "pt-3" : "")}>
                <CardTitle>{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
                {plan.discount > 0 ? (
                  <div className="mt-2">
                    <span className="text-3xl font-bold text-amber-700">{plan.discount}% off</span>
                    <p className="text-sm text-neutral-500">all services included</p>
                  </div>
                ) : null}
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
                      <span className="text-[0.9375rem] leading-snug text-neutral-700 md:text-base">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button
                  type="button"
                  size="lg"
                  className={cn(
                    "min-h-[3rem] w-full rounded-xl text-base font-semibold shadow-sm transition-[box-shadow,transform]",
                    plan.popular
                      ? "bg-amber-500 text-neutral-950 shadow-md hover:bg-amber-400 hover:shadow-lg"
                      : "border border-neutral-300 bg-white text-neutral-900 hover:bg-neutral-50"
                  )}
                  variant={plan.popular ? "default" : "outline"}
                  onClick={() => onSelectPlan(plan)}
                >
                  {plan.type === "ONE_TIME" ? "Get started" : "Subscribe now"}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
});
