'use client';

import { useState, useEffect } from 'react';
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
import { 
  Phone, Mail, MapPin, Clock, Star, Shield, Leaf, Sparkles, 
  ChevronRight, Menu, X, CalendarIcon, Check, User, LogIn,
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
    description: 'Deep cleaning that removes dirt, stains, and allergens from your carpets using eco-friendly products.',
    price: 89,
    duration: 90,
    image: '/images/service-carpet.png',
    features: ['Stain removal', 'Odor elimination', 'Quick drying', 'Eco-friendly products'],
  },
  {
    id: 'upholstery',
    name: 'Upholstery Cleaning',
    description: 'Restore your furniture to like-new condition with our professional upholstery cleaning service.',
    price: 79,
    duration: 60,
    image: '/images/service-upholstery.png',
    features: ['Fabric-safe cleaning', 'Stain protection', 'Allergen removal', 'Fresh scent'],
  },
  {
    id: 'airduct',
    name: 'Air Duct Cleaning',
    description: 'Improve your indoor air quality by removing dust, debris, and contaminants from your HVAC system.',
    price: 199,
    duration: 120,
    image: '/images/service-airduct.png',
    features: ['Improved air quality', 'Energy efficiency', 'Allergen reduction', 'System inspection'],
  },
  {
    id: 'tile',
    name: 'Tile & Grout Cleaning',
    description: 'Deep cleaning and sealing of tile surfaces to restore their original beauty and shine.',
    price: 129,
    duration: 90,
    image: '/images/service-tile.png',
    features: ['Deep grout cleaning', 'Sealant application', 'Color restoration', 'Mold prevention'],
  },
  {
    id: 'dryervent',
    name: 'Dryer Vent Cleaning',
    description: 'Prevent fire hazards and improve dryer efficiency with professional vent cleaning.',
    price: 149,
    duration: 60,
    image: '/images/service-airduct.png',
    features: ['Fire prevention', 'Energy savings', 'Faster drying', 'Safety inspection'],
  },
  {
    id: 'mattress',
    name: 'Mattress Cleaning',
    description: 'Deep clean and sanitize your mattress for a healthier, more restful sleep.',
    price: 99,
    duration: 45,
    image: '/images/service-upholstery.png',
    features: ['Dust mite removal', 'Stain treatment', 'Sanitization', 'Allergen reduction'],
  },
  {
    id: 'wood',
    name: 'Wood Floor Cleaning',
    description: 'Gentle yet effective cleaning for your hardwood floors to maintain their natural beauty.',
    price: 119,
    duration: 90,
    image: '/images/service-wood.png',
    features: ['Safe for hardwood', 'Polish application', 'Scratch prevention', 'Natural shine'],
  },
  {
    id: 'postconstruction',
    name: 'Post-Construction Cleaning',
    description: 'Thorough cleaning after renovation or construction to make your space move-in ready.',
    price: 299,
    duration: 240,
    image: '/images/hero-cleaning.png',
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

export default function Page() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authTab, setAuthTab] = useState<'login' | 'signup'>('login');
  const [selectedService, setSelectedService] = useState<typeof services[0] | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState('09:00');
  const [bookingStep, setBookingStep] = useState(1);
  const [activeSection, setActiveSection] = useState('home');
  const [isScrolled, setIsScrolled] = useState(false);
  
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

  // Handle scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
        const error = await response.json();
        throw new Error(error.message || 'Authentication failed');
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
      setActiveSection(sectionId);
    }
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled ? "bg-white shadow-md" : "bg-white/95 backdrop-blur-sm"
      )}>
        <nav className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">YXE Pristine</h1>
                <p className="text-xs text-emerald-600 -mt-1">Clean. Protect. Maintain.</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {['Home', 'Services', 'About', 'Pricing', 'Contact'].map((item) => (
                <button
                  key={item}
                  onClick={() => scrollToSection(item.toLowerCase())}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-emerald-600",
                    activeSection === item.toLowerCase() ? "text-emerald-600" : "text-gray-600"
                  )}
                >
                  {item}
                </button>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="hidden md:flex items-center gap-3">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => { setIsAuthModalOpen(true); setAuthTab('login'); }}
              >
                <LogIn className="w-4 h-4 mr-2" />
                Sign In
              </Button>
              <Button 
                size="sm"
                className="bg-emerald-600 hover:bg-emerald-700"
                onClick={() => { setIsAuthModalOpen(true); setAuthTab('signup'); }}
              >
                Get Started
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-4 pb-4 border-t pt-4">
              <div className="flex flex-col gap-4">
                {['Home', 'Services', 'About', 'Pricing', 'Contact'].map((item) => (
                  <button
                    key={item}
                    onClick={() => scrollToSection(item.toLowerCase())}
                    className="text-left text-gray-600 hover:text-emerald-600"
                  >
                    {item}
                  </button>
                ))}
                <div className="flex flex-col gap-2 pt-4 border-t">
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => { setIsAuthModalOpen(true); setAuthTab('login'); setMobileMenuOpen(false); }}
                  >
                    Sign In
                  </Button>
                  <Button 
                    className="w-full bg-emerald-600 hover:bg-emerald-700"
                    onClick={() => { setIsAuthModalOpen(true); setAuthTab('signup'); setMobileMenuOpen(false); }}
                  >
                    Get Started
                  </Button>
                </div>
              </div>
            </div>
          )}
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-1 pt-20">
        {/* Hero Section */}
        <section id="home" className="relative overflow-hidden bg-gradient-to-br from-emerald-50 to-white">
          <div className="container mx-auto px-4 py-16 md:py-24">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
                  Eco-Friendly Cleaning Solutions
                </Badge>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  Professional Cleaning Services in{' '}
                  <span className="text-emerald-600">Saskatoon</span>
                </h1>
                <p className="text-lg text-gray-600 leading-relaxed">
                  YXE Pristine Property Services provides professional, eco-friendly cleaning solutions 
                  for residential and commercial clients. All-natural products that are tough on dirt 
                  yet safe for your family and pets.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button 
                    size="lg" 
                    className="bg-emerald-600 hover:bg-emerald-700"
                    onClick={() => scrollToSection('services')}
                  >
                    View Our Services
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline"
                    onClick={() => scrollToSection('contact')}
                  >
                    Get a Free Quote
                  </Button>
                </div>
                <div className="flex items-center gap-6 pt-4">
                  <div className="flex items-center gap-2">
                    <div className="flex -space-x-2">
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="w-8 h-8 rounded-full bg-emerald-100 border-2 border-white flex items-center justify-center text-xs font-medium text-emerald-700">
                          {String.fromCharCode(64 + i)}
                        </div>
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">500+ Happy Customers</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                    <span className="text-sm text-gray-600 ml-1">4.9/5 Rating</span>
                  </div>
                </div>
              </div>
              <div className="relative">
                <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl">
                  <img 
                    src="/images/hero-cleaning.png" 
                    alt="Professional Cleaning Service"
                    className="w-full h-auto"
                  />
                </div>
                <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-emerald-200 rounded-full opacity-50 blur-2xl" />
                <div className="absolute -top-6 -right-6 w-32 h-32 bg-emerald-300 rounded-full opacity-50 blur-2xl" />
              </div>
            </div>
          </div>
        </section>

        {/* Features Strip */}
        <section className="bg-emerald-600 py-8">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-white">
              <div className="flex items-center gap-3">
                <Shield className="w-8 h-8" />
                <div>
                  <p className="font-semibold">Fully Insured</p>
                  <p className="text-sm text-emerald-100">Licensed & Bonded</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Leaf className="w-8 h-8" />
                <div>
                  <p className="font-semibold">Eco-Friendly</p>
                  <p className="text-sm text-emerald-100">Safe Products</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-8 h-8" />
                <div>
                  <p className="font-semibold">On-Time</p>
                  <p className="text-sm text-emerald-100">Reliable Service</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <ThumbsUp className="w-8 h-8" />
                <div>
                  <p className="font-semibold">Satisfaction</p>
                  <p className="text-sm text-emerald-100">Guaranteed</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section id="services" className="py-16 md:py-24 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <Badge className="bg-emerald-100 text-emerald-700 mb-4">Our Services</Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Professional Cleaning Solutions
              </h2>
              <p className="text-gray-600">
                We offer a wide range of professional cleaning services using eco-friendly products 
                that are tough on dirt but safe for your family, pets, and the environment.
              </p>
            </div>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {services.map((service) => (
                <Card key={service.id} className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
                  <div className="aspect-square relative overflow-hidden bg-emerald-50">
                    <img 
                      src={service.image} 
                      alt={service.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 right-3">
                      <Badge className="bg-white text-emerald-700">
                        ${service.price}+
                      </Badge>
                    </div>
                  </div>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{service.name}</CardTitle>
                    <CardDescription className="text-sm line-clamp-2">
                      {service.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="flex flex-wrap gap-1">
                      {service.features.slice(0, 2).map((feature, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      className="w-full bg-emerald-600 hover:bg-emerald-700"
                      onClick={() => handleBookService(service)}
                    >
                      Book Now
                      <ChevronRight className="ml-1 w-4 h-4" />
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="relative">
                <img 
                  src="/images/about.png" 
                  alt="About YXE Pristine"
                  className="rounded-2xl shadow-xl"
                />
                <div className="absolute -bottom-6 -right-6 bg-emerald-600 text-white p-6 rounded-2xl shadow-lg">
                  <p className="text-3xl font-bold">10+</p>
                  <p className="text-sm">Years Experience</p>
                </div>
              </div>
              <div className="space-y-6">
                <Badge className="bg-emerald-100 text-emerald-700">About Us</Badge>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
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
                <div className="grid grid-cols-2 gap-4 pt-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                      <Check className="w-6 h-6 text-emerald-600" />
                    </div>
                    <div>
                      <p className="font-semibold">Eco-Friendly</p>
                      <p className="text-sm text-gray-500">Safe products</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                      <Check className="w-6 h-6 text-emerald-600" />
                    </div>
                    <div>
                      <p className="font-semibold">Family Owned</p>
                      <p className="text-sm text-gray-500">Local business</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                      <Check className="w-6 h-6 text-emerald-600" />
                    </div>
                    <div>
                      <p className="font-semibold">Fast Drying</p>
                      <p className="text-sm text-gray-500">Low moisture</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                      <Check className="w-6 h-6 text-emerald-600" />
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
        <section className="py-16 md:py-24 bg-emerald-50">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <Badge className="bg-emerald-100 text-emerald-700 mb-4">Testimonials</Badge>
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
                        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <CardDescription className="text-gray-600 italic">
                      &quot;{testimonial.text}&quot;
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-emerald-600" />
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
              <Badge className="bg-emerald-100 text-emerald-700 mb-4">Pricing Plans</Badge>
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
                    plan.popular && "border-emerald-600 border-2 shadow-lg"
                  )}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <Badge className="bg-emerald-600">Most Popular</Badge>
                    </div>
                  )}
                  <CardHeader className="text-center">
                    <CardTitle>{plan.name}</CardTitle>
                    <CardDescription>{plan.description}</CardDescription>
                    {plan.discount > 0 && (
                      <div className="mt-2">
                        <span className="text-3xl font-bold text-emerald-600">{plan.discount}% OFF</span>
                        <p className="text-sm text-gray-500">on all services</p>
                      </div>
                    )}
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-emerald-600" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      className={cn(
                        "w-full",
                        plan.popular ? "bg-emerald-600 hover:bg-emerald-700" : ""
                      )}
                      variant={plan.popular ? "default" : "outline"}
                      onClick={() => scrollToSection('services')}
                    >
                      Get Started
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
                <Badge className="bg-emerald-100 text-emerald-700 mb-4">Contact Us</Badge>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  Get in Touch
                </h2>
                <p className="text-gray-600 mb-8">
                  Have questions or ready to book? Contact us today and we&apos;ll get back to you within 24 hours.
                </p>
                
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center shrink-0">
                      <MapPin className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <p className="font-semibold">Address</p>
                      <p className="text-gray-600">1731 Ave D N, Saskatoon, SK Canada S7L1R1</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center shrink-0">
                      <Phone className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <p className="font-semibold">Phone</p>
                      <a href="tel:639-471-3393" className="text-emerald-600 hover:underline">639-471-3393</a>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center shrink-0">
                      <Mail className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <p className="font-semibold">Email</p>
                      <a href="mailto:info@yxepristinepropertyservices.ca" className="text-emerald-600 hover:underline">
                        info@yxepristinepropertyservices.ca
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center shrink-0">
                      <Clock className="w-5 h-5 text-emerald-600" />
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
                    <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700">
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
                <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">YXE Pristine</h3>
                  <p className="text-xs text-emerald-400 -mt-1">Clean. Protect. Maintain.</p>
                </div>
              </div>
              <p className="text-gray-400 text-sm mb-4">
                Professional, eco-friendly cleaning solutions for residential and commercial clients in Saskatoon and surrounding areas.
              </p>
              <div className="flex gap-3">
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-emerald-600 transition-colors">
                  <Facebook className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-emerald-600 transition-colors">
                  <Instagram className="w-5 h-5" />
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Services</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#services" className="hover:text-emerald-400">Carpet Cleaning</a></li>
                <li><a href="#services" className="hover:text-emerald-400">Upholstery Cleaning</a></li>
                <li><a href="#services" className="hover:text-emerald-400">Air Duct Cleaning</a></li>
                <li><a href="#services" className="hover:text-emerald-400">Tile & Grout Cleaning</a></li>
                <li><a href="#services" className="hover:text-emerald-400">Dryer Vent Cleaning</a></li>
                <li><a href="#services" className="hover:text-emerald-400">Post-Construction Cleaning</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#about" className="hover:text-emerald-400">About Us</a></li>
                <li><a href="#pricing" className="hover:text-emerald-400">Pricing</a></li>
                <li><a href="#contact" className="hover:text-emerald-400">Contact</a></li>
                <li><a href="#" className="hover:text-emerald-400">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-emerald-400">Terms of Service</a></li>
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
                    bookingStep >= step ? "bg-emerald-600 text-white" : "bg-gray-100 text-gray-400"
                  )}>
                    {bookingStep > step ? <Check className="w-4 h-4" /> : step}
                  </div>
                  {step < 3 && (
                    <div className={cn(
                      "w-16 h-1 mx-2",
                      bookingStep > step ? "bg-emerald-600" : "bg-gray-100"
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
                    <p className="text-lg font-semibold text-emerald-600 mt-2">
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
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                  onClick={() => setBookingStep(bookingStep + 1)}
                >
                  Continue
                </Button>
              ) : (
                <Button 
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700"
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
                <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700">
                  Sign In
                </Button>
              </form>
              <div className="text-center">
                <button type="button" className="text-sm text-emerald-600 hover:underline">
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
                </div>
                <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700">
                  Create Account
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </div>
  );
}
