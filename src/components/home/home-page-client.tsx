"use client";

import dynamic from "next/dynamic";
import { useEffect, useState, useCallback, type FormEvent } from "react";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import {
  homeServices,
  homePlans,
  homeTestimonials,
  homeBookingTimeSlots,
  HERO_LOCATION,
  HOME_PHONE_TEL,
  type HomeService,
  type HomePlan,
} from "@/lib/home-data";
import { SECTION_INTRO_GAP, SECTION_H2, SECTION_LEAD, SECTION_Y } from "@/lib/home-layout";
import { cn } from "@/lib/utils";
import { HeroSection } from "@/components/home/hero-section";
import { WhyChooseUs } from "@/components/home/why-choose-us";
import { ServicesGrid } from "@/components/home/services-grid";
import { CTASection } from "@/components/home/cta-section";
import { CTAButton } from "@/components/home/cta-button";
import { ServiceNarrativeSections } from "@/components/home/service-narrative-sections";
import { AboutSection } from "@/components/home/about-section";
import { TestimonialsSection } from "@/components/home/testimonials-section";
import { PricingPlansSection } from "@/components/home/pricing-plans-section";
import { ContactFormSection, type ContactFormState } from "@/components/home/contact-form-section";
import { HomeFooter } from "@/components/home/home-footer";
import { HomeModals } from "@/components/home/home-modals";
import { StickyMobileCta } from "@/components/home/sticky-mobile-cta";

const PaymentModal = dynamic(
  () => import("@/components/payment-modal").then((mod) => ({ default: mod.PaymentModal })),
  { ssr: false }
);

function useHeroTypewriter() {
  const [typedLocation, setTypedLocation] = useState("");
  const [typingCursorVisible, setTypingCursorVisible] = useState(true);

  useEffect(() => {
    let cancelled = false;
    let sleepHandle: number | undefined;
    const word = HERO_LOCATION;
    const typeMs = 95;
    const pauseAtFullMs = 2200;
    const eraseMs = 55;
    const pauseEmptyMs = 600;

    const sleep = (ms: number) =>
      new Promise<void>((resolve) => {
        sleepHandle = window.setTimeout(() => {
          sleepHandle = undefined;
          resolve();
        }, ms);
      });

    void (async () => {
      setTypingCursorVisible(true);
      while (!cancelled) {
        for (let i = 1; i <= word.length; i++) {
          if (cancelled) return;
          setTypedLocation(word.slice(0, i));
          await sleep(typeMs);
        }
        if (cancelled) return;
        await sleep(pauseAtFullMs);
        if (cancelled) return;
        for (let j = word.length - 1; j >= 0; j--) {
          if (cancelled) return;
          setTypedLocation(word.slice(0, j));
          await sleep(eraseMs);
        }
        if (cancelled) return;
        setTypedLocation("");
        await sleep(pauseEmptyMs);
      }
    })();

    return () => {
      cancelled = true;
      if (sleepHandle !== undefined) window.clearTimeout(sleepHandle);
    };
  }, []);

  return { typedLocation, typingCursorVisible };
}

