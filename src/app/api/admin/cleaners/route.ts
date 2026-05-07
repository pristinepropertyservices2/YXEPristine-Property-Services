import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { db } from '@/lib/db';

async function ensureAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return { error: 'Unauthorized', status: 401 as const };
  const me = await db.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  });
  if (me?.role !== 'ADMIN') return { error: 'Forbidden', status: 403 as const };
  return { ok: true as const };
}

export async function GET() {
  try {
    const guard = await ensureAdmin();
    if ('error' in guard) return NextResponse.json({ error: guard.error }, { status: guard.status });

    const cleaners = await db.cleaner.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        bookings: {
          select: { id: true, status: true, bookingDate: true, bookingTime: true },
          take: 5,
          orderBy: { createdAt: 'desc' },
        },
      },
    });
    return NextResponse.json({ cleaners });
  } catch (error) {
    console.error('Admin cleaners list:', error);
    return NextResponse.json({ error: 'Failed to load cleaners' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const guard = await ensureAdmin();
    if ('error' in guard) return NextResponse.json({ error: guard.error }, { status: guard.status });

    const body = await request.json();
    const name = (body?.name as string | undefined)?.trim();
    const email = (body?.email as string | undefined)?.trim().toLowerCase() || null;
    const phone = (body?.phone as string | undefined)?.trim() || null;
    const availability = (body?.availability as string | undefined)?.trim() || null;
    if (!name) return NextResponse.json({ error: 'Cleaner name is required' }, { status: 400 });

    const cleaner = await db.cleaner.create({
      data: { name, email, phone, availability },
    });
    return NextResponse.json({ cleaner });
  } catch (error) {
    console.error('Admin cleaner create:', error);
    return NextResponse.json({ error: 'Failed to create cleaner' }, { status: 500 });
  }
}
