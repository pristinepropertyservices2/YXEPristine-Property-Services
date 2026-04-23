import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { db } from '@/lib/db';

const bookingInclude = {
  service: true,
  plan: true,
  payment: true,
  user: {
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
    },
  },
} as const;

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    });

    if (user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const bookings = await db.booking.findMany({
      include: bookingInclude,
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ bookings });
  } catch (error) {
    console.error('Admin bookings list:', error);
    return NextResponse.json({ error: 'Failed to load bookings' }, { status: 500 });
  }
}
