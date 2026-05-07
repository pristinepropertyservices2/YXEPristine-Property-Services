import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { db } from '@/lib/db';

type Params = { params: Promise<{ id: string }> };

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

export async function PATCH(request: NextRequest, { params }: Params) {
  try {
    const guard = await ensureAdmin();
    if ('error' in guard) return NextResponse.json({ error: guard.error }, { status: guard.status });
    const { id } = await params;
    const body = await request.json();
    const cleaner = await db.cleaner.update({
      where: { id },
      data: {
        ...(body?.name !== undefined ? { name: String(body.name).trim() } : {}),
        ...(body?.email !== undefined
          ? { email: body.email ? String(body.email).trim().toLowerCase() : null }
          : {}),
        ...(body?.phone !== undefined ? { phone: body.phone ? String(body.phone).trim() : null } : {}),
        ...(body?.availability !== undefined
          ? { availability: body.availability ? String(body.availability).trim() : null }
          : {}),
      },
    });
    return NextResponse.json({ cleaner });
  } catch (error) {
    console.error('Admin cleaner update:', error);
    return NextResponse.json({ error: 'Failed to update cleaner' }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  try {
    const guard = await ensureAdmin();
    if ('error' in guard) return NextResponse.json({ error: guard.error }, { status: guard.status });
    const { id } = await params;
    await db.cleaner.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Admin cleaner delete:', error);
    return NextResponse.json({ error: 'Failed to delete cleaner' }, { status: 500 });
  }
}
