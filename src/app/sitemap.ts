import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site-seo";
import { serviceDetails } from "@/lib/service-details";

const STATIC_PATHS = [
  "",
  "/services",
  "/about",
  "/pricing",
  "/contact",
  "/book",
  "/privacy",
  "/terms",
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const staticEntries: MetadataRoute.Sitemap = STATIC_PATHS.map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified,
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : path === "/services" || path === "/contact" || path === "/book" ? 0.9 : 0.7,
  }));

  const serviceEntries: MetadataRoute.Sitemap = serviceDetails.map((s) => ({
    url: `${SITE_URL}/services/${s.id}`,
    lastModified,
    changeFrequency: "monthly" as const,
    priority: 0.85,
  }));

  return [...staticEntries, ...serviceEntries];
}
