import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { db } from '@/lib/db';

const bookingInclude = {
  service: true,
  plan: true,
  payment: true,
  assignedCleanerRef: true,
  user: {
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
    },
  },
} as const;

export async function GET(request: NextRequest) {
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

    const sp = request.nextUrl.searchParams;
    const page = Math.max(1, Number(sp.get('page') || 1));
    const pageSize = Math.min(100, Math.max(1, Number(sp.get('pageSize') || 20)));
    const q = (sp.get('q') || '').trim();
    const status = (sp.get('status') || '').trim();
    const paymentStatus = (sp.get('paymentStatus') || '').trim();
    const sort = sp.get('sort') || 'createdAt';
    const dir = sp.get('dir') === 'asc' ? 'asc' : 'desc';

    const where = {
      ...(status ? { status: status as never } : {}),
      ...(paymentStatus ? { paymentStatus: paymentStatus as never } : {}),
      ...(q
        ? {
            OR: [
              { customerName: { contains: q, mode: 'insensitive' as const } },
              { email: { contains: q, mode: 'insensitive' as const } },
              { phone: { contains: q, mode: 'insensitive' as const } },
              { serviceType: { contains: q, mode: 'insensitive' as const } },
              { address: { contains: q, mode: 'insensitive' as const } },
              { city: { contains: q, mode: 'insensitive' as const } },
            ],
          }
        : {}),
    };

    const [bookings, total, stats] = await Promise.all([
      db.booking.findMany({
        where,
        include: bookingInclude,
        orderBy: { [sort]: dir },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      db.booking.count({ where }),
      db.booking.groupBy({
        by: ['status', 'paymentStatus'],
        _count: { _all: true },
      }),
    ]);

    const revenueRows = await db.payment.aggregate({
      _sum: { amount: true },
      where: { status: 'COMPLETED' },
    });

    return NextResponse.json({
      bookings,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.max(1, Math.ceil(total / pageSize)),
      },
      stats,
      revenue: revenueRows._sum.amount || 0,
    });
  } catch (error) {
    console.error('Admin bookings list:', error);
    return NextResponse.json({ error: 'Failed to load bookings' }, { status: 500 });
  }
}
