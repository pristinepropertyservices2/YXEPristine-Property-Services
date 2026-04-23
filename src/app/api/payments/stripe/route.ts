import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
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
    const {
      amount,
      planId,
      planName,
      userId,
      userEmail,
      description,
      bookingId,
    } = body as {
      amount?: number;
      planId?: string;
      planName?: string;
      userId?: string;
      userEmail?: string;
      description?: string;
      bookingId?: string;
    };

    let resolvedUserId = userId as string | undefined;
    let resolvedAmount = amount;
    let desc = description || 'Payment';
    let metaPlanName = planName || '';
    const origin = request.nextUrl.origin;

    if (bookingId) {
      const session = await getServerSession(authOptions);
      if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }

      const booking = await db.booking.findUnique({
        where: { id: bookingId },
        include: { payment: true },
      });

      if (!booking) {
        return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
      }

      if (booking.userId !== session.user.id) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }

      if (booking.payment) {
        return NextResponse.json(
          { error: 'Payment already exists for this booking' },
          { status: 400 }
        );
      }

      resolvedUserId = booking.userId;
      resolvedAmount = booking.totalPrice;
      desc = `Booking ${booking.id} — ${booking.serviceId}`;
      metaPlanName = 'Booking';
    }

    if (!resolvedAmount || resolvedAmount <= 0) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
    }

    if (!resolvedUserId) {
      return NextResponse.json({ error: 'User required' }, { status: 400 });
    }

    const stripe = getStripe();

    if (!stripe) {
      return NextResponse.json({
        error: 'Stripe is not configured. Add STRIPE_SECRET_KEY.',
      }, { status: 400 });
    }

    if (bookingId) {
      const payment = await db.payment.create({
        data: {
          userId: resolvedUserId,
          amount: resolvedAmount,
          currency: 'CAD',
          status: 'PENDING',
          method: 'STRIPE',
          stripeId: null,
          description: desc,
          bookingId,
        },
      });

      const checkoutSession = await stripe.checkout.sessions.create({
        mode: 'payment',
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'cad',
              unit_amount: Math.round(resolvedAmount * 100),
              product_data: {
                name: metaPlanName || 'Service payment',
                description: desc,
              },
            },
            quantity: 1,
          },
        ],
        success_url: `${origin}/book/${bookingId}/success?provider=stripe&session_id={CHECKOUT_SESSION_ID}&payment_id=${payment.id}`,
        cancel_url: `${origin}/book/${bookingId}/failed?provider=stripe`,
        client_reference_id: payment.id,
        metadata: {
          paymentId: payment.id,
          bookingId,
          userId: resolvedUserId,
          planId: planId || '',
          userEmail: userEmail || '',
        },
      });

      await db.payment.update({
        where: { id: payment.id },
        data: { stripeId: checkoutSession.id },
      });

      return NextResponse.json({
        checkoutUrl: checkoutSession.url,
        paymentId: payment.id,
      });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(resolvedAmount * 100),
      currency: 'cad',
      metadata: {
        planId: planId || '',
        planName: metaPlanName,
        userId: resolvedUserId,
        userEmail: userEmail || '',
        bookingId: '',
      },
      description: desc,
    });

    const payment = await db.payment.create({
      data: {
        userId: resolvedUserId,
        amount: resolvedAmount,
        currency: 'CAD',
        status: 'PENDING',
        method: 'STRIPE',
        stripeId: paymentIntent.id,
        description: desc,
      },
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentId: payment.id,
    });
  } catch (error) {
    console.error('Stripe checkout creation error:', error);
    return NextResponse.json({ error: 'Failed to create Stripe checkout session' }, { status: 500 });
  }
}
