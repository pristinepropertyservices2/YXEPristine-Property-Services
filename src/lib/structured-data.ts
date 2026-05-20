import type { ServiceDetail } from "@/lib/service-details";
import { BUSINESS, SITE_URL } from "@/lib/site-seo";
import type { HomeTestimonial } from "@/lib/home-data";

export function parsePriceAmount(startingPrice: string): number | undefined {
  const m = startingPrice.replace(/,/g, "").match(/(\d+(\.\d+)?)/);
  if (!m) return undefined;
  const n = parseFloat(m[1]);
  return Number.isFinite(n) ? n : undefined;
}

const HOME_FAQ_ITEMS: { question: string; answer: string }[] = [
  {
    question: "What areas do you serve around Saskatoon?",
    answer:
      "We serve Saskatoon, Martensville, Warman, and nearby communities. Ask when you book if you are just outside our usual radius.",
  },
  {
    question: "Are your cleaning products safe for kids and pets?",
    answer:
      "Yes. We prioritize eco-friendly, low-moisture methods and products that are effective on soil while being safer for families and indoor air quality.",
  },
  {
    question: "How do I get a quote or book a visit?",
    answer:
      "Use the online booking flow, call us, or send a message through the contact page. You will receive clear pricing before we confirm your appointment.",
  },
  {
    question: "What services do you offer?",
    answer:
      "Carpet cleaning, upholstery, air duct cleaning, tile and grout, dryer vent, mattress, hardwood floors, and post-construction cleaning — residential and commercial.",
  },
];

export function aggregateRatingFromTestimonials(testimonials: HomeTestimonial[]) {
  if (testimonials.length === 0) return null;
  const sum = testimonials.reduce((acc, t) => acc + t.rating, 0);
  const ratingValue = Math.round((sum / testimonials.length) * 10) / 10;
  return {
    "@type": "AggregateRating" as const,
    ratingValue,
    bestRating: 5,
    worstRating: 1,
    ratingCount: testimonials.length,
    reviewCount: testimonials.length,
  };
}

function websiteJsonLd() {
  return {
    "@type": "WebSite" as const,
    "@id": `${SITE_URL}/#website`,
    name: BUSINESS.name,
    url: SITE_URL,
    publisher: { "@id": `${SITE_URL}/#localbusiness` },
    inLanguage: "en-CA",
  };
}

export function homeFaqJsonLd() {
  return {
    "@type": "FAQPage" as const,
    "@id": `${SITE_URL}/#faq`,
    mainEntity: HOME_FAQ_ITEMS.map((item) => ({
      "@type": "Question" as const,
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer" as const,
        text: item.answer,
      },
    })),
  };
}

export function localBusinessNode(testimonials: HomeTestimonial[]) {
  const aggregateRating = aggregateRatingFromTestimonials(testimonials);
  const review = testimonials.map((t) => ({
    "@type": "Review" as const,
    itemReviewed: { "@id": `${SITE_URL}/#localbusiness` },
    author: { "@type": "Person" as const, name: t.name },
    reviewBody: t.text,
    reviewRating: { "@type": "Rating" as const, ratingValue: t.rating, bestRating: 5, worstRating: 1 },
  }));
  return {
    "@type": "LocalBusiness" as const,
    "@id": `${SITE_URL}/#localbusiness`,
    name: BUSINESS.name,
    description: BUSINESS.description,
    url: SITE_URL,
    telephone: BUSINESS.telephone,
    email: BUSINESS.email,
    image: `${SITE_URL}/images/logo.png`,
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      streetAddress: BUSINESS.streetAddress,
      addressLocality: BUSINESS.addressLocality,
      addressRegion: BUSINESS.addressRegion,
      postalCode: BUSINESS.postalCode,
      addressCountry: BUSINESS.addressCountry,
    },
    areaServed: BUSINESS.areaServed.map((a) =>
      a["@type"] === "AdministrativeArea"
        ? { "@type": "AdministrativeArea" as const, name: a.name }
        : { "@type": "City" as const, name: a.name }
    ),
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ],
        opens: "00:00",
        closes: "23:59",
      },
    ],
    ...(aggregateRating ? { aggregateRating } : {}),
    ...(review.length ? { review } : {}),
  };
}

export function homePageGraphJsonLd(testimonials: HomeTestimonial[]) {
  return {
    "@context": "https://schema.org",
    "@graph": [localBusinessNode(testimonials), websiteJsonLd(), homeFaqJsonLd()],
  };
}

export function serviceOfferJsonLd(service: ServiceDetail) {
  const price = parsePriceAmount(service.startingPrice);
  const pageUrl = `${SITE_URL}/services/${service.id}`;
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${pageUrl}#service`,
    name: service.name,
    description: service.shortDescription,
    url: pageUrl,
    image: `${SITE_URL}${service.heroImage.startsWith("/") ? "" : "/"}${service.heroImage}`,
    provider: {
      "@type": "LocalBusiness",
      "@id": `${SITE_URL}/#localbusiness`,
      name: BUSINESS.name,
      telephone: BUSINESS.telephone,
      address: {
        "@type": "PostalAddress",
        streetAddress: BUSINESS.streetAddress,
        addressLocality: BUSINESS.addressLocality,
        addressRegion: BUSINESS.addressRegion,
        postalCode: BUSINESS.postalCode,
        addressCountry: BUSINESS.addressCountry,
      },
    },
    areaServed: BUSINESS.areaServed.map((a) =>
      a["@type"] === "AdministrativeArea"
        ? { "@type": "AdministrativeArea" as const, name: a.name }
        : { "@type": "City" as const, name: a.name }
    ),
    ...(price
      ? {
          offers: {
            "@type": "Offer",
            priceCurrency: "CAD",
            price: String(price),
            priceValidUntil: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
            url: pageUrl,
            availability: "https://schema.org/InStock",
          },
        }
      : {}),
  };
}

export function faqPageJsonLd(
  items: { question: string; answer: string }[],
  pageUrl: string
) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${pageUrl}#faq`,
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}
