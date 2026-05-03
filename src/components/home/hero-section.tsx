"use client";

import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { CTAButton } from "@/components/home/cta-button";
import { ArrowRight } from "lucide-react";
import { Star } from "lucide-react";

type HeroSectionProps = {
  typedLocation: string;
  typingCursorVisible: boolean;
};

export function HeroSection({ typedLocation, typingCursorVisible }: HeroSectionProps) {
  return (
    <section
      id="home"
      className="relative isolate min-h-[min(88vh,46rem)] pb-14 pt-24 sm:min-h-[min(90vh,52rem)] sm:pb-16 sm:pt-28 md:min-h-[min(85vh,44rem)] md:pb-20 md:pt-36 lg:pb-24 lg:pt-40"
    >
      <div className="absolute inset-0 z-0 overflow-hidden" aria-hidden>
        <Image
          src="/498e6ba5-7e29-43f7-816c-dd5035d604d3.png"
          alt=""
          fill
          priority
          sizes="100vw"
          decoding="async"
          className="object-cover object-[center_30%]"
        />
      </div>
      <div
        className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-b from-black/45 via-black/50 to-neutral-950/75"
        aria-hidden
      />
      <div className="pointer-events-none absolute inset-0 z-[1] shadow-[inset_0_-80px_60px_-40px_rgb(255_255_255/0.04)]" aria-hidden />

      <div className="container relative z-10 mx-auto min-w-0 px-4">
        <div className="max-w-xl min-w-0 md:max-w-2xl lg:max-w-3xl">
          <Badge className="mb-4 border border-amber-300/35 bg-gradient-to-r from-[#E8CA6A] via-[#D4AF37] to-[#C9971A] px-4 py-1.5 text-xs font-semibold text-neutral-900 shadow-sm backdrop-blur-sm sm:mb-5">
            Insured · Eco-friendly · Family-owned · Saskatoon-based
          </Badge>

          <h1
            className="font-bold leading-[1.1] tracking-tight text-[1.875rem] text-white sm:text-[2.15rem] md:text-[2.625rem] lg:text-[min(3.75rem,6.5vw)]"
            aria-label={`Cleaner, healthier surfaces without harsh chemicals. Serving ${typedLocation}.`}
          >
            <span className="block text-white">
              Cleaner, healthier surfaces without harsh chemicals.
            </span>
            <span className="mt-2 block max-w-full sm:mt-2.5 sm:overflow-x-auto sm:whitespace-nowrap sm:[-ms-overflow-style:none] sm:[scrollbar-width:none]">
              <span className="text-white/95">Serving </span>
              <span className="inline-flex min-w-[8.5ch] items-baseline font-bold text-amber-400 drop-shadow-sm sm:min-w-[10.75ch] sm:whitespace-nowrap">
                {typedLocation || "\u00A0"}
                {typingCursorVisible ? (
                  <span
                    aria-hidden
                    className="ml-1 inline-block h-[0.9em] w-0.5 shrink-0 translate-y-0.5 animate-pulse bg-amber-300 md:ml-1.5"
                  />
                ) : null}
              </span>
            </span>
          </h1>

          <p className="mt-4 text-[0.9375rem] font-medium text-amber-200/95 sm:text-base md:mt-5">
            Trusted by 500+ Saskatoon-area households—and booking fast for same-week visits.
          </p>

          <p className="mt-5 max-w-[42ch] text-[1.0625rem] leading-relaxed text-white/90 sm:max-w-[46ch] sm:text-lg md:max-w-[52ch] md:text-[1.125rem] md:leading-[1.6]">
            Book eco-friendly carpet, ducts, upholstery, tile &amp; more. Clear pricing. Professional crew.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
            <CTAButton href="/contact" variant="accent">
              Get instant quote
              <ArrowRight className="h-5 w-5" aria-hidden />
            </CTAButton>
            <CTAButton href="/book" prefetch={false} variant="ghostLight">
              Book cleaning now
            </CTAButton>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-white/15 pt-8 sm:mt-10 sm:pt-9">
            <div className="flex items-center gap-1.5">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} className="h-[1.125rem] w-[1.125rem] fill-amber-400 text-amber-400 sm:h-5 sm:w-5" />
              ))}
              <span className="ml-2 text-base font-medium text-white/90">4.9 / 5 · Local reviews</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
