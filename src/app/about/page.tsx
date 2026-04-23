import Link from "next/link";
import { Award, ShieldCheck, Sparkles, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-purple-50/30 py-12">
      <div className="container mx-auto space-y-10 px-4 md:space-y-14">
        <div className="mx-auto max-w-3xl text-center space-y-4">
          <Badge className="mb-4 bg-amber-100 text-amber-900">About Us</Badge>
          <h1 className="text-3xl font-bold leading-tight md:text-5xl">
            Locally Owned, Family-Run Cleaning Excellence
          </h1>
          <p className="text-muted-foreground md:text-lg">
            YXE Pristine Property Services delivers dependable, eco-friendly cleaning for homes and
            businesses across Saskatoon.
          </p>
        </div>

        <div className="grid items-stretch gap-8 md:grid-cols-2">
          <div className="relative overflow-hidden rounded-2xl border bg-black shadow-xl">
            <video
              src="/6197563-uhd_3840_2160_25fps.mp4"
              className="h-full min-h-[320px] w-full object-cover"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
            />
            <div className="absolute inset-0 bg-black/30" />
            <div className="absolute bottom-4 left-4 rounded-xl bg-white/90 px-4 py-2 text-sm font-medium text-gray-900">
              Proudly serving Saskatoon and surrounding areas
            </div>
          </div>
          <div className="rounded-2xl border bg-white/90 p-6 shadow-sm backdrop-blur-sm md:p-8">
            <h2 className="text-2xl font-semibold text-gray-900">Who we are</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground md:text-base">
              We are a local team focused on healthy indoor spaces. Our service blends professional
              equipment, eco-safe products, and respectful in-home care so your property feels clean
              and comfortable without harsh chemical residue.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground md:text-base">
              From one-time deep cleans to recurring maintenance, we prioritize consistency,
              transparent pricing, and communication you can trust.
            </p>
            <div className="mt-6 grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-purple-50 p-3 text-center">
                <p className="text-xl font-bold text-purple-800">500+</p>
                <p className="text-xs text-gray-600">Happy clients</p>
              </div>
              <div className="rounded-xl bg-amber-50 p-3 text-center">
                <p className="text-xl font-bold text-amber-700">4.9/5</p>
                <p className="text-xs text-gray-600">Average rating</p>
              </div>
              <div className="rounded-xl bg-purple-50 p-3 text-center">
                <p className="text-xl font-bold text-purple-800">10+</p>
                <p className="text-xs text-gray-600">Years combined exp.</p>
              </div>
              <div className="rounded-xl bg-amber-50 p-3 text-center">
                <p className="text-xl font-bold text-amber-700">100%</p>
                <p className="text-xs text-gray-600">Insured team</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-amber-600" />
                Our Mission
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Provide healthy, high-quality cleaning experiences that protect properties and the
              people inside them.
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-amber-600" />
                Our Promise
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Honest communication, punctual arrivals, and results backed by a satisfaction-first
              service culture.
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5 text-amber-600" />
                Our Approach
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              We use low-moisture and eco-safe methods that clean deeply while reducing harsh
              chemical exposure.
            </CardContent>
          </Card>
        </div>

        <div className="rounded-2xl border bg-white p-6 shadow-sm md:p-8">
          <h2 className="mb-3 text-2xl font-semibold">Why clients choose us</h2>
          <div className="grid gap-3 text-sm text-muted-foreground md:grid-cols-2">
            {[
              "Fully insured and professional team",
              "Eco-friendly, family-safe products",
              "Flexible scheduling and clear pricing",
              "Residential and commercial expertise",
              "Fast drying methods and efficient service",
              "Responsive support before and after visits",
            ].map((item) => (
              <div key={item} className="flex items-start gap-3 rounded-xl bg-gray-50 p-3">
                <Users className="mt-0.5 h-4 w-4 shrink-0 text-purple-700" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-3">
          <Button asChild className="bg-purple-700 hover:bg-purple-800">
            <Link href="/book">Book a Service</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/contact">Contact Us</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

