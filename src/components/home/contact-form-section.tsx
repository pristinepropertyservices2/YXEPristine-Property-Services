"use client";

import { memo, type FormEvent, type Dispatch, type SetStateAction } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { SECTION_H2, SECTION_LEAD, SECTION_Y } from "@/lib/home-layout";
import { cn } from "@/lib/utils";

export type ContactFormState = {
  name: string;
  email: string;
  phone: string;
  message: string;
};

type ContactFormSectionProps = {
  contactForm: ContactFormState;
  setContactForm: Dispatch<SetStateAction<ContactFormState>>;
  onSubmit: (e: FormEvent) => void;
};

export const ContactFormSection = memo(function ContactFormSection({
  contactForm,
  setContactForm,
  onSubmit,
}: ContactFormSectionProps) {
  return (
    <section id="contact" className={cn(SECTION_Y, "bg-gray-50")} aria-labelledby="contact-heading">
      <div className="container mx-auto px-4">
        <div className="grid gap-12 md:grid-cols-2 md:gap-14 lg:gap-16">
          <div>
            <Badge className="mb-4 border-0 bg-gradient-to-r from-[#B8860B] via-[#D4AF37] to-[#C9971A] text-black">
              Contact us
            </Badge>
            <h2 id="contact-heading" className={cn(SECTION_H2, "mb-4 text-gray-900")}>
              Get in touch
            </h2>
            <p className={cn(SECTION_LEAD, "mb-10 max-w-lg")}>
              Have questions or ready to book? We respond within one business day—often much sooner.
            </p>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-neutral-800 shadow-sm ring-1 ring-neutral-950/20">
                  <MapPin className="h-5 w-5 text-white" strokeWidth={2} />
                </div>
                <div>
                  <p className="text-base font-semibold text-gray-900">Address</p>
                  <p className="mt-1 text-base leading-relaxed text-gray-600">1731 Ave D N, Saskatoon, SK Canada S7L1R1</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-neutral-800 shadow-sm ring-1 ring-neutral-950/20">
                  <Phone className="h-5 w-5 text-white" strokeWidth={2} />
                </div>
                <div>
                  <p className="text-base font-semibold text-gray-900">Phone</p>
                  <a href="tel:639-471-3393" className="mt-1 inline-block text-base font-medium text-amber-700 hover:underline">
                    639-471-3393
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-neutral-800 shadow-sm ring-1 ring-neutral-950/20">
                  <Mail className="h-5 w-5 text-white" strokeWidth={2} />
                </div>
                <div>
                  <p className="text-base font-semibold text-gray-900">Email</p>
                  <a
                    href="mailto:info@yxepristinepropertyservices.ca"
                    className="mt-1 inline-block break-all text-base font-medium text-amber-700 hover:underline"
                  >
                    info@yxepristinepropertyservices.ca
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-neutral-800 shadow-sm ring-1 ring-neutral-950/20">
                  <Clock className="h-5 w-5 text-white" strokeWidth={2} />
                </div>
                <div>
                  <p className="text-base font-semibold text-gray-900">Hours</p>
                  <p className="mt-1 text-base leading-relaxed text-gray-600">Open 24 hours a day, 7 days a week</p>
                  <p className="text-base leading-relaxed text-gray-600">Saturday & Sunday: Closed</p>
                </div>
              </div>
            </div>
          </div>

          <Card className="border-neutral-200/90 shadow-md">
            <CardHeader>
              <CardTitle>Send a message</CardTitle>
              <CardDescription>We&apos;ll follow up shortly with pricing and availability.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={onSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="contact-name">Name</Label>
                  <Input
                    id="contact-name"
                    placeholder="Your name"
                    value={contactForm.name}
                    onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                    autoComplete="name"
                    required
                  />
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="contact-email">Email</Label>
                    <Input
                      id="contact-email"
                      type="email"
                      placeholder="you@example.com"
                      value={contactForm.email}
                      onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                      autoComplete="email"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contact-phone">Phone</Label>
                    <Input
                      id="contact-phone"
                      type="tel"
                      placeholder="(306) 000-0000"
                      value={contactForm.phone}
                      onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                      autoComplete="tel"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact-message">Message</Label>
                  <Textarea
                    id="contact-message"
                    placeholder="How can we help?"
                    rows={4}
                    value={contactForm.message}
                    onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                    required
                  />
                </div>
                <Button
                  type="submit"
                  size="lg"
                  className="min-h-12 w-full bg-amber-500 text-base font-semibold text-neutral-950 hover:bg-amber-400 md:py-6"
                >
                  Send message
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
});
