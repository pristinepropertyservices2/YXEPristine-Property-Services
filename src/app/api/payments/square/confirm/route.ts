import { randomUUID } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { db } from '@/lib/db';
import { sendBookingLifecycleEmail, bookingLifecycleEmailExtrasFromBooking } from '@/lib/email';
import { getSquareLocationId, isSquareConfigured, squareChargeCard } from '@/lib/square-api';

function isPaidSquareStatus(status: string) {
  return status === 'COMPLETED' || status === 'APPROVED';
}

export async function POST(request: NextRequest) {
  try {
    if (!isSquareConfigured()) {
      return NextResponse.json({ error: 'Square is not configured' }, { status: 503 });
    }

    const locationId = getSquareLocationId();
    if (!locationId) {
      return NextResponse.json({ error: 'SQUARE_LOCATION_ID is not set' }, { status: 503 });
    }

    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { paymentId, sourceId } = body as { paymentId?: string; sourceId?: string };

    if (!paymentId || !sourceId) {
      return NextResponse.json({ error: 'paymentId and sourceId are required' }, { status: 400 });
    }

    const payment = await db.payment.findUnique({
      where: { id: paymentId },
      include: { booking: { include: { user: true, service: true, assignedCleanerRef: true } } },
    });

    if (!payment || payment.method !== 'SQUARE') {
      return NextResponse.json({ error: 'Payment not found' }, { status: 404 });
    }

    if (payment.userId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    if (payment.status === 'COMPLETED') {
      return NextResponse.json({ success: true, payment, alreadyCompleted: true });
    }

    const amountCents = Math.round(payment.amount * 100);
    const squarePayment = await squareChargeCard({
      sourceId,
      locationId,
      amountCents,
      currency: payment.currency || 'CAD',
      idempotencyKey: randomUUID(),
      note: payment.description || undefined,
    });

    if (!isPaidSquareStatus(squarePayment.status)) {
      await db.payment.update({
        where: { id: payment.id },
        data: { status: 'FAILED', squareId: squarePayment.id },
      });
      return NextResponse.json(
        { error: `Payment not completed (Square status: ${squarePayment.status})` },
        { status: 402 }
      );
    }

    const updated = await db.payment.update({
      where: { id: payment.id },
      data: { status: 'COMPLETED', squareId: squarePayment.id },
    });

    if (updated.bookingId) {
      const booking = await db.booking.update({
        where: { id: updated.bookingId },
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
          ...bookingLifecycleEmailExtrasFromBooking(booking),
        });
      }
    }

    return NextResponse.json({ success: true, payment: updated });
  } catch (error) {
    console.error('Square confirm error:', error);
    const message = error instanceof Error ? error.message : 'Failed to confirm payment';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
