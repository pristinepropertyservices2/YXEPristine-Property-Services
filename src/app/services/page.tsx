import { ServicesDirectory } from "./services-directory";
import { services } from "@/lib/marketing-content";
import type { ServiceListingCardService } from "@/components/service-listing-card";

export default function ServicesPage() {
  const listing: ServiceListingCardService[] = services.map((s) => ({
    id: s.id,
    name: s.name,
    description: s.description,
    price: s.price,
    duration: s.duration,
    mediaType: s.mediaType,
    mediaSrc: s.mediaSrc,
    features: [...s.features],
  }));

  return <ServicesDirectory services={listing} />;
}
