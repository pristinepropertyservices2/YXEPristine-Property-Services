"use client";

import type { ReactNode } from "react";
import Image from "next/image";
import { Check, Leaf, Shield, Clock, Sparkles, User } from "lucide-react";
import { SECTION_H2, SECTION_LEAD } from "@/lib/home-layout";
import { cn } from "@/lib/utils";

type ServiceNarrativeSectionsProps = {
  slotAfterComparison?: ReactNode;
};

export function ServiceNarrativeSections({ slotAfterComparison }: ServiceNarrativeSectionsProps) {
  return (
    <>
      <div className="mx-auto mt-12 max-w-8xl rounded-2xl border border-neutral-200/90 bg-white/95 p-6 shadow-sm md:mt-16 md:p-10 lg:mt-20">
        <div className="grid items-center gap-8 md:grid-cols-[1.25fr_1fr]">
          <div>
            <p className="text-center text-[1.75rem] font-bold leading-tight tracking-tight sm:text-3xl md:text-left md:text-4xl lg:text-[3rem] lg:leading-[1.15]">
              <span className="text-neutral-900">All-Natural</span>
              <br />
              <span className="text-neutral-900">Carpet Cleaning</span>
              <br />
              <span className="text-amber-700">for Your Home</span>
              <br />
              <span className="text-amber-700">or Business...</span>
            </p>
            <p className="mt-6 text-left text-[1rem] leading-[1.65] text-neutral-700 sm:text-[1.05rem] md:text-lg md:leading-relaxed">
              At YXE Pristine Property Services, we believe a truly clean space should be healthy, safe, and welcoming. Our all-natural,
              eco-friendly carpet cleaning solution delivers a deep, thorough clean without harsh chemicals or excessive moisture. Our
              low-moisture cleaning process uses biodegradable, plant-based products that are tough on dirt and stains but gentle on your
              carpets, your family, your pets, and the environment. With fast drying times, exceptional results, and a commitment to
              quality, YXE Pristine Property Services is the trusted choice for homes and businesses across the region.
            </p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-xl border border-neutral-200 px-4 py-5 text-center">
                <Leaf className="mx-auto h-9 w-9 text-amber-700" />
                <p className="mt-3 text-sm font-bold tracking-wide text-neutral-900">Eco-friendly</p>
                <p className="mt-2 text-sm text-neutral-600">Safe for your family, pets, and the planet.</p>
              </div>
              <div className="rounded-xl border border-neutral-200 px-4 py-5 text-center">
                <Shield className="mx-auto h-9 w-9 text-amber-700" />
                <p className="mt-3 text-sm font-bold tracking-wide text-neutral-900">Trusted pros</p>
                <p className="mt-2 text-sm text-neutral-600">Highly trained and experienced technicians.</p>
              </div>
              <div className="rounded-xl border border-neutral-200 px-4 py-5 text-center">
                <Sparkles className="mx-auto h-9 w-9 text-amber-700" />
                <p className="mt-3 text-sm font-bold tracking-wide text-neutral-900">Premium results</p>
                <p className="mt-2 text-sm text-neutral-600">Noticeably cleaner carpets that last longer.</p>
              </div>
              <div className="rounded-xl border border-neutral-200 px-4 py-5 text-center">
                <Clock className="mx-auto h-9 w-9 text-amber-700" />
                <p className="mt-3 text-sm font-bold tracking-wide text-neutral-900">Fast drying</p>
                <p className="mt-2 text-sm text-neutral-600">Low moisture means quicker dry times and less disruption.</p>
              </div>
            </div>
          </div>
          <div className="overflow-hidden rounded-xl border border-neutral-200">
            <Image
              src="/Pasted image (2).png"
              alt="YXE Pristine technician using professional carpet cleaning equipment"
              width={1400}
              height={2800}
              sizes="(max-width: 768px) 100vw, 45vw"
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </div>

      <div className="mx-auto mt-12 max-w-8xl rounded-2xl border border-purple-200/80 bg-gradient-to-b from-white via-purple-50/40 to-amber-50/50 p-6 shadow-md ring-1 ring-purple-900/[0.06] md:mt-16 md:p-10 lg:mt-20">
        <div className="text-center">
          <h3 className={cn(SECTION_H2, "text-purple-900")}>Carpet cleaning vs. steam cleaning</h3>
          <p className={cn(SECTION_LEAD, "mx-auto mt-4 max-w-xl text-purple-950/75")}>
            There&apos;s a better, cleaner way.
          </p>
        </div>

        <div className="relative mt-8 grid gap-6 lg:grid-cols-2">
          <div className="overflow-hidden rounded-2xl border-2 border-purple-300/80 bg-white shadow-md ring-1 ring-purple-900/5">
            <div className="bg-gradient-to-r from-purple-950 via-purple-900 to-[#5E2C8A] px-6 py-5 text-center">
              <p className="text-2xl font-bold tracking-tight text-white">YXE Pristine Property Services</p>
              <p className="mt-1 text-lg font-semibold text-[#E8CA6A]">Low-moisture, eco-friendly cleaning</p>
            </div>
            <ul className="space-y-4 border-t border-purple-100/80 bg-white p-6 text-neutral-700">
              {[
                "Uses minimal water and all-natural, biodegradable solutions",
                "Dries in 1–3 hours",
                "Gentle on carpets—extends their life",
                "Reduces risk of mold, mildew, and bacteria",
                "Safe for kids, pets, and the environment",
                "Leaves carpets clean, fresh & ready to enjoy",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-purple-700 text-white ring-2 ring-amber-400/35">
                    <Check className="h-3.5 w-3.5" />
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="overflow-hidden rounded-2xl border-2 border-amber-400/70 bg-white shadow-md ring-1 ring-amber-600/10">
            <div className="bg-gradient-to-r from-[#B8860B] via-amber-500 to-[#D4AF37] px-6 py-5 text-center shadow-inner">
              <p className="text-2xl font-bold tracking-tight text-white drop-shadow-sm">Traditional steam cleaning</p>
              <p className="mt-1 text-lg font-semibold text-amber-50">High-moisture, conventional methods</p>
            </div>
            <ul className="space-y-4 border-t border-amber-100/90 bg-white p-6 text-neutral-700">
              {[
                "Uses high pressure and excessive water",
                "Dries in 12–24+ hours",
                "Can lead to carpet shrinkage and wear",
                "Higher risk of mold and mildew",
                "May contain harsh chemicals and residues",
                "Longer drying time disrupts your day",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-amber-500 to-amber-700 text-white ring-2 ring-purple-800/20">
                    <Check className="h-3.5 w-3.5" />
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="pointer-events-none absolute inset-0 hidden items-center justify-center lg:flex">
            <div className="rounded-full border-4 border-[#D4AF37] bg-purple-900 px-5 py-4 text-3xl font-bold text-white shadow-xl ring-2 ring-purple-950/30">
              VS.
            </div>
          </div>
        </div>

        {slotAfterComparison ? <div className="mt-10 md:mt-12">{slotAfterComparison}</div> : null}
      </div>

      <div className="mx-auto mt-12 max-w-8xl overflow-hidden rounded-3xl border border-neutral-200 bg-gradient-to-r from-white via-neutral-50 to-amber-50/60 shadow-sm md:mt-16 lg:mt-20">
        <div className="grid gap-0 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="p-6 md:p-10">
              <p className="text-3xl font-semibold leading-tight text-amber-800 md:text-4xl">Our technicians are</p>
              <h3 className="mt-2 text-4xl font-bold leading-tight text-purple-900 md:text-5xl lg:text-6xl lg:leading-[1.1]">
                Trusted and skilled
                <br />
                cleaning experts
              </h3>
              <p className="mt-6 max-w-2xl text-base leading-relaxed text-neutral-700 md:text-lg">
                YXE Pristine Property Services are not your typical carpet cleaners. Every tech is trained to identify and treat carpets,
                upholstery, tile, hardwood, and more using safe, effective methods.
              </p>
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-neutral-700 md:text-lg">
                When our team arrives at your home or business, you can expect friendly service, professional care, and results you can
                see.
              </p>

              <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {[
                  { icon: Shield, label: "Trusted pros" },
                  { icon: User, label: "Expert team" },
                  { icon: Sparkles, label: "Quality results" },
                  { icon: Leaf, label: "Better for home" },
                ].map((item) => (
                  <div key={item.label} className="rounded-xl border border-neutral-200 bg-white px-3 py-4 text-center">
                    <item.icon className="mx-auto h-8 w-8 text-neutral-800" />
                    <p className="mt-2 text-sm font-semibold text-neutral-900">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-center bg-gradient-to-b from-neutral-50 to-purple-50/25 p-6 md:p-10 lg:border-l lg:border-neutral-200/80">
              <Image
                src="/Screenshot%20from%202026-05-03%2005-53-49.png"
                alt="YXE Pristine — Clean, protect, maintain branding"
                width={1292}
                height={651}
                className="h-auto w-full max-w-xl object-contain"
                sizes="(max-width: 1024px) 100vw, 520px"
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>
        </div>
    </>
  );
}
