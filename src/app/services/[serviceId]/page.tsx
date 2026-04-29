import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { serviceDetails, serviceDetailMap } from "@/lib/service-details";

type PageProps = {
  params: Promise<{ serviceId: string }>;
};

export function generateStaticParams() {
  return serviceDetails.map((s) => ({ serviceId: s.id }));
}

export default async function ServiceDetailPage({ params }: PageProps) {
  const { serviceId } = await params;
  const service = serviceDetailMap[serviceId as keyof typeof serviceDetailMap];

  if (!service) notFound();

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50/40 to-background py-12">
      <div className="container mx-auto max-w-6xl space-y-8 px-4">
        <div className="grid gap-8 md:grid-cols-2">
          <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
            <Image
              src={service.heroImage}
              alt={service.name}
              width={1400}
              height={900}
              sizes="(max-width: 768px) 100vw, 50vw"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="space-y-4 rounded-2xl border bg-white p-6 shadow-sm md:p-8">
            <Badge className="bg-amber-100 text-amber-900">{service.name}</Badge>
            <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">{service.name}</h1>
            <p className="text-gray-600">{service.shortDescription}</p>
            <p className="text-gray-600">{service.longDescription}</p>
            <div className="rounded-xl bg-purple-50 p-4">
              <p className="text-sm font-semibold text-purple-900">{service.includes}</p>
              <p className="mt-1 text-lg font-bold text-amber-700">
                Starting at {service.startingPrice}
              </p>
            </div>
            <div className="flex gap-3 pt-2">
              <Button asChild className="bg-purple-700 hover:bg-purple-800">
                <Link href="/book">Book This Service</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/services">Back to Services</Link>
              </Button>
            </div>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Pricing Details</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-inside list-disc space-y-2 text-sm text-muted-foreground md:text-base">
              {service.pricingItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
