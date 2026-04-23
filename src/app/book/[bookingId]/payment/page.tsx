'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Loader2, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';

type BookingPayload = {
  id: string;
  totalPrice: number;
  status: string;
  service: { name: string };
  payment: { id: string; status: string } | null;
};

export default function BookingPaymentPage() {
  const params = useParams();
  const bookingId = params.bookingId as string;
  const [booking, setBooking] = useState<BookingPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [method, setMethod] = useState<'stripe' | 'paypal'>('stripe');

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

  const startPayment = async () => {
    if (!booking) return;
    setPaying(true);
    try {
      const create = await fetch(
        method === 'stripe' ? '/api/payments/stripe' : '/api/payments/paypal',
        {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingId }),
        }
      );
      const created = await create.json();
      if (!create.ok) {
        throw new Error(created.error || 'Could not start payment');
      }

      if (method === 'stripe') {
        const checkoutUrl = created.checkoutUrl as string | undefined;
        if (!checkoutUrl) {
          throw new Error('Stripe checkout URL missing');
        }
        window.location.href = checkoutUrl;
        return;
      }

      const approvalUrl = created.approvalUrl as string | undefined;
      if (!approvalUrl) {
        throw new Error('PayPal approval URL missing');
      }
      window.location.href = approvalUrl;
      return;
    } catch (e) {
      toast({
        title: 'Payment error',
        description: e instanceof Error ? e.message : 'Try again',
        variant: 'destructive',
      });
    } finally {
      setPaying(false);
    }
  };

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
            {booking.service.name} — total{' '}
            <strong>${booking.totalPrice.toFixed(2)} CAD</strong>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Choose a payment method. You will be redirected to the official provider checkout.
          </p>
          <div className="grid grid-cols-2 gap-2">
            <Button
              type="button"
              variant={method === 'stripe' ? 'default' : 'outline'}
              className={method === 'stripe' ? 'bg-purple-700 hover:bg-purple-800' : ''}
              onClick={() => setMethod('stripe')}
              disabled={paying}
            >
              Stripe
            </Button>
            <Button
              type="button"
              variant={method === 'paypal' ? 'default' : 'outline'}
              className={method === 'paypal' ? 'bg-purple-700 hover:bg-purple-800' : ''}
              onClick={() => setMethod('paypal')}
              disabled={paying}
            >
              PayPal
            </Button>
          </div>
          <Button
            className="w-full bg-purple-700 hover:bg-purple-800"
            size="lg"
            disabled={paying}
            onClick={startPayment}
          >
            {paying ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Redirecting…
              </>
            ) : (
              `Pay with ${method === 'stripe' ? 'Stripe' : 'PayPal'}`
            )}
          </Button>
          <Button variant="ghost" className="w-full" asChild>
            <Link href="/dashboard">Cancel</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
