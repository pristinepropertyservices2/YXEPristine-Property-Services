import { cn } from "@/lib/utils";

/** Section vertical padding: ~40px mobile, ~80px desktop */
export const SECTION_Y = "py-10 md:py-20 lg:py-24";

export const SECTION_INTRO_GAP = "mb-10 md:mb-14 lg:mb-[4.75rem]";

export const SECTION_H2 = cn(
  "font-bold tracking-tight text-neutral-900",
  "text-[1.625rem] leading-[1.2] sm:text-3xl md:text-4xl lg:text-[2.5rem]"
);

export const SECTION_LEAD = cn(
  "text-pretty text-neutral-600 text-base leading-relaxed md:text-lg md:leading-[1.55]"
);
