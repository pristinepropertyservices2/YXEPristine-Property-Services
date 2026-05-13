import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { db } from '@/lib/db';
import { getSquareLocationId, isSquareConfigured } from '@/lib/square-api';

/**
 * Create a pending Payment row for Square (booking checkout or logged-in plan purchase).
 * Card is charged in POST /api/payments/square/confirm with the Web Payments token.
 */
export async function POST(request: NextRequest) {
  try {
    if (!isSquareConfigured()) {
      return NextResponse.json(
        { error: 'Square is not configured. Set SQUARE_ACCESS_TOKEN and location / application IDs.' },
        { status: 503 }
      );
    }

    const locationId = getSquareLocationId();
    if (!locationId) {
      return NextResponse.json({ error: 'SQUARE_LOCATION_ID is not set' }, { status: 503 });
    }

    const body = await request.json();
    const { bookingId, amount, planId, planName } = body as {
      bookingId?: string;
      amount?: number;
      planId?: string;
      planName?: string;
    };

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
        return NextResponse.json({ error: 'Payment already exists for this booking' }, { status: 400 });
      }

      const payment = await db.payment.create({
        data: {
          userId: booking.userId,
          amount: booking.totalPrice,
          currency: 'CAD',
          status: 'PENDING',
          method: 'SQUARE',
          description: `Booking ${booking.id}`,
          bookingId: booking.id,
        },
      });

      return NextResponse.json({
        paymentId: payment.id,
        amountCents: Math.round(booking.totalPrice * 100),
        currency: 'CAD',
        locationId,
      });
    }

    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Sign in required to purchase a plan' }, { status: 401 });
    }

    if (!amount || amount <= 0 || !planId) {
      return NextResponse.json({ error: 'amount and planId are required' }, { status: 400 });
    }

    const plan = await db.plan.findUnique({ where: { id: planId } });
    if (!plan) {
      return NextResponse.json({ error: 'Plan not found' }, { status: 404 });
    }

    const payment = await db.payment.create({
      data: {
        userId: session.user.id,
        amount,
        currency: 'CAD',
        status: 'PENDING',
        method: 'SQUARE',
        description: planName || plan.name,
      },
    });

    return NextResponse.json({
      paymentId: payment.id,
      amountCents: Math.round(amount * 100),
      currency: 'CAD',
      locationId,
    });
  } catch (error) {
    console.error('Square payment create:', error);
    return NextResponse.json({ error: 'Failed to start Square payment' }, { status: 500 });
  }
}
