'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { CalendarIcon, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import {
  applyPercentDiscount,
  calculateBookingTotal,
  type AddOnLine,
} from '@/lib/booking-price';
import { formatTime24hTo12h } from '@/lib/time-display';
import { toast } from '@/hooks/use-toast';

import { BOOKING_TIME_SLOTS_24H } from '@/lib/booking-time-slots';

type ServiceListItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  image: string | null;
  features: string[];
};

type ServiceDetail = ServiceListItem & {
  addOns: { id: string; name: string; description: string | null; price: number }[];
};

const STEPS = [
  'Service',
  'Date & time',
  'Address',
  'Extras & duration',
  'Review',
  'Confirm',
] as const;

export function BookingWizard() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [services, setServices] = useState<ServiceListItem[]>([]);
  const [loadingServices, setLoadingServices] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [detail, setDetail] = useState<ServiceDetail | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [time, setTime] = useState('09:00');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Saskatoon');
  const [postalCode, setPostalCode] = useState('');
  const [notes, setNotes] = useState('');
  const [durationMinutes, setDurationMinutes] = useState(90);
  const [selectedAddOnIds, setSelectedAddOnIds] = useState<Set<string>>(new Set());
  const [submitting, setSubmitting] = useState(false);
  const [planDiscount, setPlanDiscount] = useState<{
    planName: string;
    discountPercent: number;
  } | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/subscriptions/active');
        const data = await res.json();
        if (res.ok && data.discount?.discountPercent > 0) {
          setPlanDiscount({
            planName: data.discount.planName,
            discountPercent: data.discount.discountPercent,
          });
        }
      } catch {
        /* guest or no active plan */
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/services');
        const data = await res.json();
        if (res.ok && data.services?.length) {
          setServices(data.services);
        }
      } finally {
        setLoadingServices(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (!selectedId) {
      setDetail(null);
      return;
    }
    let cancelled = false;
    setLoadingDetail(true);
    (async () => {
      try {
        const res = await fetch(`/api/services/${selectedId}`);
        const data = await res.json();
        if (!cancelled && res.ok && data.service) {
          const s = data.service as ServiceDetail;
          setDetail(s);
          setDurationMinutes(s.duration);
          setSelectedAddOnIds(new Set());
        }
      } finally {
        if (!cancelled) setLoadingDetail(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [selectedId]);

  const addOnLines: AddOnLine[] = useMemo(() => {
    if (!detail) return [];
    return detail.addOns
      .filter((a) => selectedAddOnIds.has(a.id))
      .map((a) => ({ id: a.id, name: a.name, price: a.price }));
  }, [detail, selectedAddOnIds]);

  const subtotal = useMemo(() => {
    if (!detail) return 0;
    return calculateBookingTotal(
      detail.price,
      detail.duration,
      durationMinutes,
      addOnLines
    );
  }, [detail, durationMinutes, addOnLines]);

  const estimatedTotal = useMemo(() => {
    if (!planDiscount) return subtotal;
    return applyPercentDiscount(subtotal, planDiscount.discountPercent);
  }, [subtotal, planDiscount]);

  const toggleAddOn = (id: string) => {
    setSelectedAddOnIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const canNext = () => {
    if (step === 0) return !!selectedId;
    if (step === 1) return !!date;
    if (step === 2) return address.trim().length > 3 && city.trim() && postalCode.trim();
    if (step === 3) return !!detail;
    if (step === 4) return true;
    return true;
  };

  const handleConfirm = async () => {
    if (!detail || !date) return;
    setSubmitting(true);
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceId: detail.id,
          date: date.toISOString(),
          time,
          address,
          city,
          postalCode,
          notes: notes || undefined,
          durationMinutes,
          addOnIds: Array.from(selectedAddOnIds),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Booking failed');
      }
      toast({
        title: 'Booking created',
        description: 'Continue to payment to confirm your appointment.',
      });
      router.push(`/book/${data.booking.id}/payment`);
    } catch (e) {
      toast({
        title: 'Error',
        description: e instanceof Error ? e.message : 'Try again',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingServices) {
    return (
      <div className="flex justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Book a service</h1>
        <p className="text-muted-foreground">
          Step {step + 1} of {STEPS.length}: {STEPS[step]}
        </p>
        <div className="mt-4 flex gap-1">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className={cn(
                'h-1 flex-1 rounded-full',
                i <= step ? 'bg-purple-600' : 'bg-muted'
              )}
            />
          ))}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{STEPS[step]}</CardTitle>
          <CardDescription>
            {step === 0 && 'Choose the service you need.'}
            {step === 1 && 'Pick a date and hourly arrival time — any day, 12:00 AM–11:00 PM.'}
            {step === 2 && 'Where should we visit?'}
            {step === 3 && 'Add extras and adjust visit duration.'}
            {step === 4 && 'Review your estimate.'}
            {step === 5 && 'Create your booking and go to payment.'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {step === 0 && (
            <div className="grid gap-3 sm:grid-cols-2">
              {services.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setSelectedId(s.id)}
                  className={cn(
                    'flex flex-col rounded-lg border p-3 text-left transition hover:border-purple-400',
                    selectedId === s.id && 'border-purple-600 ring-1 ring-purple-600'
                  )}
                >
                  <span className="font-medium">{s.name}</span>
                  <span className="text-sm text-muted-foreground line-clamp-2">
                    {s.description}
                  </span>
                  <span className="mt-2 text-sm font-semibold text-purple-700">
                    From ${s.price} · {s.duration} min
                  </span>
                </button>
              ))}
            </div>
          )}

          {step === 1 && (
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        'w-full justify-start text-left font-normal',
                        !date && 'text-muted-foreground'
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, 'PPP') : 'Pick a date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      disabled={(d) => d < new Date(new Date().setHours(0, 0, 0, 0))}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <Label>Time</Label>
                <Select value={time} onValueChange={setTime}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {BOOKING_TIME_SLOTS_24H.map((t) => (
                      <SelectItem key={t} value={t}>
                        {formatTime24hTo12h(t)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="addr">Street address</Label>
                <Input
                  id="addr"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="123 Example St"
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pc">Postal code</Label>
                  <Input
                    id="pc"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Notes (optional)</Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                />
              </div>
            </div>
          )}

          {step === 3 && detail && (
            <div className="space-y-6">
              {loadingDetail ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                <>
                  <div className="space-y-2">
                    <Label>
                      Visit duration: {durationMinutes} minutes (base {detail.duration} min)
                    </Label>
                    <Slider
                      value={[durationMinutes]}
                      min={detail.duration}
                      max={detail.duration * 3}
                      step={15}
                      onValueChange={(v) => setDurationMinutes(v[0])}
                    />
                    <p className="text-xs text-muted-foreground">
                      Longer visits scale the base service price proportionally.
                    </p>
                  </div>
                  <div className="space-y-3">
                    <Label>Extras</Label>
                    {detail.addOns.length === 0 ? (
                      <p className="text-sm text-muted-foreground">No extras for this service.</p>
                    ) : (
                      detail.addOns.map((a) => (
                        <label
                          key={a.id}
                          className="flex cursor-pointer items-start gap-3 rounded-lg border p-3"
                        >
                          <Checkbox
                            checked={selectedAddOnIds.has(a.id)}
                            onCheckedChange={() => toggleAddOn(a.id)}
                          />
                          <span className="flex-1">
                            <span className="font-medium">{a.name}</span>
                            {a.description && (
                              <span className="block text-sm text-muted-foreground">
                                {a.description}
                              </span>
                            )}
                            <span className="text-sm font-semibold text-purple-700">
                              +${a.price.toFixed(2)}
                            </span>
                          </span>
                        </label>
                      ))
                    )}
                  </div>
                </>
              )}
            </div>
          )}

          {step === 4 && detail && date && (
            <div className="space-y-3 text-sm">
              <p>
                <strong>Service:</strong> {detail.name}
              </p>
              <p>
                <strong>When:</strong> {format(date, 'PPP')} at {formatTime24hTo12h(time)}
              </p>
              <p>
                <strong>Where:</strong> {address}, {city} {postalCode}
              </p>
              <p>
                <strong>Duration:</strong> {durationMinutes} minutes
              </p>
              {addOnLines.length > 0 && (
                <div>
                  <strong>Extras:</strong>
                  <ul className="list-inside list-disc">
                    {addOnLines.map((a) => (
                      <li key={a.id}>
                        {a.name} (${a.price.toFixed(2)})
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {planDiscount ? (
                <div className="space-y-1 rounded-lg border border-green-200 bg-green-50 p-3">
                  <p>
                    <strong>Subtotal:</strong> ${subtotal.toFixed(2)} CAD
                  </p>
                  <p className="text-green-800">
                    <strong>
                      {planDiscount.planName} ({planDiscount.discountPercent}% off):
                    </strong>{' '}
                    −${(subtotal - estimatedTotal).toFixed(2)} CAD
                  </p>
                  <p className="text-lg font-semibold text-purple-800">
                    Estimated total: ${estimatedTotal.toFixed(2)} CAD
                  </p>
                </div>
              ) : (
                <p className="text-lg font-semibold text-purple-800">
                  Estimated total: ${estimatedTotal.toFixed(2)} CAD
                </p>
              )}
              <p className="text-xs text-muted-foreground">
                Final amount is confirmed on the server when you create the booking.
              </p>
            </div>
          )}

          {step === 5 && detail && date && (
            <div className="space-y-4">
              {planDiscount ? (
                <p>
                  Subtotal ${subtotal.toFixed(2)} CAD —{' '}
                  <strong>
                    {planDiscount.discountPercent}% {planDiscount.planName} discount
                  </strong>{' '}
                  applied. You will pay <strong>${estimatedTotal.toFixed(2)} CAD</strong>{' '}
                  securely with Square.
                </p>
              ) : (
                <p>
                  You will be redirected to pay <strong>${estimatedTotal.toFixed(2)} CAD</strong>{' '}
                  securely with Square.
                </p>
              )}
              <Button
                className="w-full bg-purple-700 hover:bg-purple-800"
                size="lg"
                disabled={submitting}
                onClick={handleConfirm}
              >
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating…
                  </>
                ) : (
                  'Create booking & continue to payment'
                )}
              </Button>
            </div>
          )}

          <div className="flex justify-between pt-2">
            <Button
              type="button"
              variant="outline"
              disabled={step === 0}
              onClick={() => setStep((s) => Math.max(0, s - 1))}
            >
              <ChevronLeft className="mr-1 h-4 w-4" />
              Back
            </Button>
            {step < STEPS.length - 1 ? (
              <Button
                type="button"
                className="bg-purple-700 hover:bg-purple-800"
                disabled={!canNext() || (step === 3 && loadingDetail)}
                onClick={() => setStep((s) => Math.min(STEPS.length - 1, s + 1))}
              >
                Next
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            ) : null}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
