"use client";

import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";
import { SECTION_H2, SECTION_LEAD, SECTION_Y } from "@/lib/home-layout";
import { cn } from "@/lib/utils";

export function AboutSection() {
  return (
    <section id="about" className={cn(SECTION_Y, "bg-gradient-to-b from-white to-neutral-50")} aria-labelledby="about-heading">
      <div className="container mx-auto px-4">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <div className="relative">
            <Image
              src="/1a4b07c0-2828-46a3-b082-e4c5e0bc9ded.png"
              alt="Eco-friendly cleaning supplies and equipment bucket for YXE Pristine residential service"
              width={1200}
              height={1600}
              sizes="(max-width: 768px) 100vw, 50vw"
              loading="lazy"
              decoding="async"
              className="h-[520px] w-full rounded-2xl border border-white/30 object-cover shadow-2xl md:h-[680px]"
            />
            <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-black/10" />
            <div className="absolute -bottom-6 -right-6 rounded-2xl bg-amber-600 p-6 text-white shadow-lg">
              <p className="text-3xl font-bold">10+</p>
              <p className="text-sm">Years experience</p>
            </div>
          </div>
          <div className="space-y-6 rounded-2xl border border-neutral-200/90 bg-white/90 p-6 shadow-sm backdrop-blur-sm md:p-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <Badge className="border-0 bg-gradient-to-r from-[#B8860B] via-[#D4AF37] to-[#C9971A] text-black">About us</Badge>
              <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-900">Trusted in Saskatoon</span>
            </div>
            <h2 id="about-heading" className={cn(SECTION_H2, "text-gray-900")}>
              Locally owned, family run cleaning excellence
            </h2>
            <p className={SECTION_LEAD}>
              YXE Pristine Property Services is a locally owned, family-run cleaning and property maintenance company proudly serving
              Saskatoon and surrounding areas. We provide professional, eco-friendly cleaning for residential and commercial clients.
            </p>
            <p className={SECTION_LEAD}>
              Our all-natural products are tough on dirt, stains, and buildup, yet safe for your family, pets, employees, and customers.
              With advanced low-moisture methods, we deliver deep results with faster dry times—without harsh chemicals.
            </p>
            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-xl bg-neutral-50 p-3 text-center">
                <p className="text-xl font-bold text-neutral-900">500+</p>
                <p className="text-sm text-neutral-600">Happy clients</p>
              </div>
              <div className="rounded-xl bg-amber-50 p-3 text-center">
                <p className="text-xl font-bold text-amber-800">4.9/5</p>
                <p className="text-sm text-neutral-600">Average rating</p>
              </div>
              <div className="rounded-xl bg-neutral-50 p-3 text-center">
                <p className="text-xl font-bold text-neutral-900">100%</p>
                <p className="text-sm text-neutral-600">Insured team</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 pt-4">
              {[
                { title: "Eco-friendly", sub: "Safe products" },
                { title: "Family owned", sub: "Local business" },
                { title: "Fast drying", sub: "Low moisture" },
                { title: "Insured", sub: "Fully covered" },
              ].map(({ title, sub }) => (
                <div key={title} className="flex items-center gap-3 rounded-xl bg-neutral-50 p-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-100">
                    <Check className="h-5 w-5 text-amber-700" />
                  </div>
                  <div>
                    <p className="font-semibold text-neutral-900">{title}</p>
                    <p className="text-sm text-neutral-500">{sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
