"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardFooter, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export type ServiceListingCardService = {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  mediaType: string;
  mediaSrc: string;
  features: readonly string[] | string[];
};

type ServiceListingCardProps = {
  service: ServiceListingCardService;
  className?: string;
};

export function ServiceListingCard({ service, className }: ServiceListingCardProps) {
  return (
    <Card
      className={cn(
        "group relative flex flex-col gap-0 overflow-hidden rounded-[1.375rem] border border-neutral-200/90 bg-white p-0 shadow-none",
        "ring-1 ring-neutral-950/[0.04]",
        "transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
        "hover:-translate-y-2 hover:border-purple-200/70 hover:shadow-[0_28px_60px_-12px_rgba(62,31,107,0.22)] hover:ring-purple-950/[0.08]",
        className
      )}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-neutral-100">
        {service.mediaType === "video" ? (
          <video
            src={service.mediaSrc}
            className="h-full w-full object-cover transition-[transform,filter] duration-700 ease-out group-hover:scale-[1.045] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
            muted
            playsInline
            preload="none"
            poster="/Capet Cleaning1.png"
          />
        ) : (
          <Image
            src={service.mediaSrc}
            alt={service.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
            className="object-cover transition-[transform,filter] duration-700 ease-out group-hover:scale-[1.045] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
          />
        )}
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-neutral-950/55 via-neutral-950/10 to-transparent opacity-95 transition-opacity duration-500 group-hover:from-neutral-950/65"
        />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/35 to-transparent" />
        <div className="absolute right-4 top-4">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/90 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-neutral-900 shadow-sm backdrop-blur-md">
            <span className="h-1 w-1 rounded-full bg-amber-500" />
            From ${service.price}
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col px-6 pb-5 pt-6">
        <CardTitle className="text-xl font-semibold leading-snug tracking-tight text-neutral-900 md:text-[1.35rem]">
          {service.name}
        </CardTitle>
        <CardDescription className="mt-2.5 line-clamp-2 text-sm leading-relaxed text-neutral-600">
          {service.description}
        </CardDescription>

        <ul className="mt-5 space-y-2.5 border-t border-neutral-100 pt-5">
          {service.features.slice(0, 2).map((feature, idx) => (
            <li
              key={`${service.id}-${idx}`}
              className="flex gap-2.5 text-[13px] leading-snug text-neutral-600"
            >
              <span className="mt-1.5 flex h-1 w-1 shrink-0 rounded-full bg-gradient-to-br from-amber-500 to-amber-700 ring-[3px] ring-amber-500/25" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>

        <CardFooter className="mt-auto flex w-full flex-col gap-3 border-0 bg-transparent px-0 pt-7 pb-0">
          <Button
            size="lg"
            className="group/btn relative w-full overflow-hidden rounded-2xl border-0 bg-gradient-to-r from-[#3a1f58] via-[#5E2C8A] to-[#4a2570] px-6 py-6 text-sm font-semibold tracking-wide text-white shadow-[0_12px_34px_-8px_rgba(62,31,107,0.55)] transition-[transform,box-shadow,filter] duration-300 hover:shadow-[0_18px_44px_-8px_rgba(62,31,107,0.58)] hover:brightness-[1.06] active:scale-[0.99] motion-reduce:transition-none"
            asChild
          >
            <Link href="/book">
              <span className="relative z-10 flex w-full items-center justify-center gap-2">
                Book this service
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-0.5" />
              </span>
            </Link>
          </Button>
          <Link
            href={`/services/${service.id}`}
            prefetch={false}
            className="text-center text-xs font-medium tracking-wide text-purple-950/65 underline-offset-4 transition-colors hover:text-purple-900 hover:underline"
          >
            View pricing &amp; details
          </Link>
        </CardFooter>
      </div>
    </Card>
  );
}
