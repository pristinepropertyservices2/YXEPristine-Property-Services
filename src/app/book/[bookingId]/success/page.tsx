'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useSearchParams } from 'next/navigation';
import { CheckCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function BookingSuccessPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const bookingId = params.bookingId as string;
  const provider = searchParams.get('provider');
  const sessionId = searchParams.get('session_id');
  const paymentId = searchParams.get('payment_id');
  const [verifying, setVerifying] = useState(provider === 'stripe' && !!sessionId && !!paymentId);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (provider !== 'stripe' || !sessionId || !paymentId) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch('/api/payments/stripe/confirm', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId, paymentId }),
        });
        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.error || 'Stripe confirmation failed');
        }
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : 'Failed to verify payment');
        }
      } finally {
        if (!cancelled) setVerifying(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [provider, sessionId, paymentId]);

  return (
    <div className="container flex min-h-[70vh] items-center justify-center py-16">
      <Card className="max-w-md text-center">
        <CardHeader>
          {verifying ? (
            <Loader2 className="mx-auto h-14 w-14 animate-spin text-purple-600" />
          ) : (
            <CheckCircle className="mx-auto h-14 w-14 text-green-600" />
          )}
          <CardTitle className="text-2xl">
            {verifying ? 'Verifying payment...' : 'Booking confirmed'}
          </CardTitle>
          <CardDescription>
            {error
              ? error
              : `Thank you! Your payment was received. Reference: ${bookingId}`}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-2 sm:flex-row sm:justify-center">
          <Button asChild className="bg-purple-700 hover:bg-purple-800">
            <Link href="/dashboard">View dashboard</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/">Home</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
