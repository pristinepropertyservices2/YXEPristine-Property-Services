"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Alert, AlertDescription } from "@/components/ui/alert";
import type { HomeService } from "@/lib/home-data";
import { Check, CalendarIcon, Clock } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { formatTime24hTo12h } from "@/lib/time-display";

export type AuthFormState = {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
};

export type BookingFormState = {
  address: string;
  city: string;
  postalCode: string;
  notes: string;
};

type HomeModalsProps = {
  timeSlots: string[];
  isBookingModalOpen: boolean;
  setIsBookingModalOpen: (v: boolean) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (v: boolean) => void;
  selectedService: HomeService | null;
  bookingStep: number;
  setBookingStep: (n: number) => void;
  selectedDate: Date | undefined;
  setSelectedDate: (d: Date | undefined) => void;
  selectedTime: string;
  setSelectedTime: (t: string) => void;
  bookingForm: BookingFormState;
  setBookingForm: React.Dispatch<React.SetStateAction<BookingFormState>>;
  handleBookingSubmit: () => void;
  authTab: "login" | "signup";
  setAuthTab: (t: "login" | "signup") => void;
  authForm: AuthFormState;
  setAuthForm: React.Dispatch<React.SetStateAction<AuthFormState>>;
  handleAuthSubmit: (e: React.FormEvent) => void;
};

export function HomeModals({
  timeSlots,
  isBookingModalOpen,
  setIsBookingModalOpen,
  isAuthModalOpen,
  setIsAuthModalOpen,
  selectedService,
  bookingStep,
  setBookingStep,
  selectedDate,
  setSelectedDate,
  selectedTime,
  setSelectedTime,
  bookingForm,
  setBookingForm,
  handleBookingSubmit,
  authTab,
  setAuthTab,
  authForm,
  setAuthForm,
  handleAuthSubmit,
}: HomeModalsProps) {
  return (
    <>
      <Dialog open={isBookingModalOpen} onOpenChange={setIsBookingModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Book {selectedService?.name}</DialogTitle>
            <DialogDescription>
              {selectedService?.price && `Starting at $${selectedService.price}`} • {selectedService?.duration} minutes
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            <div className="mb-4 flex items-center justify-between">
              {[1, 2, 3].map((step) => (
                <div key={step} className="flex items-center">
                  <div
                    className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium",
                      bookingStep >= step ? "bg-neutral-900 text-white" : "bg-gray-100 text-gray-400"
                    )}
                  >
                    {bookingStep > step ? <Check className="h-4 w-4" /> : step}
                  </div>
                  {step < 3 && (
                    <div className={cn("mx-2 h-1 w-16", bookingStep > step ? "bg-neutral-900" : "bg-gray-100")} />
                  )}
                </div>
              ))}
            </div>

            {bookingStep === 1 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Select date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="min-h-11 w-full justify-start">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        disabled={(date) => {
                          const today = new Date();
                          today.setHours(0, 0, 0, 0);
                          return date < today;
                        }}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label>Select time</Label>
                  <Select value={selectedTime} onValueChange={setSelectedTime}>
                    <SelectTrigger className="min-h-11">
                      <SelectValue placeholder="Select time" />
                    </SelectTrigger>
                    <SelectContent>
                      {timeSlots.map((slot) => (
                        <SelectItem key={slot} value={slot}>
                          {formatTime24hTo12h(slot)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Alert>
                  <Clock className="h-4 w-4" />
                  <AlertDescription>
                    Book any day, any time — hourly arrival windows from 12:00 AM through 11:00 PM.
                  </AlertDescription>
                </Alert>
              </div>
            )}

            {bookingStep === 2 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="address">Street address</Label>
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
                      <SelectTrigger className="min-h-11">
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
                    <Label htmlFor="postalCode">Postal code</Label>
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
                  <Label htmlFor="notes">Special instructions (optional)</Label>
                  <Textarea
                    id="notes"
                    placeholder="Any special requests or notes for our team..."
                    value={bookingForm.notes}
                    onChange={(e) => setBookingForm({ ...bookingForm, notes: e.target.value })}
                  />
                </div>

                <div className="rounded-lg bg-gray-50 p-4">
                  <h4 className="mb-2 font-medium">Booking summary</h4>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p>
                      <strong>Service:</strong> {selectedService?.name}
                    </p>
                    <p>
                      <strong>Date:</strong> {selectedDate ? format(selectedDate, "PPPP") : "Not selected"}
                    </p>
                    <p>
                      <strong>Time:</strong> {formatTime24hTo12h(selectedTime)}
                    </p>
                    <p>
                      <strong>Address:</strong> {bookingForm.address}, {bookingForm.city}
                    </p>
                    <p className="mt-2 text-lg font-semibold text-amber-700">Estimated: ${selectedService?.price}+</p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-3">
              {bookingStep > 1 && (
                <Button type="button" variant="outline" className="min-h-11" onClick={() => setBookingStep(bookingStep - 1)}>
                  Back
                </Button>
              )}
              {bookingStep < 3 ? (
                <Button type="button" className="min-h-11 flex-1 bg-amber-500 text-neutral-950 hover:bg-amber-400" onClick={() => setBookingStep(bookingStep + 1)}>
                  Continue
                </Button>
              ) : (
                <Button type="button" className="min-h-11 flex-1 bg-amber-500 text-neutral-950 hover:bg-amber-400" onClick={handleBookingSubmit}>
                  Confirm booking
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isAuthModalOpen} onOpenChange={setIsAuthModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Welcome to YXE Pristine</DialogTitle>
            <DialogDescription>Sign in to manage your bookings and access exclusive offers.</DialogDescription>
          </DialogHeader>

          <Tabs value={authTab} onValueChange={(v) => setAuthTab(v as "login" | "signup")}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Sign in</TabsTrigger>
              <TabsTrigger value="signup">Sign up</TabsTrigger>
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
                <Button type="submit" className="min-h-11 w-full bg-amber-500 text-neutral-950 hover:bg-amber-400">
                  Sign in
                </Button>
              </form>
              <div className="text-center">
                <button type="button" className="text-sm text-amber-800 hover:underline">
                  Forgot your password?
                </button>
              </div>
            </TabsContent>

            <TabsContent value="signup" className="space-y-4">
              <form onSubmit={handleAuthSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-name">Full name</Label>
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
                  <p className="text-xs text-muted-foreground">At least 8 characters, with uppercase, lowercase, and a number.</p>
                </div>
                <Button type="submit" className="min-h-11 w-full bg-amber-500 text-neutral-950 hover:bg-amber-400">
                  Create account
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </>
  );
}
