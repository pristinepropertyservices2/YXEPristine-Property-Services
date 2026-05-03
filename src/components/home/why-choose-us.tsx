"use client";

import { memo } from "react";
import { Check, Clock, Leaf, Shield, ThumbsUp } from "lucide-react";
import { SECTION_H2 } from "@/lib/home-layout";
import { cn } from "@/lib/utils";

const bullets = [
  {
    title: "Fast service",
    description: "Flexible scheduling with same-week openings when available.",
    Icon: Clock,
  },
  {
    title: "Trusted professionals",
    description: "Licensed, insured technicians trained on low-moisture systems.",
    Icon: Shield,
  },
  {
    title: "Satisfaction guarantee",
    description: "We stand behind quality work and clear communication.",
    Icon: ThumbsUp,
  },
  {
    title: "Eco-friendly products",
    description: "Plant-based, biodegradable solutions safe for family & pets.",
    Icon: Leaf,
  },
];

export const WhyChooseUs = memo(function WhyChooseUs() {
  return (
    <section className="border-b border-neutral-200/80 bg-neutral-50 py-10 md:py-12 lg:py-14" aria-labelledby="why-choose-heading">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl text-center md:mb-10">
          <h2 id="why-choose-heading" className={cn(SECTION_H2, "text-neutral-900")}>
            Why choose us
          </h2>
          <p className="mt-3 text-pretty text-neutral-600 text-base leading-relaxed md:text-lg">
            We focus on safer chemistry, faster dry times, and consistent results—so you spend less time worrying and more time enjoying your space.
          </p>
        </div>
        <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {bullets.map(({ title, description, Icon }) => (
            <li
              key={title}
              className="flex gap-4 rounded-2xl border border-neutral-200/90 bg-white p-5 shadow-sm"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-500/15 text-amber-800">
                <Icon className="h-6 w-6" aria-hidden />
              </span>
              <span>
                <span className="flex items-center gap-2 font-semibold tracking-tight text-neutral-900">
                  <Check className="h-4 w-4 shrink-0 text-amber-600" aria-hidden />
                  {title}
                </span>
                <span className="mt-1.5 block text-sm leading-snug text-neutral-600 md:text-[0.9375rem]">
                  {description}
                </span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
});
