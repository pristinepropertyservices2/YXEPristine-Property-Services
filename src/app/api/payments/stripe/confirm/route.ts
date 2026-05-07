import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { db } from '@/lib/db';
import { sendBookingLifecycleEmail } from '@/lib/email';

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
    const { paymentIntentId, paymentId, sessionId } = body as {
      paymentIntentId?: string;
      paymentId?: string;
      sessionId?: string;
    };

    const stripe = getStripe();

    if (!stripe) {
      return NextResponse.json({ error: 'Stripe not configured' }, { status: 400 });
    }

    if (!paymentId || (!paymentIntentId && !sessionId)) {
      return NextResponse.json({ error: 'Missing payment reference' }, { status: 400 });
    }

    let paid = false;
    let status = 'unknown';

    if (sessionId) {
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      status = session.payment_status;
      paid = session.payment_status === 'paid';
    } else if (paymentIntentId) {
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
      status = paymentIntent.status;
      paid = paymentIntent.status === 'succeeded';
    }

    if (paid) {
      const payment = await db.payment.update({
        where: { id: paymentId },
        data: { status: 'COMPLETED' },
      });

      if (payment.bookingId) {
        const booking = await db.booking.update({
          where: { id: payment.bookingId },
          data: { status: 'CONFIRMED', paymentStatus: 'PAID' },
          include: { user: true, service: true, assignedCleanerRef: true },
        });
        if (booking.user.email) {
          await sendBookingLifecycleEmail({
            to: booking.user.email,
            customerName: booking.user.name,
            bookingId: booking.id,
            serviceType: booking.serviceType || booking.service.name,
            date: booking.bookingDate || booking.date,
            time: booking.bookingTime || booking.time,
            status: 'CONFIRMED',
            cleanerName: booking.assignedCleanerRef?.name || booking.assignedCleaner,
            notes: booking.notes,
          });
        }
      }

      return NextResponse.json({
        success: true,
        status: 'COMPLETED',
        payment,
      });
    }

    return NextResponse.json({
      success: false,
      status,
    });
  } catch (error) {
    console.error('Stripe confirm error:', error);
    return NextResponse.json({ error: 'Failed to confirm payment' }, { status: 500 });
  }
}
