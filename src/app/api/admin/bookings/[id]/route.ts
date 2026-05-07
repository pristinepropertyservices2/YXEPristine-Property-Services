import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { db } from '@/lib/db';
import type { BookingStatus, PaymentStatus } from '@prisma/client';
import { sendBookingLifecycleEmail } from '@/lib/email';

type Params = { params: Promise<{ id: string }> };

const allowed: BookingStatus[] = [
  'PENDING',
  'CONFIRMED',
  'IN_PROGRESS',
  'COMPLETED',
  'CANCELLED',
];
const paymentAllowed: PaymentStatus[] = ['UNPAID', 'PAID', 'PENDING', 'COMPLETED', 'FAILED', 'REFUNDED'];

export async function PATCH(request: NextRequest, { params }: Params) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const admin = await db.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    });
    if (admin?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();
    const status = body?.status as string | undefined;
    const assignedCleaner = body?.assignedCleaner as string | null | undefined;
    const assignedCleanerId = body?.assignedCleanerId as string | null | undefined;
    const paymentStatus = body?.paymentStatus as string | undefined;
    const bookingDate = body?.bookingDate as string | undefined;
    const bookingTime = body?.bookingTime as string | undefined;
    const notes = body?.notes as string | undefined;

    if (
      !status &&
      assignedCleaner === undefined &&
      assignedCleanerId === undefined &&
      !paymentStatus &&
      !bookingDate &&
      !bookingTime &&
      notes === undefined
    ) {
      return NextResponse.json({ error: 'No update fields provided' }, { status: 400 });
    }

    if (status && !allowed.includes(status as BookingStatus)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }
    if (paymentStatus && !paymentAllowed.includes(paymentStatus as PaymentStatus)) {
      return NextResponse.json({ error: 'Invalid payment status' }, { status: 400 });
    }

    const booking = await db.booking.update({
      where: { id },
      data: {
        ...(status ? { status: status as BookingStatus } : {}),
        ...(paymentStatus ? { paymentStatus: paymentStatus as PaymentStatus } : {}),
        ...(bookingDate ? { bookingDate: new Date(bookingDate), date: new Date(bookingDate) } : {}),
        ...(bookingTime ? { bookingTime, time: bookingTime } : {}),
        ...(notes !== undefined ? { notes: notes?.trim() || null } : {}),
        ...(assignedCleaner !== undefined
          ? { assignedCleaner: assignedCleaner?.trim() || null }
          : {}),
        ...(assignedCleanerId !== undefined
          ? { assignedCleanerId: assignedCleanerId || null }
          : {}),
        ...((assignedCleanerId || assignedCleaner) && !status ? { status: 'CONFIRMED' } : {}),
      },
      include: {
        service: true,
        assignedCleanerRef: true,
        user: {
          select: { id: true, name: true, email: true, phone: true },
        },
        payment: true,
      },
    });

    if (status && ['CONFIRMED', 'CANCELLED', 'COMPLETED'].includes(status) && booking.user.email) {
      const send = await sendBookingLifecycleEmail({
        to: booking.user.email,
        customerName: booking.user.name,
        bookingId: booking.id,
        serviceType: booking.serviceType || booking.service.name,
        date: booking.bookingDate || booking.date,
        time: booking.bookingTime || booking.time,
        status: status as 'CONFIRMED' | 'CANCELLED' | 'COMPLETED',
        cleanerName: booking.assignedCleanerRef?.name || booking.assignedCleaner,
        notes: booking.notes,
      });
      if (!send.success) {
        console.warn('[admin-bookings] Lifecycle email failed:', send.message);
      }
    }

    return NextResponse.json({ booking });
  } catch (error) {
    console.error('Admin booking update:', error);
    return NextResponse.json({ error: 'Failed to update booking' }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const admin = await db.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    });
    if (admin?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { id } = await params;

    const existing = await db.booking.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!existing) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    await db.$transaction(async (tx) => {
      await tx.payment.deleteMany({ where: { bookingId: id } });
      await tx.booking.delete({ where: { id } });
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Admin booking delete:', error);
    return NextResponse.json({ error: 'Failed to delete booking' }, { status: 500 });
  }
}
