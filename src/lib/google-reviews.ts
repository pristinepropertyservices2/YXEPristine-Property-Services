import type { HomeTestimonial } from "@/lib/home-data";
import { BUSINESS } from "@/lib/site-seo";

export type GoogleReviewsPayload = {
  rating: number | null;
  userRatingCount: number | null;
  mapsUrl: string | null;
  reviews: HomeTestimonial[];
  source: "google" | "fallback";
};

type PlacesReview = {
  author_name?: string;
  rating?: number;
  text?: string;
  relative_time_description?: string;
  profile_photo_url?: string;
};

type PlacesDetailsResponse = {
  status: string;
  result?: {
    name?: string;
    rating?: number;
    user_ratings_total?: number;
    url?: string;
    reviews?: PlacesReview[];
  };
  error_message?: string;
};

function initialsFromName(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "G";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0] ?? ""}${parts[parts.length - 1][0] ?? ""}`.toUpperCase();
}

function mapReview(review: PlacesReview): HomeTestimonial | null {
  const name = review.author_name?.trim();
  const text = review.text?.trim();
  const rating = Math.round(Number(review.rating) || 0);
  if (!name || !text || rating < 1) return null;

  return {
    name,
    initials: initialsFromName(name),
    location: review.relative_time_description || "Google review",
    rating: Math.min(5, Math.max(1, rating)),
    text,
    service: "Google Review",
  };
}

/**
 * Fetches up to 5 most-relevant Google reviews via Places Details API.
 * Requires GOOGLE_PLACES_API_KEY + GOOGLE_PLACE_ID.
 */
export async function fetchGoogleReviews(
  fallback: HomeTestimonial[]
): Promise<GoogleReviewsPayload> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY?.trim();
  const placeId =
    process.env.GOOGLE_PLACE_ID?.trim() || BUSINESS.googlePlaceId;
  const fallbackMapsUrl = BUSINESS.googleReviewsUrl || BUSINESS.googleMapsUrl;

  if (!apiKey || !placeId) {
    return {
      rating: 5,
      userRatingCount: 9,
      mapsUrl: fallbackMapsUrl,
      reviews: fallback,
      source: "fallback",
    };
  }

  const params = new URLSearchParams({
    place_id: placeId,
    fields: "name,rating,user_ratings_total,reviews,url",
    reviews_sort: "most_relevant",
    key: apiKey,
  });

  try {
    const res = await fetch(
      `https://maps.googleapis.com/maps/api/place/details/json?${params.toString()}`,
      { next: { revalidate: 3600 } }
    );

    if (!res.ok) {
      console.error("[google-reviews] HTTP error", res.status);
      return {
        rating: 5,
        userRatingCount: 9,
        mapsUrl: fallbackMapsUrl,
        reviews: fallback,
        source: "fallback",
      };
    }

    const data = (await res.json()) as PlacesDetailsResponse;
    if (data.status !== "OK" || !data.result) {
      console.error("[google-reviews] Places API:", data.status, data.error_message);
      return {
        rating: 5,
        userRatingCount: 9,
        mapsUrl: fallbackMapsUrl,
        reviews: fallback,
        source: "fallback",
      };
    }

    const reviews = (data.result.reviews ?? [])
      .map(mapReview)
      .filter((r): r is HomeTestimonial => r !== null)
      .slice(0, 6);

    if (reviews.length === 0) {
      return {
        rating: data.result.rating ?? 5,
        userRatingCount: data.result.user_ratings_total ?? 9,
        mapsUrl: data.result.url ?? fallbackMapsUrl,
        reviews: fallback,
        source: "fallback",
      };
    }

    return {
      rating: data.result.rating ?? null,
      userRatingCount: data.result.user_ratings_total ?? null,
      mapsUrl: data.result.url ?? fallbackMapsUrl,
      reviews,
      source: "google",
    };
  } catch (error) {
    console.error("[google-reviews] fetch failed", error);
    return {
      rating: 5,
      userRatingCount: 9,
      mapsUrl: fallbackMapsUrl,
      reviews: fallback,
      source: "fallback",
    };
  }
}
