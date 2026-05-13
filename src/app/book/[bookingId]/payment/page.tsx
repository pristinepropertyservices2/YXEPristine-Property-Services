'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { Loader2, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { SquareWebPayment } from '@/components/payments/square-web-payment';

type BookingPayload = {
  id: string;
  totalPrice: number;
  status: string;
  service: { name: string };
  payment: { id: string; status: string } | null;
};

export default function BookingPaymentPage() {
  const params = useParams();
  const router = useRouter();
  const bookingId = params.bookingId as string;
  const [booking, setBooking] = useState<BookingPayload | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/bookings/${bookingId}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Not found');
        if (!cancelled) setBooking(data.booking);
      } catch (e) {
        if (!cancelled) {
          toast({
            title: 'Error',
            description: e instanceof Error ? e.message : 'Failed to load',
            variant: 'destructive',
          });
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [bookingId]);

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="container py-16 text-center">
        <p className="text-muted-foreground">Booking not found.</p>
        <Button asChild className="mt-4">
          <Link href="/dashboard">Back to dashboard</Link>
        </Button>
      </div>
    );
  }

  if (booking.payment?.status === 'COMPLETED' || booking.status === 'CONFIRMED') {
    return (
      <div className="container max-w-lg py-16">
        <Card>
          <CardHeader>
            <CardTitle>Already paid</CardTitle>
            <CardDescription>This booking is already confirmed.</CardDescription>
          </CardHeader>
          <CardContent className="flex gap-2">
            <Button asChild>
              <Link href={`/book/${bookingId}/success`}>View confirmation</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/dashboard">Dashboard</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-lg py-16">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Pay for booking
          </CardTitle>
          <CardDescription>
            {booking.service.name} — total <strong>${booking.totalPrice.toFixed(2)} CAD</strong>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Pay securely with Square. Your card is processed by Square; we never store card numbers on
            our servers.
          </p>
          <SquareWebPayment
            mode={{ type: 'booking', bookingId }}
            buttonLabel={`Pay $${booking.totalPrice.toFixed(2)} with Square`}
            onSuccess={() => {
              router.push(`/book/${bookingId}/success?provider=square`);
            }}
          />
          <Button variant="ghost" className="w-full" asChild>
            <Link href="/dashboard">Cancel</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
