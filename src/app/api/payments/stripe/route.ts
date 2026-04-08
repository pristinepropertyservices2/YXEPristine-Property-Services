import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { db } from '@/lib/db';

// Initialize Stripe with secret key (or use mock for demo)
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
    const { amount, planId, planName, userId, userEmail, description } = body;

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: 'Invalid amount' },
        { status: 400 }
      );
    }

    const stripe = getStripe();

    // If Stripe is not configured, return mock response for demo
    if (!stripe) {
      const mockClientSecret = `pi_mock_${Date.now()}_secret_${Math.random().toString(36).substr(2, 9)}`;
      
      // Create a mock payment record
      const payment = await db.payment.create({
        data: {
          userId: userId || 'guest',
          amount: amount,
          currency: 'CAD',
          status: 'PENDING',
          method: 'STRIPE',
          stripeId: `pi_mock_${Date.now()}`,
          description: `${planName} - ${description || 'Subscription'}`,
        },
      });

      return NextResponse.json({
        clientSecret: mockClientSecret,
        paymentId: payment.id,
        isDemo: true,
        message: 'Stripe not configured. Using demo mode.',
      });
    }

    // Create a PaymentIntent with Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: 'cad',
      metadata: {
        planId: planId || '',
        planName: planName || '',
        userId: userId || 'guest',
        userEmail: userEmail || '',
      },
      description: `${planName} - ${description || 'Subscription'}`,
    });

    // Create payment record
    const payment = await db.payment.create({
      data: {
        userId: userId || 'guest',
        amount: amount,
        currency: 'CAD',
        status: 'PENDING',
        method: 'STRIPE',
        stripeId: paymentIntent.id,
        description: `${planName} - ${description || 'Subscription'}`,
      },
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentId: payment.id,
    });
  } catch (error) {
    console.error('Stripe payment error:', error);
    return NextResponse.json(
      { error: 'Failed to create payment intent' },
      { status: 500 }
    );
  }
}
