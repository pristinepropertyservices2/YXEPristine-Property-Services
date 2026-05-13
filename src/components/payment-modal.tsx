'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Check, Loader2, ShieldCheck } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import Link from 'next/link';
import { SquareWebPayment } from '@/components/payments/square-web-payment';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: {
    id: string;
    name: string;
    type: string;
    discount: number;
    description?: string;
  } | null;
  onSuccess?: () => void;
}

export function PaymentModal({ isOpen, onClose, plan, onSuccess }: PaymentModalProps) {
  const { data: session, status } = useSession();
  const [paymentStep, setPaymentStep] = useState<'details' | 'payment' | 'processing' | 'success'>('details');

  const [customerDetails, setCustomerDetails] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: 'Saskatoon',
    postalCode: '',
  });

  const subscriptionPrice = plan?.type === 'WEEKLY' ? 29.99 : plan?.type === 'MONTHLY' ? 19.99 : 0;

  const resetModal = useCallback(() => {
    setPaymentStep('details');
  }, []);

  useEffect(() => {
    if (!isOpen) {
      resetModal();
    }
  }, [isOpen, resetModal]);

  const handleContinueToPayment = () => {
    if (!customerDetails.name || !customerDetails.email) {
      toast({
        title: 'Required fields missing',
        description: 'Please fill in your name and email.',
        variant: 'destructive',
      });
      return;
    }
    if (status !== 'authenticated' || !session?.user?.id) {
      toast({
        title: 'Sign in required',
        description: 'Please sign in to pay with Square.',
        variant: 'destructive',
      });
      return;
    }
    setPaymentStep('payment');
  };

  const handlePlanPaid = async ({ paymentId: _paymentId }: { paymentId: string }) => {
    if (!plan || !session?.user?.id) return;
    setPaymentStep('processing');
    try {
      const subRes = await fetch('/api/subscriptions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: session.user.id,
          planId: plan.id,
          paymentId,
        }),
      });
      const subData = await subRes.json();
      if (!subRes.ok) {
        throw new Error(subData.error || 'Could not activate subscription');
      }
      setPaymentStep('success');
      toast({
        title: 'Payment successful',
        description: `Your ${plan.name} plan is now active.`,
      });
      onSuccess?.();
    } catch (e) {
      console.error(e);
      setPaymentStep('payment');
      toast({
        title: 'Subscription error',
        description: e instanceof Error ? e.message : 'Try again',
        variant: 'destructive',
      });
    }
  };

  if (!plan) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {paymentStep === 'success' ? (
              <>
                <Check className="h-5 w-5 text-green-500" />
                Payment Complete
              </>
            ) : (
              <>
                <ShieldCheck className="h-5 w-5 text-purple-700" />
                Subscribe to {plan.name}
              </>
            )}
          </DialogTitle>
          <DialogDescription>
            {paymentStep === 'success'
              ? 'Your subscription has been activated successfully.'
              : `${plan.discount > 0 ? `${plan.discount}% discount on all services` : 'Pay as you go'}`}
          </DialogDescription>
        </DialogHeader>

        {paymentStep === 'details' && (
          <div className="space-y-4">
            <div className="mb-4 rounded-lg bg-purple-50 p-4">
              <div className="flex items-center justify-between">
                <span className="font-medium">{plan.name}</span>
                <Badge className="bg-purple-700">
                  {plan.discount > 0 ? `${plan.discount}% OFF` : 'No commitment'}
                </Badge>
              </div>
              {subscriptionPrice > 0 && (
                <p className="mt-2 text-2xl font-bold text-purple-700">${subscriptionPrice.toFixed(2)}/month</p>
              )}
            </div>

            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  placeholder="John Doe"
                  value={customerDetails.name}
                  onChange={(e) => setCustomerDetails({ ...customerDetails, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  value={customerDetails.email}
                  onChange={(e) => setCustomerDetails({ ...customerDetails, email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="(306) 000-0000"
                  value={customerDetails.phone}
                  onChange={(e) => setCustomerDetails({ ...customerDetails, phone: e.target.value })}
                />
              </div>
            </div>

            <Button className="w-full bg-purple-700 hover:bg-purple-800" onClick={handleContinueToPayment}>
              Continue to payment
            </Button>
            {status !== 'authenticated' ? (
              <p className="text-center text-sm text-muted-foreground">
                <Link href="/auth/signin" className="text-purple-700 underline">
                  Sign in
                </Link>{' '}
                to pay with Square.
              </p>
            ) : null}
          </div>
        )}

        {paymentStep === 'payment' && session?.user?.id && plan && subscriptionPrice > 0 && (
          <div className="space-y-4">
            <SquareWebPayment
              mode={{
                type: 'plan',
                amount: subscriptionPrice,
                planId: plan.id,
                planName: plan.name,
              }}
              buttonLabel={`Pay $${subscriptionPrice.toFixed(2)} with Square`}
              onSuccess={handlePlanPaid}
            />
            <Button variant="ghost" className="w-full" onClick={() => setPaymentStep('details')}>
              Back to details
            </Button>
          </div>
        )}

        {paymentStep === 'payment' && subscriptionPrice <= 0 && (
          <p className="text-sm text-muted-foreground">This plan has no charge configured.</p>
        )}

        {paymentStep === 'processing' && (
          <div className="py-12 text-center">
            <Loader2 className="mx-auto mb-4 h-12 w-12 animate-spin text-purple-700" />
            <p className="text-lg font-medium">Activating your subscription…</p>
          </div>
        )}

        {paymentStep === 'success' && (
          <div className="space-y-4 py-8 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            <div>
              <p className="text-lg font-medium">Welcome to {plan.name}!</p>
              <p className="text-sm text-gray-500">
                {plan.discount > 0
                  ? `You now get ${plan.discount}% off on all services.`
                  : 'You can now book services at standard rates.'}
              </p>
            </div>
            <Button className="bg-purple-700 hover:bg-purple-800" onClick={onClose}>
              Start booking
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
