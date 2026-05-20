/** Canonical production URL — override in preview/staging with NEXT_PUBLIC_SITE_URL if needed */
export const SITE_URL =
  (process.env.NEXT_PUBLIC_SITE_URL || "https://yxepristinepropertyservices.ca").replace(/\/$/, "");

export const BUSINESS = {
  name: "YXE Pristine Property Services",
  legalName: "YXE Pristine Property Services",
  description:
    "Professional eco-friendly carpet, upholstery, air duct, tile, dryer vent, mattress, hardwood, and post-construction cleaning in Saskatoon, SK and surrounding areas.",
  telephone: "+1-639-471-3393",
  telephoneDisplay: "639-471-3393",
  email: "info@yxepristinepropertyservices.ca",
  streetAddress: "1731 Ave D N",
  addressLocality: "Saskatoon",
  addressRegion: "SK",
  postalCode: "S7L 1R1",
  addressCountry: "CA",
  /** Primary service area for Local SEO */
  areaServed: [
    { name: "Saskatoon", "@type": "City" as const },
    { name: "Martensville", "@type": "City" as const },
    { name: "Warman", "@type": "City" as const },
    { name: "Saskatchewan", "@type": "AdministrativeArea" as const },
  ],
  /** Book online 24/7 — matches public messaging */
  openingHours: "Mo-Su 00:00-23:59",
  sameAs: [] as string[],
} as const;

export const DEFAULT_OG_IMAGE = `${SITE_URL}/images/logo.png`;