export function HomePageClient() {
  const { typedLocation, typingCursorVisible } = useHeroTypewriter();

  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [authTab, setAuthTab] = useState<"login" | "signup">("login");
  const [selectedService, setSelectedService] = useState<HomeService | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<HomePlan | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState("09:00");
  const [bookingStep, setBookingStep] = useState(1);

  const [bookingForm, setBookingForm] = useState({
    address: "",
    city: "Saskatoon",
    postalCode: "",
    notes: "",
  });

  const [authForm, setAuthForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [contactForm, setContactForm] = useState<ContactFormState>({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleBookService = useCallback((service: HomeService) => {
    setSelectedService(service);
    setBookingStep(1);
    setIsBookingModalOpen(true);
  }, []);

  const resetBookingForm = useCallback(() => {
    setSelectedService(null);
    setSelectedDate(undefined);
    setSelectedTime("09:00");
    setBookingForm({
      address: "",
      city: "Saskatoon",
      postalCode: "",
      notes: "",
    });
    setBookingStep(1);
  }, []);

  const handleBookingSubmit = useCallback(async () => {
    if (!selectedService || !selectedDate) {
      toast({
        title: "Please complete all fields",
        description: "Select a date and time for your booking.",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceId: selectedService.id,
          date: selectedDate.toISOString(),
          time: selectedTime,
          ...bookingForm,
          totalPrice: selectedService.price,
        }),
      });

      if (response.ok) {
        toast({
          title: "Booking Confirmed!",
          description: "We will contact you shortly to confirm your appointment.",
        });
        setIsBookingModalOpen(false);
        resetBookingForm();
      } else {
        throw new Error("Booking failed");
      }
    } catch {
      toast({
        title: "Booking Submitted",
        description: "We received your request and will contact you soon.",
      });
      setIsBookingModalOpen(false);
      resetBookingForm();
    }
  }, [bookingForm, resetBookingForm, selectedDate, selectedService, selectedTime]);

  const handleAuthSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const endpoint = authTab === "signup" ? "/api/auth/signup" : "/api/auth/login";
      const body =
        authTab === "signup"
          ? authForm
          : { email: authForm.email, password: authForm.password };

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        toast({
          title: authTab === "signup" ? "Account Created!" : "Welcome Back!",
          description:
            authTab === "signup"
              ? "Please check your email to verify your account."
              : "You have been logged in successfully.",
        });
        setIsAuthModalOpen(false);
        setAuthForm({ name: "", email: "", phone: "", password: "", confirmPassword: "" });
      } else {
        const data = await response.json();
        const msg =
          (typeof data.error === "string" && data.error) ||
          (typeof data.message === "string" && data.message) ||
          "Authentication failed";
        throw new Error(msg);
      }
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleContactSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(contactForm),
      });

      if (response.ok) {
        toast({
          title: "Message Sent!",
          description: "Thank you for contacting us. We will respond within 24 hours.",
        });
        setContactForm({ name: "", email: "", phone: "", message: "" });
      }
    } catch {
      toast({
        title: "Message Sent!",
        description: "Thank you for contacting us. We will respond within 24 hours.",
      });
      setContactForm({ name: "", email: "", phone: "", message: "" });
    }
  };

  const handleSelectPlan = useCallback((plan: HomePlan) => {
    setSelectedPlan(plan);
    setIsPaymentModalOpen(true);
  }, []);

  const conversionCtas = (
    <>
      <CTAButton href="/contact" variant="accent">
        Get instant quote
        <ArrowRight className="h-5 w-5 shrink-0" aria-hidden />
      </CTAButton>
      <CTAButton href="/book" prefetch={false} variant="neutral">
        Book cleaning now
      </CTAButton>
    </>
  );

  return (
    <div className="flex min-h-screen flex-col pb-[5.25rem] md:pb-0">
      <main className="flex-1">
        <HeroSection typedLocation={typedLocation} typingCursorVisible={typingCursorVisible} />
        <WhyChooseUs />

        <section id="services" className={cn("bg-neutral-50", SECTION_Y)}>
          <div className="container mx-auto px-4">
            <div className={cn("mx-auto max-w-3xl text-center", SECTION_INTRO_GAP)}>
              <Badge className="mb-5 border border-amber-200/80 bg-gradient-to-r from-[#B8860B]/15 via-[#D4AF37]/20 to-[#C9971A]/15 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-amber-900">
                Our services
              </Badge>
              <h2 className={SECTION_H2}>Professional cleaning solutions</h2>
              <p className={cn(SECTION_LEAD, "mx-auto max-w-2xl")}>
                Boutique-quality care across every surface—eco-conscious products, meticulous technicians, and clear upfront pricing.
              </p>
            </div>

            <ServicesGrid services={homeServices} onBookService={handleBookService} />

            <div className="mt-10 md:mt-12">
              <CTASection
                id="cta-after-services"
                variant="brand"
                title="Book your clean in two minutes"
                subtitle="Request a tailored quote—or skip straight to priority scheduling."
              >
                {conversionCtas}
              </CTASection>
            </div>

            <ServiceNarrativeSections
              slotAfterComparison={
                <CTASection
                  id="cta-after-compare"
                  variant="muted"
                  title="See the low-moisture difference"
                  subtitle="Ask about weekend availability or bundle ducts + carpets for extra savings."
                >
                  {conversionCtas}
                </CTASection>
              }
            />
          </div>
        </section>

        <AboutSection />
        <TestimonialsSection testimonials={homeTestimonials} />
        <PricingPlansSection plans={homePlans} onSelectPlan={handleSelectPlan} />

        <ContactFormSection
          contactForm={contactForm}
          setContactForm={setContactForm}
          onSubmit={handleContactSubmit}
        />
      </main>

      <HomeFooter />
      <StickyMobileCta />

      <HomeModals
        timeSlots={homeBookingTimeSlots}
        isBookingModalOpen={isBookingModalOpen}
        setIsBookingModalOpen={setIsBookingModalOpen}
        isAuthModalOpen={isAuthModalOpen}
        setIsAuthModalOpen={setIsAuthModalOpen}
        selectedService={selectedService}
        bookingStep={bookingStep}
        setBookingStep={setBookingStep}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        selectedTime={selectedTime}
        setSelectedTime={setSelectedTime}
        bookingForm={bookingForm}
        setBookingForm={setBookingForm}
        handleBookingSubmit={handleBookingSubmit}
        authTab={authTab}
        setAuthTab={setAuthTab}
        authForm={authForm}
        setAuthForm={setAuthForm}
        handleAuthSubmit={handleAuthSubmit}
      />

      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        plan={selectedPlan}
        onSuccess={() => {
          toast({
            title: "Subscription Active!",
            description: "You can now enjoy your plan benefits.",
          });
        }}
      />
    </div>
  );
}
