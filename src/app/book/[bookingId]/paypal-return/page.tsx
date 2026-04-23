'use client';

import { useEffect } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function PayPalReturnPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const bookingId = params.bookingId as string;
  const orderId = searchParams.get('token');
  const paymentId = searchParams.get('payment_id');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!orderId) {
        router.replace(`/book/${bookingId}/failed?provider=paypal`);
        return;
      }
      try {
        const res = await fetch('/api/payments/paypal/capture', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ orderId, paymentId }),
        });
        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.error || 'PayPal capture failed');
        }
        if (!cancelled) {
          router.replace(`/book/${bookingId}/success?provider=paypal`);
        }
      } catch {
        if (!cancelled) {
          router.replace(`/book/${bookingId}/failed?provider=paypal`);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [bookingId, orderId, paymentId, router]);

  return (
    <div className="container flex min-h-[70vh] items-center justify-center py-16">
      <div className="text-center">
        <Loader2 className="mx-auto h-10 w-10 animate-spin text-purple-600" />
        <p className="mt-4 text-sm text-muted-foreground">Finalizing PayPal payment...</p>
      </div>
    </div>
  );
}

