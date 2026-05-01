'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { PaymentModal } from '@/components/payment-modal';
import { 
  Phone, Mail, MapPin, Clock, Star, Shield, Leaf, Sparkles, 
  ChevronRight, CalendarIcon, Check, User,
  Facebook, Instagram, ArrowRight, ThumbsUp
} from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';

// Services data
const services = [
  {
    id: 'carpet',
    name: 'Carpet Cleaning',
    description: 'Includes cleaning, deodorizing, disinfecting, and protecting for carpets and rugs.',
    price: 119,
    duration: 90,
    image: '/Capet Cleaning1.png',
    features: ['$119 - First 2 Rooms', 'Whole House: $269 (5 rooms + hall)', 'Additional Rooms: $60 each', 'Single Room: $75 (only with other services)'],
  },
  {
    id: 'upholstery',
    name: 'Upholstery Cleaning',
    description: 'Includes cleaning, deodorizing, disinfecting, and protecting for upholstered furniture.',
    price: 119,
    duration: 60,
    image: '/Upholstery Cleaning 1.png',
    features: ['Sofa: $139 | Loveseat: $99 | Chair: $70', 'All 3 Pieces: $269', 'L-Shaped Sectional: $189 - $350', 'U-Shaped Sectional: $229 - $400'],
  },
  {
    id: 'airduct',
    name: 'Air Duct Cleaning',
    description: 'Includes cleaning, deodorizing, and disinfecting for full HVAC duct systems.',
    price: 249,
    duration: 120,
    image: '/Air Duct Cleaning 1.png',
    features: ['$249 - Up to 10 vents (full system cleaning)', 'Additional vents: $35 each', 'Permanent electrostatic air filter: $125', 'Dryer vent add-on: from $50 with duct cleaning'],
  },
  {
    id: 'tile',
    name: 'Tile & Grout Cleaning',
    description: 'Includes cleaning, deodorizing, and disinfecting for tile, grout, and shower areas.',
    price: 119,
    duration: 90,
    image: '/Tile and Grout Cleaning 1.png',
    features: ['$99 - First 2 areas (up to 200 sq. ft.)', 'Additional areas: $0.60 per sq. ft.', 'Grout color sealing: $1.25 per sq. ft.', 'Shower walls & floors: $1.50 per sq. ft.'],
  },
  {
    id: 'dryervent',
    name: 'Dryer Vent Cleaning',
    description: 'Includes cleaning, deodorizing, and disinfecting to improve airflow and reduce fire risk.',
    price: 119,
    duration: 60,
    image: '/Dryer Vent Cleaning 2.png',
    features: ['Side wall vent: $119', 'Roof vent: $149', 'Save $50 when combined with Air Duct Cleaning', 'Full lint, dust, and debris removal included'],
  },
  {
    id: 'mattress',
    name: 'Mattress Cleaning',
    description: 'Includes cleaning, deodorizing, disinfecting, and protecting for cleaner, healthier sleep surfaces.',
    price: 119,
    duration: 45,
    image: '/Mattress cleaning 1.png',
    features: ['Twin: $89 (one side)', 'Queen: $109 (one side)', 'King: $139 (one side)', '2nd side: 50% OFF'],
  },
  {
    id: 'wood',
    name: 'Wood Floor Cleaning',
    description: 'Includes cleaning, deodorizing, disinfecting, and sealing for wood floor protection.',
    price: 149,
    duration: 90,
    image: '/Hard Wood Floor Cleaning1.png',
    features: ['$0.99 per sq. ft. (cleaning + 2 sealant coats)', 'Additional sealant coat: +$0.25 per sq. ft.', 'Hardwood-safe process', 'Helps maintain natural shine and finish'],
  },
  {
    id: 'postconstruction',
    name: 'Post-Construction Cleaning',
    description: 'Thorough cleaning after renovation or construction to make your space move-in ready.',
    price: 299,
    duration: 240,
    image: '/post constuction cleaning 1.png',
    features: ['Dust removal', 'Debris cleanup', 'Window cleaning', 'Final detailing'],
  },
];

// Pricing plans
const plans = [
  {
    id: 'one-time',
    name: 'One-Time Service',
    type: 'ONE_TIME',
    discount: 0,
    description: 'Perfect for occasional deep cleaning needs',
    features: ['Flexible scheduling', 'No commitment', 'All services available', 'Single payment'],
  },
  {
    id: 'weekly',
    name: 'Weekly Plan',
    type: 'WEEKLY',
    discount: 15,
    description: 'Save 15% with weekly recurring services',
    features: ['15% discount on all services', 'Priority scheduling', 'Consistent cleaner', 'Easy rescheduling'],
    popular: true,
  },
  {
    id: 'monthly',
    name: 'Monthly Plan',
    type: 'MONTHLY',
    discount: 10,
    description: 'Save 10% with monthly recurring services',
    features: ['10% discount on all services', 'Flexible scheduling', 'Same cleaner option', 'Cancel anytime'],
  },
];

