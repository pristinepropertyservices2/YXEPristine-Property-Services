import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { db } from '@/lib/db';
import { calculateBookingTotal, type AddOnLine } from '@/lib/booking-price';

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
      select: { id: true },
    });
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const bookings = await db.booking.findMany({
      where: { userId: user.id },
      include: bookingInclude,
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ bookings });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Sign in required to book' }, { status: 401 });
    }

    const body = await request.json();
    const {
      serviceId,
      date,
      time,
      address,
      city,
      postalCode,
      notes,
      durationMinutes,
      addOnIds,
    } = body as {
      serviceId?: string;
      date?: string;
      time?: string;
      address?: string;
      city?: string;
      postalCode?: string;
      notes?: string;
      durationMinutes?: number;
      addOnIds?: string[];
    };

    if (!serviceId || !date || !time || !address || !city || !postalCode) {
      return NextResponse.json(
        { error: 'Missing required booking fields' },
        { status: 400 }
      );
    }

    const service = await db.service.findUnique({
      where: { id: serviceId },
      include: { addOns: true },
    });

    if (!service || !service.isActive) {
      return NextResponse.json({ error: 'Service not found' }, { status: 404 });
    }

    const duration =
      typeof durationMinutes === 'number' && durationMinutes >= service.duration
        ? Math.floor(durationMinutes)
        : service.duration;

    const idSet = new Set((addOnIds || []).filter((x): x is string => typeof x === 'string'));
    const selectedAddOns: AddOnLine[] = service.addOns
      .filter((a) => idSet.has(a.id))
      .map((a) => ({ id: a.id, name: a.name, price: a.price }));

    const totalPrice = calculateBookingTotal(
      service.price,
      service.duration,
      duration,
      selectedAddOns
    );

    const addOnsJson =
      selectedAddOns.length > 0 ? JSON.stringify(selectedAddOns) : null;

    const booking = await db.booking.create({
      data: {
        userId: session.user.id,
        serviceId: service.id,
        date: new Date(date),
        time,
        address,
        city,
        postalCode,
        notes: notes || null,
        totalPrice,
        durationMinutes: duration,
        addOns: addOnsJson,
        status: 'PENDING',
      },
      include: bookingInclude,
    });

    return NextResponse.json({
      success: true,
      booking,
      message: 'Booking created. Proceed to payment.',
    });
  } catch (error) {
    console.error('Error creating booking:', error);
    return NextResponse.json({ error: 'Failed to create booking' }, { status: 500 });
  }
}
