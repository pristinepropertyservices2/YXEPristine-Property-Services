"use client";

import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { CTAButton } from "@/components/home/cta-button";
import { ArrowRight } from "lucide-react";
import { Star } from "lucide-react";

const HERO_BACKGROUND_PATH =
  "/" + encodeURIComponent("NEW WEBSITE HOME PAGE IMAGE e.png");

export function HeroSection() {
  return (
    <section
      id="home"
      className="relative isolate min-h-[min(88vh,46rem)] pb-14 pt-24 sm:min-h-[min(90vh,52rem)] sm:pb-16 sm:pt-28 md:min-h-[min(85vh,44rem)] md:pb-20 md:pt-36 lg:pb-24 lg:pt-40"
    >
      <div className="absolute inset-0 z-0 min-h-[min(88vh,46rem)] overflow-hidden" aria-hidden>
        <div className="relative h-full min-h-[22rem] w-full sm:min-h-[26rem] md:min-h-[28rem]">
          <Image
            src={HERO_BACKGROUND_PATH}
            alt="Professional low-moisture carpet and upholstery cleaning in Saskatoon — YXE Pristine Property Services"
            fill
            priority
            fetchPriority="high"
            sizes="100vw"
            quality={68}
            decoding="async"
            className="object-cover object-center brightness-110"
          />
        </div>
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

          <h1 className="font-bold leading-[1.15] tracking-tight text-[1.875rem] text-white sm:text-[2.15rem] md:text-[2.625rem] lg:text-[min(3.5rem,6vw)]">
            Commercial and Residential Spaces. Pristine Results.
          </h1>

          <p className="mt-5 max-w-[42ch] text-[1.0625rem] leading-relaxed text-white/90 sm:max-w-[48ch] sm:text-lg md:mt-6 md:max-w-[52ch] md:text-[1.125rem] md:leading-[1.6]">
            Professional post-construction, commercial office, and residential cleaning you can depend on
            serving businesses, contractors, property managers, and homeowners throughout Saskatoon.
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
