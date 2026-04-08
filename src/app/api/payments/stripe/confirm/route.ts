import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { db } from '@/lib/db';

const getStripe = () => {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    return null;
  }
  return new Stripe(secretKey, {
    apiVersion: '2024-12-18.acacia',
  });
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { paymentIntentId, paymentId, isDemo } = body;

    if (isDemo) {
      // Demo mode - mark as completed
      const payment = await db.payment.update({
        where: { id: paymentId },
        data: { status: 'COMPLETED' },
      });

      return NextResponse.json({
        success: true,
        status: 'COMPLETED',
        payment,
      });
    }

    const stripe = getStripe();

    if (!stripe) {
      return NextResponse.json(
        { error: 'Stripe not configured' },
        { status: 400 }
      );
    }

    // Retrieve the PaymentIntent to check status
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status === 'succeeded') {
      // Update payment record
      const payment = await db.payment.update({
        where: { id: paymentId },
        data: { status: 'COMPLETED' },
      });

      return NextResponse.json({
        success: true,
        status: 'COMPLETED',
        payment,
      });
    }

    return NextResponse.json({
      success: false,
      status: paymentIntent.status,
    });
  } catch (error) {
    console.error('Stripe confirm error:', error);
    return NextResponse.json(
      { error: 'Failed to confirm payment' },
      { status: 500 }
    );
  }
}
