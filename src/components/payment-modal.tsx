'use client';

import { useState, useEffect, useCallback } from 'react';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  CreditCard, 
  Check, 
  Loader2, 
  Lock, 
  ShieldCheck,
  AlertCircle 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';

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
  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'paypal'>('stripe');
  const [isLoading, setIsLoading] = useState(false);
  const [paymentStep, setPaymentStep] = useState<'details' | 'payment' | 'processing' | 'success'>('details');
  
  // Customer details
  const [customerDetails, setCustomerDetails] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: 'Saskatoon',
    postalCode: '',
  });

  // Card details (for demo - in production, use Stripe Elements)
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvc: '',
  });

  // Payment IDs
  const [paymentId, setPaymentId] = useState<string | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [isDemo, setIsDemo] = useState(false);

  // Calculate subscription price (plans are subscriptions with discounts)
  const subscriptionPrice = plan?.type === 'WEEKLY' ? 29.99 : plan?.type === 'MONTHLY' ? 19.99 : 0;

  const resetModal = useCallback(() => {
    setPaymentStep('details');
    setPaymentMethod('stripe');
    setIsLoading(false);
    setPaymentId(null);
    setClientSecret(null);
    setOrderId(null);
    setIsDemo(false);
    setCardDetails({ number: '', expiry: '', cvc: '' });
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
    setPaymentStep('payment');
  };

  const handleStripePayment = async () => {
    if (!cardDetails.number || !cardDetails.expiry || !cardDetails.cvc) {
      toast({
        title: 'Card details required',
        description: 'Please enter your card information.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    setPaymentStep('processing');

    try {
      // Create payment intent
      const response = await fetch('/api/payments/stripe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: subscriptionPrice,
          planId: plan?.id,
          planName: plan?.name,
          userId: customerDetails.email, // Using email as temp ID
          userEmail: customerDetails.email,
          description: `${plan?.name} subscription`,
        }),
      });

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      setPaymentId(data.paymentId);
      setClientSecret(data.clientSecret);
      setIsDemo(data.isDemo || false);

      // In demo mode, simulate payment completion
      if (data.isDemo) {
        // Simulate processing delay
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Confirm the demo payment
        const confirmResponse = await fetch('/api/payments/stripe/confirm', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            paymentIntentId: data.clientSecret.split('_secret_')[0],
            paymentId: data.paymentId,
            isDemo: true,
          }),
        });

        const confirmData = await confirmResponse.json();

        if (confirmData.success) {
          // Create subscription
          await fetch('/api/subscriptions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              userId: customerDetails.email,
              planId: plan?.id,
              paymentId: data.paymentId,
            }),
          });

          setPaymentStep('success');
          toast({
            title: 'Payment Successful!',
            description: `Your ${plan?.name} is now active.`,
          });
          onSuccess?.();
        }
      } else {
        // In production, you would use Stripe.js to confirm the payment
        // For now, we'll simulate success
        await new Promise(resolve => setTimeout(resolve, 2000));
        setPaymentStep('success');
        toast({
          title: 'Payment Successful!',
          description: `Your ${plan?.name} is now active.`,
        });
        onSuccess?.();
      }
    } catch (error) {
      console.error('Payment error:', error);
      setPaymentStep('payment');
      toast({
        title: 'Payment Failed',
        description: 'There was an error processing your payment. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePayPalPayment = async () => {
    setIsLoading(true);
    setPaymentStep('processing');

    try {
      // Create PayPal order
      const response = await fetch('/api/payments/paypal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: subscriptionPrice,
          planId: plan?.id,
          planName: plan?.name,
          userId: customerDetails.email,
          description: `${plan?.name} subscription`,
        }),
      });

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      setPaymentId(data.paymentId);
      setOrderId(data.orderId);
      setIsDemo(data.isDemo || false);

      // In demo mode, simulate PayPal completion
      if (data.isDemo) {
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Capture the demo payment
        const captureResponse = await fetch('/api/payments/paypal/capture', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            orderId: data.orderId,
            paymentId: data.paymentId,
            isDemo: true,
          }),
        });

        const captureData = await captureResponse.json();

        if (captureData.success) {
          // Create subscription
          await fetch('/api/subscriptions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              userId: customerDetails.email,
              planId: plan?.id,
              paymentId: data.paymentId,
            }),
          });

          setPaymentStep('success');
          toast({
            title: 'Payment Successful!',
            description: `Your ${plan?.name} is now active.`,
          });
          onSuccess?.();
        }
      } else {
        // In production, redirect to PayPal approval URL
        if (data.approvalUrl) {
          window.open(data.approvalUrl, '_blank');
        }
        setPaymentStep('payment');
        toast({
          title: 'PayPal Authorization Required',
          description: 'Please complete the payment in the PayPal window.',
        });
      }
    } catch (error) {
      console.error('PayPal error:', error);
      setPaymentStep('payment');
      toast({
        title: 'Payment Failed',
        description: 'There was an error with PayPal. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    return parts.length ? parts.join(' ') : value;
  };

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return `${v.substring(0, 2)}/${v.substring(2, 4)}`;
    }
    return v;
  };

  if (!plan) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {paymentStep === 'success' ? (
              <>
                <Check className="w-5 h-5 text-green-500" />
                Payment Complete
              </>
            ) : (
              <>
                <ShieldCheck className="w-5 h-5 text-purple-700" />
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
            <div className="bg-purple-50 rounded-lg p-4 mb-4">
              <div className="flex justify-between items-center">
                <span className="font-medium">{plan.name}</span>
                <Badge className="bg-purple-700">
                  {plan.discount > 0 ? `${plan.discount}% OFF` : 'No commitment'}
                </Badge>
              </div>
              {subscriptionPrice > 0 && (
                <p className="text-2xl font-bold text-purple-700 mt-2">
                  ${subscriptionPrice.toFixed(2)}/month
                </p>
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

            <Button
              className="w-full bg-purple-700 hover:bg-purple-800"
              onClick={handleContinueToPayment}
            >
              Continue to Payment
            </Button>
          </div>
        )}

        {paymentStep === 'payment' && (
          <div className="space-y-4">
            <Tabs value={paymentMethod} onValueChange={(v) => setPaymentMethod(v as 'stripe' | 'paypal')}>
              <TabsList className="grid grid-cols-2 w-full">
                <TabsTrigger value="stripe" className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4" />
                  Card
                </TabsTrigger>
                <TabsTrigger value="paypal" className="flex items-center gap-2">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944 3.72a.641.641 0 0 1 .632-.54h6.098c2.057 0 3.604.416 4.597 1.237.952.788 1.424 1.932 1.424 3.447 0 .41-.034.827-.102 1.24-.004.023-.008.046-.013.07-.452 2.326-1.79 3.874-3.98 4.61-.9.311-1.943.468-3.098.468H8.45a.641.641 0 0 0-.633.54l-.741 4.694v.002a.641.641 0 0 1-.632.54l-.368-.002zm9.45-13.375c-.052.278-.11.555-.175.83-.638 2.693-2.49 3.997-5.51 3.997H9.29a.642.642 0 0 0-.634.54l-.715 4.527-.169 1.074h.001l-.06.383a.641.641 0 0 0 .632.74h3.495a.641.641 0 0 0 .633-.54l.026-.168.502-3.185.033-.2a.641.641 0 0 1 .633-.54h.456c2.862 0 5.105-.978 6.73-2.907.587-.697 1.018-1.447 1.293-2.252.147-.432.253-.873.319-1.324.09-.565.118-1.158.084-1.777-.003-.046-.007-.091-.011-.137-.075-.773-.255-1.452-.54-2.037a3.892 3.892 0 0 0-.416-.687c-.47-.65-1.115-1.15-1.934-1.5-.896-.384-1.98-.577-3.249-.577H9.068a.641.641 0 0 0-.634.54l-.842 5.334-.03.192"/>
                  </svg>
                  PayPal
                </TabsTrigger>
              </TabsList>

              <TabsContent value="stripe" className="mt-4 space-y-4">
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor="cardNumber">Card Number</Label>
                    <Input
                      id="cardNumber"
                      placeholder="1234 5678 9012 3456"
                      value={cardDetails.number}
                      onChange={(e) => setCardDetails({ ...cardDetails, number: formatCardNumber(e.target.value) })}
                      maxLength={19}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="expiry">Expiry</Label>
                      <Input
                        id="expiry"
                        placeholder="MM/YY"
                        value={cardDetails.expiry}
                        onChange={(e) => setCardDetails({ ...cardDetails, expiry: formatExpiry(e.target.value) })}
                        maxLength={5}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cvc">CVC</Label>
                      <Input
                        id="cvc"
                        placeholder="123"
                        value={cardDetails.cvc}
                        onChange={(e) => setCardDetails({ ...cardDetails, cvc: e.target.value.replace(/\D/g, '').slice(0, 3) })}
                        maxLength={3}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Lock className="w-3 h-3" />
                  Your payment information is encrypted and secure
                </div>

                <Button
                  className="w-full bg-purple-700 hover:bg-purple-800"
                  onClick={handleStripePayment}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    `Pay $${subscriptionPrice.toFixed(2)}`
                  )}
                </Button>
              </TabsContent>

              <TabsContent value="paypal" className="mt-4 space-y-4">
                <div className="bg-blue-50 rounded-lg p-6 text-center">
                  <svg className="w-12 h-12 mx-auto text-blue-600 mb-3" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944 3.72a.641.641 0 0 1 .632-.54h6.098c2.057 0 3.604.416 4.597 1.237.952.788 1.424 1.932 1.424 3.447 0 .41-.034.827-.102 1.24-.004.023-.008.046-.013.07-.452 2.326-1.79 3.874-3.98 4.61-.9.311-1.943.468-3.098.468H8.45a.641.641 0 0 0-.633.54l-.741 4.694v.002a.641.641 0 0 1-.632.54l-.368-.002zm9.45-13.375c-.052.278-.11.555-.175.83-.638 2.693-2.49 3.997-5.51 3.997H9.29a.642.642 0 0 0-.634.54l-.715 4.527-.169 1.074h.001l-.06.383a.641.641 0 0 0 .632.74h3.495a.641.641 0 0 0 .633-.54l.026-.168.502-3.185.033-.2a.641.641 0 0 1 .633-.54h.456c2.862 0 5.105-.978 6.73-2.907.587-.697 1.018-1.447 1.293-2.252.147-.432.253-.873.319-1.324.09-.565.118-1.158.084-1.777-.003-.046-.007-.091-.011-.137-.075-.773-.255-1.452-.54-2.037a3.892 3.892 0 0 0-.416-.687c-.47-.65-1.115-1.15-1.934-1.5-.896-.384-1.98-.577-3.249-.577H9.068a.641.641 0 0 0-.634.54l-.842 5.334-.03.192"/>
                  </svg>
                  <p className="text-sm text-gray-600">
                    You&apos;ll be redirected to PayPal to complete your payment securely.
                  </p>
                </div>

                <Button
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  onClick={handlePayPalPayment}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    `Pay with PayPal - $${subscriptionPrice.toFixed(2)}`
                  )}
                </Button>
              </TabsContent>
            </Tabs>

            <div className="flex items-center justify-center gap-2 text-xs text-amber-600 bg-amber-50 p-2 rounded">
              <AlertCircle className="w-3 h-3" />
              Demo Mode: No real charges will be made
            </div>

            <Button
              variant="ghost"
              className="w-full"
              onClick={() => setPaymentStep('details')}
            >
              Back to Details
            </Button>
          </div>
        )}

        {paymentStep === 'processing' && (
          <div className="py-12 text-center">
            <Loader2 className="w-12 h-12 animate-spin mx-auto text-purple-700 mb-4" />
            <p className="text-lg font-medium">Processing your payment...</p>
            <p className="text-sm text-gray-500">Please wait while we confirm your payment.</p>
          </div>
        )}

        {paymentStep === 'success' && (
          <div className="py-8 text-center space-y-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            <div>
              <p className="text-lg font-medium">Welcome to {plan.name}!</p>
              <p className="text-sm text-gray-500">
                {plan.discount > 0 
                  ? `You now get ${plan.discount}% off on all services.` 
                  : 'You can now book services at standard rates.'}
              </p>
            </div>
            <Button
              className="bg-purple-700 hover:bg-purple-800"
              onClick={onClose}
            >
              Start Booking
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