// Testimonials
const testimonials = [
  {
    name: 'Sarah M.',
    location: 'Saskatoon',
    rating: 5,
    text: 'Exceptional service! My carpets look brand new. The team was professional, on time, and used eco-friendly products which was important for my family.',
    service: 'Carpet Cleaning',
  },
  {
    name: 'Mike T.',
    location: 'Martensville',
    rating: 5,
    text: 'Best air duct cleaning service in Saskatoon! Noticed immediate improvement in air quality. Highly recommend YXE Pristine!',
    service: 'Air Duct Cleaning',
  },
  {
    name: 'Jennifer L.',
    location: 'Warman',
    rating: 5,
    text: 'The upholstery cleaning saved my favorite sofa! They removed stains I thought were permanent. Amazing work!',
    service: 'Upholstery Cleaning',
  },
];

// Time slots
const timeSlots = [
  '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'
];

const HERO_LOCATION = 'Saskatoon';

export default function Page() {
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [authTab, setAuthTab] = useState<'login' | 'signup'>('login');
  const [selectedService, setSelectedService] = useState<typeof services[0] | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<typeof plans[0] | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState('09:00');
  const [bookingStep, setBookingStep] = useState(1);
  const [typedLocation, setTypedLocation] = useState('');
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

  // Form states
  const [bookingForm, setBookingForm] = useState({
    address: '',
    city: 'Saskatoon',
    postalCode: '',
    notes: '',
  });
  
  const [authForm, setAuthForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  // Handle booking
  const handleBookService = (service: typeof services[0]) => {
    setSelectedService(service);
    setBookingStep(1);
    setIsBookingModalOpen(true);
  };

  const handleBookingSubmit = async () => {
    if (!selectedService || !selectedDate) {
      toast({
        title: 'Please complete all fields',
        description: 'Select a date and time for your booking.',
        variant: 'destructive',
      });
      return;
    }

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
          title: 'Booking Confirmed!',
          description: 'We will contact you shortly to confirm your appointment.',
        });
        setIsBookingModalOpen(false);
        resetBookingForm();
      } else {
        throw new Error('Booking failed');
      }
    } catch {
      toast({
        title: 'Booking Submitted',
        description: 'We received your request and will contact you soon.',
      });
      setIsBookingModalOpen(false);
      resetBookingForm();
    }
  };

  const resetBookingForm = () => {
    setSelectedService(null);
    setSelectedDate(undefined);
    setSelectedTime('09:00');
    setBookingForm({
      address: '',
      city: 'Saskatoon',
      postalCode: '',
      notes: '',
    });
    setBookingStep(1);
  };

  // Handle auth
  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const endpoint = authTab === 'signup' ? '/api/auth/signup' : '/api/auth/login';
      const body = authTab === 'signup' 
        ? authForm 
        : { email: authForm.email, password: authForm.password };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        toast({
          title: authTab === 'signup' ? 'Account Created!' : 'Welcome Back!',
          description: authTab === 'signup' 
            ? 'Please check your email to verify your account.' 
            : 'You have been logged in successfully.',
        });
        setIsAuthModalOpen(false);
        setAuthForm({ name: '', email: '', phone: '', password: '', confirmPassword: '' });
      } else {
        const data = await response.json();
        const msg =
          (typeof data.error === 'string' && data.error) ||
          (typeof data.message === 'string' && data.message) ||
          'Authentication failed';
        throw new Error(msg);
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    }
  };

  // Handle contact form
  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contactForm),
      });

      if (response.ok) {
        toast({
          title: 'Message Sent!',
          description: 'Thank you for contacting us. We will respond within 24 hours.',
        });
        setContactForm({ name: '', email: '', phone: '', message: '' });
      }
    } catch {
      toast({
        title: 'Message Sent!',
        description: 'Thank you for contacting us. We will respond within 24 hours.',
      });
      setContactForm({ name: '', email: '', phone: '', message: '' });
    }
  };

  // Scroll to section
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Handle plan selection
  const handleSelectPlan = (plan: typeof plans[0]) => {
    setSelectedPlan(plan);
    setIsPaymentModalOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Main Content */}
      <main className="flex-1">
        {/* Hero Section */}
        <section id="home" className="relative overflow-hidden">
          <Image
            src="/498e6ba5-7e29-43f7-816c-dd5035d604d3.png"
            alt=""
            fill
            priority
            sizes="100vw"
            className="absolute inset-0 z-0 object-cover"
          />
          <div
            className="pointer-events-none absolute inset-0 z-[1]"
            aria-hidden
            style={{ backgroundColor: "rgba(0, 0, 0, 0.59)" }}
          />
          <div className="container relative z-10 mx-auto px-4 py-16 md:py-24">
            <div className="max-w-4xl md:max-w-3xl">
              <div className="space-y-6">
                <Badge className="border-0 bg-gradient-to-r from-[#B8860B] via-[#D4AF37] to-[#C9971A] text-black hover:from-[#A57908] hover:via-[#CFA52A] hover:to-[#B8860B]">
                  Eco-Friendly Cleaning Solutions
                </Badge>
                <h1
                  className="text-4xl font-bold leading-tight text-white md:text-5xl lg:text-6xl"
                  aria-label={`Professional Cleaning Services in ${HERO_LOCATION}`}
                >
                  <span className="block">Professional Cleaning</span>
                  <span className="mt-1 block max-w-full overflow-x-auto whitespace-nowrap sm:mt-0.5 md:mt-1 [-ms-overflow-style:none] [scrollbar-width:none]">
                    Services in{" "}
                    <span className="inline-flex min-w-[10.75ch] items-baseline whitespace-nowrap font-bold text-amber-600 align-baseline">
                      <span aria-hidden>{typedLocation}</span>
                      {typingCursorVisible && (
                        <span
                          aria-hidden
                          className="ml-1 inline-block h-[0.9em] w-0.5 shrink-0 translate-y-0.5 align-bottom bg-amber-500 animate-pulse md:ml-1.5"
                        />
                      )}
                    </span>
                  </span>
                </h1>
                <p className="text-lg text-white/90 leading-relaxed">
                  YXE Pristine Property Services provides professional, eco-friendly cleaning solutions 
                  for residential and commercial clients. All-natural products that are tough on dirt 
                  yet safe for your family and pets.
                </p>
                <div className="flex">
                  <Button
                    size="lg"
                    asChild
                    className="bg-gradient-to-r from-[#B8860B] via-[#D4AF37] to-[#C9971A] text-black font-semibold shadow-lg hover:from-[#A57908] hover:via-[#CFA52A] hover:to-[#B8860B]"
                  >
                    <Link href="/services">Book Your Service Today</Link>
                  </Button>
                </div>
                <div className="flex items-center gap-6 pt-4">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} className="w-4 h-4 fill-[#D4AF37] text-[#D4AF37]" />
                    ))}
                    <span className="text-sm text-white/90 ml-1">4.9/5 Rating</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Strip */}
        <section className="bg-purple-900 pt-8 pb-6 md:pb-7">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-white">
              <div className="flex items-center gap-3">
                <Shield className="w-8 h-8" />
                <div>
                  <p className="font-semibold">Fully Insured</p>
                  <p className="text-sm text-purple-100">Licensed & Bonded</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Leaf className="w-8 h-8" />
                <div>
                  <p className="font-semibold">Eco-Friendly</p>
                  <p className="text-sm text-purple-100">Safe Products</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-8 h-8" />
                <div>
                  <p className="font-semibold">On-Time</p>
                  <p className="text-sm text-purple-100">Reliable Service</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <ThumbsUp className="w-8 h-8" />
                <div>
                  <p className="font-semibold">Satisfaction</p>
                  <p className="text-sm text-purple-100">Guaranteed</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section id="services" className="bg-gray-50 pt-8 pb-16 md:pt-10 md:pb-24">
          <div className="container mx-auto px-4">
            <div className="mx-auto mb-12 max-w-3xl text-center md:mb-16">
              <Badge className="mb-5 border border-amber-200/80 bg-gradient-to-r from-[#B8860B]/15 via-[#D4AF37]/20 to-[#C9971A]/15 px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-amber-900">
                Our Services
              </Badge>
              <h2 className="text-3xl font-semibold tracking-tight text-neutral-900 md:text-[2.375rem] md:leading-snug lg:text-[2.75rem]">
                Professional Cleaning Solutions
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-pretty text-base leading-relaxed text-neutral-600 md:text-lg">
                Boutique-quality care across every surface — eco-conscious products,
                meticulous technicians, and clear, upfront pricing for your home or business.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 sm:gap-7 lg:grid-cols-4 lg:gap-6 xl:gap-8">
              {services.map((service) => (
                <Card
                  key={service.id}
                  className={cn(
                    "group relative flex flex-col gap-0 overflow-hidden rounded-[1.375rem] border border-neutral-200/90 bg-white p-0 shadow-none",
                    "ring-1 ring-neutral-950/[0.04]",
                    "transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
                    "hover:-translate-y-2 hover:border-purple-200/70 hover:shadow-[0_28px_60px_-12px_rgba(62,31,107,0.22)] hover:ring-purple-950/[0.08]"
                  )}
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-neutral-100">
                    <Image
                      src={service.image}
                      alt={service.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover transition-[transform,filter] duration-700 ease-out group-hover:scale-[1.045] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                    />
                    <div
                      aria-hidden
                      className="absolute inset-0 bg-gradient-to-t from-neutral-950/55 via-neutral-950/10 to-transparent opacity-95 transition-opacity duration-500 group-hover:from-neutral-950/65"
                    />
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/35 to-transparent" />
                    <div className="absolute right-4 top-4 flex flex-col items-end gap-1">
                      <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/90 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-neutral-900 shadow-sm backdrop-blur-md">
                        <span className="h-1 w-1 rounded-full bg-amber-500" />
                        From ${service.price}
                      </span>
                      <span className="rounded-full bg-black/35 px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-widest text-white/90 backdrop-blur-sm">
                        {service.duration} min avg
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-1 flex-col px-6 pb-5 pt-6">
                    <CardTitle className="text-xl font-semibold leading-snug tracking-tight text-neutral-900 md:text-[1.35rem]">
                      {service.name}
                    </CardTitle>
                    <CardDescription className="mt-2.5 line-clamp-2 text-sm leading-relaxed text-neutral-600">
                      {service.description}
                    </CardDescription>

                    <ul className="mt-5 space-y-2.5 border-t border-neutral-100 pt-5">
                      {service.features.slice(0, 2).map((feature, idx) => (
                        <li
                          key={`${service.id}-${idx}`}
                          className="flex gap-2.5 text-[13px] leading-snug text-neutral-600"
                        >
                          <span className="mt-1.5 flex h-1 w-1 shrink-0 rounded-full bg-gradient-to-br from-amber-500 to-amber-700 ring-[3px] ring-amber-500/25" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <CardFooter className="mt-auto flex w-full flex-col gap-3 border-0 bg-transparent px-0 pt-7 pb-0">
                      <Button
                        size="lg"
                        className="group/btn relative w-full overflow-hidden rounded-2xl border-0 bg-gradient-to-r from-[#3a1f58] via-[#5E2C8A] to-[#4a2570] px-6 py-6 text-sm font-semibold tracking-wide text-white shadow-[0_12px_34px_-8px_rgba(62,31,107,0.55)] transition-[transform,box-shadow,filter] duration-300 hover:shadow-[0_18px_44px_-8px_rgba(62,31,107,0.58)] hover:brightness-[1.06] active:scale-[0.99] motion-reduce:transition-none"
                        onClick={() => handleBookService(service)}
                      >
                        <span className="relative z-10 flex w-full items-center justify-center gap-2">
                          Book this service
                          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-0.5" />
                        </span>
                      </Button>
                      <Link
                        href={`/services/${service.id}`}
                        prefetch={false}
                        className="text-center text-xs font-medium tracking-wide text-purple-950/65 underline-offset-4 transition-colors hover:text-purple-900 hover:underline"
                      >
                        View pricing &amp; details
                      </Link>
                    </CardFooter>
                  </div>
                </Card>
              ))}
            </div>

            <div className="mx-auto mt-10 max-w-8xl rounded-2xl border border-purple-100 bg-white/95 p-6 shadow-sm md:p-10">
              <div className="grid items-center gap-8 md:grid-cols-[1.25fr_1fr]">
                <div>
                  <p className="text-center text-3xl md:text-5xl font-bold leading-tight md:text-left">
                    <span className="text-purple-900">All-Natural</span>
                    <br />
                    <span className="text-purple-900">Carpet Cleaning</span>
                    <br />
                    <span className="text-amber-700">for Your Home</span>
                    <br />
                    <span className="text-amber-700">or Business...</span>
                  </p>
                  <p className="mt-6 text-left text-gray-700 leading-relaxed">
                    At YXE Pristine Property Services, we believe a truly clean space should be healthy, safe, and welcoming.
                    Our all-natural, eco-friendly carpet cleaning solution delivers a deep, thorough clean without harsh chemicals
                    or excessive moisture. Our low-moisture cleaning process uses biodegradable, plant-based products that are tough
                    on dirt and stains but gentle on your carpets, your family, your pets, and the environment. With fast drying times,
                    exceptional results, and a commitment to quality, YXE Pristine Property Services is the trusted choice for homes
                    and businesses across the region.
                  </p>
                  <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="rounded-xl border border-purple-100 px-4 py-5 text-center">
                      <Leaf className="mx-auto h-9 w-9 text-amber-700" />
                      <p className="mt-3 text-sm font-bold tracking-wide text-purple-900">ECO-FRIENDLY</p>
                      <p className="mt-2 text-sm text-gray-600">Safe for your family, pets, and the planet.</p>
                    </div>
                    <div className="rounded-xl border border-purple-100 px-4 py-5 text-center">
                      <Shield className="mx-auto h-9 w-9 text-amber-700" />
                      <p className="mt-3 text-sm font-bold tracking-wide text-purple-900">TRUSTED PROFESSIONALS</p>
                      <p className="mt-2 text-sm text-gray-600">Highly trained and experienced technicians.</p>
                    </div>
                    <div className="rounded-xl border border-purple-100 px-4 py-5 text-center">
                      <Sparkles className="mx-auto h-9 w-9 text-amber-700" />
                      <p className="mt-3 text-sm font-bold tracking-wide text-purple-900">PREMIUM QUALITY RESULTS</p>
                      <p className="mt-2 text-sm text-gray-600">Noticeably cleaner carpets that last longer.</p>
                    </div>
                    <div className="rounded-xl border border-purple-100 px-4 py-5 text-center">
                      <Clock className="mx-auto h-9 w-9 text-amber-700" />
                      <p className="mt-3 text-sm font-bold tracking-wide text-purple-900">FAST DRYING</p>
                      <p className="mt-2 text-sm text-gray-600">Low moisture means quicker dry times and less disruption.</p>
                    </div>
                  </div>
                </div>
                <div className="overflow-hidden rounded-xl border border-purple-100">
                  <Image
                    src="/Pasted image (2).png"
                    alt="Carpet cleaning technician"
                    width={1400}
                    height={2800}
                    sizes="(max-width: 768px) 100vw, 45vw"
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
            </div>

            <div className="mx-auto mt-10 max-w-8xl rounded-2xl border border-purple-100 bg-white/95 p-6 shadow-sm md:p-10">
              <div className="text-center">
                <h3 className="text-3xl md:text-5xl font-bold text-purple-900">Carpet Cleaning vs. Steam Cleaning</h3>
                <p className="mt-2 text-lg text-gray-600">There&apos;s a better, cleaner way.</p>
              </div>

              <div className="relative mt-8 grid gap-6 lg:grid-cols-2">
                <div className="rounded-2xl border border-purple-100 bg-white overflow-hidden">
                  <div className="bg-purple-900 px-6 py-4 text-center">
                    <p className="text-2xl font-bold text-white">YXE Pristine Property Services</p>
                    <p className="text-lg font-semibold text-amber-300">Low-Moisture, Eco-Friendly Cleaning</p>
                  </div>
                  <ul className="space-y-4 p-6 text-gray-700">
                    {[
                      "Uses minimal water and all-natural, biodegradable solutions",
                      "Dries in 1-3 hours",
                      "Gentle on carpets - extends their life",
                      "Reduces risk of mold, mildew, and bacteria",
                      "Safe for kids, pets, and the environment",
                      "Leaves carpets clean, fresh & ready to enjoy",
                    ].map((item) => (
                      <li key={item} className="flex items-start gap-3">
                        <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-purple-900 text-white">
                          <Check className="h-3.5 w-3.5" />
                        </span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-2xl border border-amber-200 bg-white overflow-hidden">
                  <div className="bg-amber-600 px-6 py-4 text-center">
                    <p className="text-2xl font-bold text-white">Traditional Steam Cleaning</p>
                    <p className="text-lg font-semibold text-amber-100">High-Moisture, Conventional Methods</p>
                  </div>
                  <ul className="space-y-4 p-6 text-gray-700">
                    {[
                      "Uses high pressure and excessive water",
                      "Dries in 12-24+ hours",
                      "Can lead to carpet shrinkage and wear",
                      "Higher risk of mold and mildew",
                      "May contain harsh chemicals and residues",
                      "Longer drying time disrupts your day",
                    ].map((item) => (
                      <li key={item} className="flex items-start gap-3">
                        <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-600 text-white">
                          <Check className="h-3.5 w-3.5" />
                        </span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pointer-events-none absolute inset-0 hidden items-center justify-center lg:flex">
                  <div className="rounded-full border-4 border-white bg-purple-900 px-5 py-4 text-3xl font-bold text-white shadow-lg">
                    VS.
                  </div>
                </div>
              </div>
            </div>

            <div className="mx-auto mt-8 max-w-8xl overflow-hidden rounded-3xl border border-purple-200 bg-gradient-to-r from-white via-purple-50/40 to-purple-100/70 shadow-sm">
              <div className="grid gap-0 lg:grid-cols-[1.15fr_0.85fr]">
                <div className="p-6 md:p-10">
                  <p className="text-3xl font-semibold leading-tight text-amber-700 md:text-4xl">
                    Our Technicians are
                  </p>
                  <h3 className="mt-2 text-4xl font-bold leading-tight text-purple-900 md:text-6xl">
                    Trusted and Skilled
                    <br />
                    Cleaning Experts
                  </h3>
                  <p className="mt-6 max-w-2xl text-base leading-relaxed text-gray-700 md:text-lg">
                    YXE Pristine Property Services are not your typical carpet cleaners.
                    Every tech is trained to identify and treat carpets, upholstery, tile,
                    hardwood, and more using safe, effective methods.
                  </p>
                  <p className="mt-4 max-w-2xl text-base leading-relaxed text-gray-700 md:text-lg">
                    When our team arrives at your home or business, you can expect friendly
                    service, professional care, and results you can see.
                  </p>

                  <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {[
                      { icon: Shield, label: "Trusted Pros" },
                      { icon: User, label: "Expert Team" },
                      { icon: Sparkles, label: "Quality Results" },
                      { icon: Leaf, label: "Better For Home" },
                    ].map((item) => (
                      <div
                        key={item.label}
                        className="rounded-xl border border-purple-100 bg-white px-3 py-4 text-center"
                      >
                        <item.icon className="mx-auto h-8 w-8 text-purple-800" />
                        <p className="mt-2 text-sm font-semibold text-purple-900">
                          {item.label}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-center bg-gradient-to-br from-purple-900 via-purple-800 to-purple-700 p-8 md:p-10">
                  <div className="w-full max-w-sm rounded-2xl border border-white/20 bg-white/10 p-6 text-center text-white backdrop-blur-sm">
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-300">
                      YXE Pristine
                    </p>
                    <p className="mt-2 text-3xl font-bold md:text-4xl">Clean. Protect. Maintain.</p>
                    <p className="mt-4 text-sm text-white/90 md:text-base">
                      Professional residential and commercial cleaning services across
                      Saskatoon and surrounding areas.
                    </p>
                    <div className="mt-6 rounded-xl bg-white px-4 py-3 text-purple-900">
                      <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                        Book A Service
                      </p>
                      <p className="text-lg font-bold md:text-xl">(306) 802-2227</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-16 md:py-24 bg-gradient-to-b from-white to-purple-50/30">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="relative">
                <Image
                  src="/1a4b07c0-2828-46a3-b082-e4c5e0bc9ded.png"
                  alt="Cleaning supplies in a bucket"
                  width={1200}
                  height={1600}
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="rounded-2xl shadow-2xl w-full h-[520px] md:h-[680px] object-cover border border-white/30"
                />
                <div className="absolute inset-0 rounded-2xl ring-1 ring-black/10" />
                <div className="absolute -bottom-6 -right-6 bg-amber-600 text-white p-6 rounded-2xl shadow-lg">
                  <p className="text-3xl font-bold">10+</p>
                  <p className="text-sm">Years Experience</p>
                </div>
              </div>
              <div className="space-y-6 rounded-2xl bg-white/90 p-6 md:p-8 border border-purple-100 shadow-sm backdrop-blur-sm">
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <Badge className="border-0 bg-gradient-to-r from-[#B8860B] via-[#D4AF37] to-[#C9971A] text-black">About Us</Badge>
                  <span className="text-xs font-medium text-purple-700 bg-purple-50 px-3 py-1 rounded-full">
                    Trusted in Saskatoon
                  </span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
                  Locally Owned, Family-Run Cleaning Excellence
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  YXE Pristine Property Services is a locally owned, family-run cleaning and property 
                  maintenance company proudly serving Saskatoon and surrounding areas. We provide 
                  professional, eco-friendly cleaning solutions for both residential and commercial clients.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  Our all-natural cleaning products are tough on dirt, stains, and buildup, yet safe 
                  for your family, pets, employees, and customers. Using advanced low-moisture cleaning 
                  methods, we deliver deep, effective results with fast drying times and no harsh chemicals.
                </p>
                <div className="grid grid-cols-3 gap-3">
                  <div className="rounded-xl bg-purple-50 p-3 text-center">
                    <p className="text-xl font-bold text-purple-800">500+</p>
                    <p className="text-xs text-gray-600">Happy clients</p>
                  </div>
                  <div className="rounded-xl bg-amber-50 p-3 text-center">
                    <p className="text-xl font-bold text-amber-700">4.9/5</p>
                    <p className="text-xs text-gray-600">Average rating</p>
                  </div>
                  <div className="rounded-xl bg-purple-50 p-3 text-center">
                    <p className="text-xl font-bold text-purple-800">100%</p>
                    <p className="text-xs text-gray-600">Insured team</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-4">
                  <div className="flex items-center gap-3 rounded-xl bg-gray-50 p-3">
                    <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center shrink-0">
                      <Check className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                      <p className="font-semibold">Eco-Friendly</p>
                      <p className="text-sm text-gray-500">Safe products</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 rounded-xl bg-gray-50 p-3">
                    <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center shrink-0">
                      <Check className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                      <p className="font-semibold">Family Owned</p>
                      <p className="text-sm text-gray-500">Local business</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 rounded-xl bg-gray-50 p-3">
                    <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center shrink-0">
                      <Check className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                      <p className="font-semibold">Fast Drying</p>
                      <p className="text-sm text-gray-500">Low moisture</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 rounded-xl bg-gray-50 p-3">
                    <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center shrink-0">
                      <Check className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                      <p className="font-semibold">Insured</p>
                      <p className="text-sm text-gray-500">Fully covered</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-16 md:py-24 bg-purple-50">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <Badge className="border-0 bg-gradient-to-r from-[#B8860B] via-[#D4AF37] to-[#C9971A] text-black mb-4">Testimonials</Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                What Our Customers Say
              </h2>
              <p className="text-gray-600">
                We take pride in building long-term relationships with our clients through 
                honest service and dependable workmanship.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {testimonials.map((testimonial, idx) => (
                <Card key={idx} className="bg-white">
                  <CardHeader>
                    <div className="flex items-center gap-1 mb-2">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-[#D4AF37] text-[#D4AF37]" />
                      ))}
                    </div>
                    <CardDescription className="text-gray-600 italic">
                      &quot;{testimonial.text}&quot;
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-amber-600" />
                      </div>
                      <div>
                        <p className="font-semibold">{testimonial.name}</p>
                        <p className="text-sm text-gray-500">{testimonial.location}</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="mt-3">
                      {testimonial.service}
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <Badge className="border-0 bg-gradient-to-r from-[#B8860B] via-[#D4AF37] to-[#C9971A] text-black mb-4">Pricing Plans</Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Flexible Plans for Every Need
              </h2>
              <p className="text-gray-600">
                Choose the plan that works best for you. Save more with our recurring service plans.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {plans.map((plan) => (
                <Card 
                  key={plan.id} 
                  className={cn(
                    "relative",
                    plan.popular && "border-amber-500 border-2 shadow-lg"
                  )}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <Badge className="bg-amber-600 text-white">Most Popular</Badge>
                    </div>
                  )}
                  <CardHeader className="text-center">
                    <CardTitle>{plan.name}</CardTitle>
                    <CardDescription>{plan.description}</CardDescription>
                    {plan.discount > 0 && (
                      <div className="mt-2">
                        <span className="text-3xl font-bold text-amber-600">{plan.discount}% OFF</span>
                        <p className="text-sm text-gray-500">on all services</p>
                      </div>
                    )}
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-amber-600" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      className={cn(
                        "w-full",
                        plan.popular ? "bg-amber-600 hover:bg-amber-700" : ""
                      )}
                      variant={plan.popular ? "default" : "outline"}
                      onClick={() => handleSelectPlan(plan)}
                    >
                      {plan.type === 'ONE_TIME' ? 'Get Started' : 'Subscribe Now'}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-16 md:py-24 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12">
              <div>
                <Badge className="border-0 bg-gradient-to-r from-[#B8860B] via-[#D4AF37] to-[#C9971A] text-black mb-4">Contact Us</Badge>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  Get in Touch
                </h2>
                <p className="text-gray-600 mb-8">
                  Have questions or ready to book? Contact us today and we&apos;ll get back to you within 24 hours.
                </p>
                
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-purple-900 shadow-sm ring-1 ring-purple-950/35">
                      <MapPin className="h-5 w-5 text-white" strokeWidth={2} />
                    </div>
                    <div>
                      <p className="font-semibold">Address</p>
                      <p className="text-gray-600">1731 Ave D N, Saskatoon, SK Canada S7L1R1</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-purple-900 shadow-sm ring-1 ring-purple-950/35">
                      <Phone className="h-5 w-5 text-white" strokeWidth={2} />
                    </div>
                    <div>
                      <p className="font-semibold">Phone</p>
                      <a href="tel:639-471-3393" className="text-amber-700 hover:underline">639-471-3393</a>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-purple-900 shadow-sm ring-1 ring-purple-950/35">
                      <Mail className="h-5 w-5 text-white" strokeWidth={2} />
                    </div>
                    <div>
                      <p className="font-semibold">Email</p>
                      <a href="mailto:info@yxepristinepropertyservices.ca" className="text-amber-700 hover:underline">
                        info@yxepristinepropertyservices.ca
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-purple-900 shadow-sm ring-1 ring-purple-950/35">
                      <Clock className="h-5 w-5 text-white" strokeWidth={2} />
                    </div>
                    <div>
                      <p className="font-semibold">Working Hours</p>
                      <p className="text-gray-600">Monday - Friday: 8:00 AM - 5:00 PM</p>
                      <p className="text-gray-600">Saturday & Sunday: Closed</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle>Send us a Message</CardTitle>
                  <CardDescription>
                    Fill out the form below and we&apos;ll get back to you shortly.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleContactSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input 
                        id="name" 
                        placeholder="Your name"
                        value={contactForm.name}
                        onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input 
                          id="email" 
                          type="email"
                          placeholder="your@email.com"
                          value={contactForm.email}
                          onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone</Label>
                        <Input 
                          id="phone" 
                          type="tel"
                          placeholder="(306) 000-0000"
                          value={contactForm.phone}
                          onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="message">Message</Label>
                      <Textarea 
                        id="message" 
                        placeholder="How can we help you?"
                        rows={4}
                        value={contactForm.message}
                        onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full bg-purple-700 hover:bg-purple-800">
                      Send Message
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-auto">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-white rounded-lg p-2">
                  <Image
                    src="/images/logo.png"
                    alt="YXE Pristine Property Services"
                    width={160}
                    height={48}
                    className="h-12 w-auto"
                  />
                </div>
              </div>
              <p className="text-gray-400 text-sm mb-4">
                Professional, eco-friendly cleaning solutions for residential and commercial clients in Saskatoon and surrounding areas.
              </p>
              <div className="flex gap-3">
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-purple-700 transition-colors">
                  <Facebook className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-purple-700 transition-colors">
                  <Instagram className="w-5 h-5" />
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Services</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#services" className="hover:text-amber-500">Carpet Cleaning</a></li>
                <li><a href="#services" className="hover:text-amber-500">Upholstery Cleaning</a></li>
                <li><a href="#services" className="hover:text-amber-500">Air Duct Cleaning</a></li>
                <li><a href="#services" className="hover:text-amber-500">Tile & Grout Cleaning</a></li>
                <li><a href="#services" className="hover:text-amber-500">Dryer Vent Cleaning</a></li>
                <li><a href="#services" className="hover:text-amber-500">Post-Construction Cleaning</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#about" className="hover:text-amber-500">About Us</a></li>
                <li><a href="#pricing" className="hover:text-amber-500">Pricing</a></li>
                <li><a href="#contact" className="hover:text-amber-500">Contact</a></li>
                <li><a href="#" className="hover:text-amber-500">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-amber-500">Terms of Service</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Service Areas</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>Saskatoon</li>
                <li>Martensville</li>
                <li>Warman</li>
                <li>Osler</li>
                <li>Langham</li>
                <li>Surrounding Towns</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} YXE Pristine Property Services. All rights reserved.
            </p>
            <p className="text-gray-400 text-sm mt-2 md:mt-0">
              Made with care in Saskatoon, SK
            </p>
          </div>
        </div>
      </footer>

      {/* Booking Modal */}
      <Dialog open={isBookingModalOpen} onOpenChange={setIsBookingModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Book {selectedService?.name}</DialogTitle>
            <DialogDescription>
              {selectedService?.price && `Starting at $${selectedService.price}`} • {selectedService?.duration} minutes
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Progress Steps */}
            <div className="flex items-center justify-between mb-4">
              {[1, 2, 3].map((step) => (
                <div key={step} className="flex items-center">
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
                    bookingStep >= step ? "bg-purple-700 text-white" : "bg-gray-100 text-gray-400"
                  )}>
                    {bookingStep > step ? <Check className="w-4 h-4" /> : step}
                  </div>
                  {step < 3 && (
                    <div className={cn(
                      "w-16 h-1 mx-2",
                      bookingStep > step ? "bg-purple-700" : "bg-gray-100"
                    )} />
                  )}
                </div>
              ))}
            </div>

            {bookingStep === 1 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Select Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {selectedDate ? format(selectedDate, 'PPP') : 'Pick a date'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        disabled={(date) => date < new Date() || date.getDay() === 0 || date.getDay() === 6}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
                <div className="space-y-2">
                  <Label>Select Time</Label>
                  <Select value={selectedTime} onValueChange={setSelectedTime}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select time" />
                    </SelectTrigger>
                    <SelectContent>
                      {timeSlots.map((slot) => (
                        <SelectItem key={slot} value={slot}>
                          {slot}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <Alert>
                  <Clock className="w-4 h-4" />
                  <AlertDescription>
                    Available Monday - Friday, 8:00 AM - 5:00 PM
                  </AlertDescription>
                </Alert>
              </div>
            )}

            {bookingStep === 2 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="address">Street Address</Label>
                  <Input 
                    id="address"
                    placeholder="123 Main Street"
                    value={bookingForm.address}
                    onChange={(e) => setBookingForm({ ...bookingForm, address: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Select value={bookingForm.city} onValueChange={(v) => setBookingForm({ ...bookingForm, city: v })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Saskatoon">Saskatoon</SelectItem>
                        <SelectItem value="Martensville">Martensville</SelectItem>
                        <SelectItem value="Warman">Warman</SelectItem>
                        <SelectItem value="Osler">Osler</SelectItem>
                        <SelectItem value="Langham">Langham</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="postalCode">Postal Code</Label>
                    <Input 
                      id="postalCode"
                      placeholder="S7L 1R1"
                      value={bookingForm.postalCode}
                      onChange={(e) => setBookingForm({ ...bookingForm, postalCode: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            )}

            {bookingStep === 3 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="notes">Special Instructions (Optional)</Label>
                  <Textarea 
                    id="notes"
                    placeholder="Any special requests or notes for our team..."
                    value={bookingForm.notes}
                    onChange={(e) => setBookingForm({ ...bookingForm, notes: e.target.value })}
                  />
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium mb-2">Booking Summary</h4>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p><strong>Service:</strong> {selectedService?.name}</p>
                    <p><strong>Date:</strong> {selectedDate ? format(selectedDate, 'PPPP') : 'Not selected'}</p>
                    <p><strong>Time:</strong> {selectedTime}</p>
                    <p><strong>Address:</strong> {bookingForm.address}, {bookingForm.city}</p>
                    <p className="mt-2 text-lg font-semibold text-amber-700">
                      Estimated: ${selectedService?.price}+
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-3">
              {bookingStep > 1 && (
                <Button variant="outline" onClick={() => setBookingStep(bookingStep - 1)}>
                  Back
                </Button>
              )}
              {bookingStep < 3 ? (
                <Button 
                  className="flex-1 bg-purple-700 hover:bg-purple-800"
                  onClick={() => setBookingStep(bookingStep + 1)}
                >
                  Continue
                </Button>
              ) : (
                <Button 
                  className="flex-1 bg-purple-700 hover:bg-purple-800"
                  onClick={handleBookingSubmit}
                >
                  Confirm Booking
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Auth Modal */}
      <Dialog open={isAuthModalOpen} onOpenChange={setIsAuthModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Welcome to YXE Pristine</DialogTitle>
            <DialogDescription>
              Sign in to manage your bookings and access exclusive offers.
            </DialogDescription>
          </DialogHeader>
          
          <Tabs value={authTab} onValueChange={(v) => setAuthTab(v as 'login' | 'signup')}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login" className="space-y-4">
              <form onSubmit={handleAuthSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">Email</Label>
                  <Input 
                    id="login-email"
                    type="email"
                    placeholder="your@email.com"
                    value={authForm.email}
                    onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password">Password</Label>
                  <Input 
                    id="login-password"
                    type="password"
                    value={authForm.password}
                    onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })}
                    required
                  />
                </div>
                <Button type="submit" className="w-full bg-purple-700 hover:bg-purple-800">
                  Sign In
                </Button>
              </form>
              <div className="text-center">
                <button type="button" className="text-sm text-purple-700 hover:underline">
                  Forgot your password?
                </button>
              </div>
            </TabsContent>
            
            <TabsContent value="signup" className="space-y-4">
              <form onSubmit={handleAuthSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-name">Full Name</Label>
                  <Input 
                    id="signup-name"
                    placeholder="John Doe"
                    value={authForm.name}
                    onChange={(e) => setAuthForm({ ...authForm, name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input 
                    id="signup-email"
                    type="email"
                    placeholder="your@email.com"
                    value={authForm.email}
                    onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-phone">Phone</Label>
                  <Input 
                    id="signup-phone"
                    type="tel"
                    placeholder="(306) 000-0000"
                    value={authForm.phone}
                    onChange={(e) => setAuthForm({ ...authForm, phone: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <Input 
                    id="signup-password"
                    type="password"
                    value={authForm.password}
                    onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })}
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    At least 8 characters, with uppercase, lowercase, and a number.
                  </p>
                </div>
                <Button type="submit" className="w-full bg-purple-700 hover:bg-purple-800">
                  Create Account
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        plan={selectedPlan}
        onSuccess={() => {
          toast({
            title: 'Subscription Active!',
            description: 'You can now enjoy your plan benefits.',
          });
        }}
      />
    </div>
  );
}
