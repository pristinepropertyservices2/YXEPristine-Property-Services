"use client";

import { memo } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";
import type { HomeTestimonial } from "@/lib/home-data";
import { SECTION_INTRO_GAP, SECTION_H2, SECTION_LEAD, SECTION_Y } from "@/lib/home-layout";
import { Star, BadgeCheck } from "lucide-react";
import { cn } from "@/lib/utils";

type TestimonialsSectionProps = {
  testimonials: HomeTestimonial[];
};

export const TestimonialsSection = memo(function TestimonialsSection({
  testimonials,
}: TestimonialsSectionProps) {
  return (
    <section
      id="reviews"
      className={cn(SECTION_Y, "border-t border-neutral-200/60 bg-purple-50/60")}
      aria-labelledby="reviews-heading"
    >
      <div className="container mx-auto px-4">
        <div className={cn("mx-auto max-w-3xl text-center", SECTION_INTRO_GAP)}>
          <Badge className="mb-4 border-0 bg-gradient-to-r from-[#B8860B] via-[#D4AF37] to-[#C9971A] text-black">
            Reviews
          </Badge>
          <h2 id="reviews-heading" className={cn(SECTION_H2, "text-gray-900")}>
            What our customers say
          </h2>
          <p className={cn(SECTION_LEAD, "mx-auto")}>
            Real feedback from homeowners and businesses across Saskatoon and surrounding communities.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-3 md:gap-8">
          {testimonials.map((testimonial, idx) => (
            <Card key={idx} className="border-neutral-200/90 bg-white shadow-md ring-1 ring-neutral-950/[0.04]">
              <CardHeader className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex gap-1" aria-label={`${testimonial.rating} out of 5 stars`}>
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-[#D4AF37] text-[#D4AF37]" />
                    ))}
                  </div>
                  <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-emerald-900 ring-1 ring-emerald-200/80">
                    <BadgeCheck className="h-3.5 w-3.5" aria-hidden />
                    Verified
                  </span>
                </div>
                <CardDescription className="text-[0.95rem] leading-relaxed text-neutral-800 italic md:text-base md:leading-relaxed">
                  &quot;{testimonial.text}&quot;
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-12 min-w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-amber-200 to-amber-400 text-sm font-bold text-neutral-900"
                    aria-hidden
                  >
                    {testimonial.initials}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-[1.0625rem] font-semibold text-neutral-900">{testimonial.name}</p>
                    <p className="truncate text-sm text-neutral-600">{testimonial.location}</p>
                  </div>
                </div>
                <Badge variant="outline" className="mt-4 border-neutral-200 text-neutral-800">
                  {testimonial.service}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
});
