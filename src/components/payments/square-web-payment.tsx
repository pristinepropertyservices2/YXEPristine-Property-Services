'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

type SquareMode =
  | { type: 'booking'; bookingId: string }
  | { type: 'plan'; amount: number; planId: string; planName: string };

type SquareWebPaymentProps = {
  mode: SquareMode;
  onSuccess?: (result: { paymentId: string }) => void | Promise<void>;
  buttonLabel?: string;
};

type SquarePayments = {
  card: () => Promise<{
    attach: (selector: string) => Promise<void>;
    tokenize: () => Promise<{ status: string; token?: string; errors?: unknown[] }>;
    destroy?: () => Promise<void>;
  }>;
};

declare global {
  interface Window {
    Square?: {
      payments: (applicationId: string, locationId: string) => SquarePayments;
    };
  }
}

export function SquareWebPayment({ mode, onSuccess, buttonLabel = 'Pay now' }: SquareWebPaymentProps) {
  const containerId = useRef(`sq-card-${Math.random().toString(36).slice(2, 9)}`);
  const cardRef = useRef<Awaited<ReturnType<SquarePayments['card']>> | null>(null);
  const [ready, setReady] = useState(false);
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadScript = useCallback((src: string) => {
    return new Promise<void>((resolve, reject) => {
      const existing = document.querySelector(`script[src="${src}"]`);
      if (existing) {
        resolve();
        return;
      }
      const s = document.createElement('script');
      s.src = src;
      s.async = true;
      s.onload = () => resolve();
      s.onerror = () => reject(new Error('Failed to load Square.js'));
      document.body.appendChild(s);
    });
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const cfgRes = await fetch('/api/payments/square/config');
        const cfg = await cfgRes.json();
        if (!cfgRes.ok) {
          throw new Error(cfg.error || 'Square is not configured');
        }
        await loadScript(cfg.scriptUrl as string);
        if (cancelled || !window.Square) {
          throw new Error('Square SDK unavailable');
        }
        const payments = window.Square.payments(cfg.applicationId as string, cfg.locationId as string);
        const card = await payments.card();
        await card.attach(`#${containerId.current}`);
        cardRef.current = card;
        if (!cancelled) setReady(true);
      } catch (e) {
        if (!cancelled) {
          const msg = e instanceof Error ? e.message : 'Could not initialize Square';
          setError(msg);
          toast({ title: 'Square', description: msg, variant: 'destructive' });
        }
      }
    })();
    return () => {
      cancelled = true;
      void cardRef.current?.destroy?.();
      cardRef.current = null;
    };
  }, [loadScript]);

  const pay = async () => {
    if (!cardRef.current) return;
    setPaying(true);
    setError(null);
    try {
      const createBody =
        mode.type === 'booking'
          ? { bookingId: mode.bookingId }
          : {
              amount: mode.amount,
              planId: mode.planId,
              planName: mode.planName,
            };

      const createRes = await fetch('/api/payments/square', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(createBody),
      });
      const created = await createRes.json();
      if (!createRes.ok) {
        throw new Error(created.error || 'Could not start payment');
      }

      const tokenResult = await cardRef.current.tokenize();
      if (tokenResult.status !== 'OK' || !tokenResult.token) {
        const detail =
          Array.isArray(tokenResult.errors) && tokenResult.errors.length
            ? JSON.stringify(tokenResult.errors)
            : 'Card tokenization failed';
        throw new Error(detail);
      }

      const confirmRes = await fetch('/api/payments/square/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paymentId: created.paymentId as string,
          sourceId: tokenResult.token,
        }),
      });
      const confirmed = await confirmRes.json();
      if (!confirmRes.ok) {
        throw new Error(confirmed.error || 'Payment was declined');
      }

      await onSuccess?.({ paymentId: created.paymentId as string });
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Payment failed';
      setError(msg);
      toast({ title: 'Payment failed', description: msg, variant: 'destructive' });
    } finally {
      setPaying(false);
    }
  };

  return (
    <div className="space-y-3">
      <div id={containerId.current} className="min-h-[120px] rounded-md border border-input bg-white p-2" />
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
      <Button
        type="button"
        className="w-full bg-purple-700 hover:bg-purple-800"
        disabled={!ready || paying}
        onClick={() => void pay()}
      >
        {paying ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing…
          </>
        ) : (
          buttonLabel
        )}
      </Button>
      <p className="text-xs text-muted-foreground">
        Secure card entry powered by Square. You are charged only when you confirm.
      </p>
    </div>
  );
}
