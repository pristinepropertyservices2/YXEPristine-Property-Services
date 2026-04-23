import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { db } from '@/lib/db';
import type { BookingStatus } from '@prisma/client';

type Params = { params: Promise<{ id: string }> };

const allowed: BookingStatus[] = [
  'PENDING',
  'CONFIRMED',
  'IN_PROGRESS',
  'COMPLETED',
  'CANCELLED',
];

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

    if (!status && assignedCleaner === undefined) {
      return NextResponse.json({ error: 'No update fields provided' }, { status: 400 });
    }

    if (status && !allowed.includes(status as BookingStatus)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    const booking = await db.booking.update({
      where: { id },
      data: {
        ...(status ? { status: status as BookingStatus } : {}),
        ...(assignedCleaner !== undefined
          ? { assignedCleaner: assignedCleaner?.trim() || null }
          : {}),
      },
      include: {
        service: true,
        user: {
          select: { id: true, name: true, email: true, phone: true },
        },
        payment: true,
      },
    });

    return NextResponse.json({ booking });
  } catch (error) {
    console.error('Admin booking update:', error);
    return NextResponse.json({ error: 'Failed to update booking' }, { status: 500 });
  }
}
