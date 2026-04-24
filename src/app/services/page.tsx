import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { services } from "@/lib/marketing-content";

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50/40 to-background py-12">
      <div className="container mx-auto px-4">
        <div className="mx-auto mb-10 max-w-3xl text-center">
          <Badge className="mb-4 bg-amber-100 text-amber-900">Services</Badge>
          <h1 className="mb-4 text-3xl font-bold md:text-4xl">Professional Cleaning Services</h1>
          <p className="text-muted-foreground">
            Choose from specialized services for homes and businesses in Saskatoon and nearby areas.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <Card key={service.id} className="flex h-full flex-col">
              <div className="aspect-video overflow-hidden rounded-t-xl bg-muted">
                {service.mediaType === "video" ? (
                  <video
                    src={service.mediaSrc}
                    className="h-full w-full object-cover"
                    muted
                    playsInline
                    preload="none"
                    poster="/images/service-carpet.png"
                  />
                ) : (
                  <Image
                    src={service.mediaSrc}
                    alt={service.name}
                    width={1200}
                    height={675}
                    loading="lazy"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="h-full w-full object-cover"
                  />
                )}
              </div>
              <CardHeader>
                <CardTitle>{service.name}</CardTitle>
                <CardDescription>{service.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm">
                  <span className="font-semibold">Starting at:</span>{" "}
                  <span className="text-amber-700">${service.price} CAD</span>
                </p>
                <p className="text-sm">
                  <span className="font-semibold">Duration:</span> {service.duration} min
                </p>
                <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
                  {service.features.map((feature) => (
                    <li key={feature}>{feature}</li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter className="mt-auto">
                <Button asChild className="w-full bg-purple-700 hover:bg-purple-800">
                  <Link href="/book">Book {service.name}</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

