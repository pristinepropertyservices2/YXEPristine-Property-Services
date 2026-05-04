import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { db } from '@/lib/db';
import { verifyPassword } from '@/lib/password';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const me = await db.user.findUnique({
      where: { id: session.user.id },
      select: { role: true, password: true, email: true },
    });

    if (me?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    if (!me.password) {
      return NextResponse.json(
        {
          error:
            'No password on this account. Use “Forgot password” on the sign-in page to set a password, then you can change email here.',
        },
        { status: 400 }
      );
    }

    const body = await request.json();
    const currentPassword = body?.currentPassword as string | undefined;
    const newEmailRaw = body?.newEmail as string | undefined;

    if (!currentPassword || !newEmailRaw?.trim()) {
      return NextResponse.json(
        { error: 'Current password and new email are required' },
        { status: 400 }
      );
    }

    const newEmail = newEmailRaw.trim().toLowerCase();
    if (!EMAIL_RE.test(newEmail)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
    }

    if (newEmail === me.email.toLowerCase()) {
      return NextResponse.json({ error: 'That is already your email' }, { status: 400 });
    }

    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: { password: true },
    });

    if (!user?.password) {
      return NextResponse.json({ error: 'No password on file' }, { status: 400 });
    }

    const currentOk = await verifyPassword(currentPassword, user.password);
    if (!currentOk) {
      return NextResponse.json({ error: 'Current password is incorrect' }, { status: 400 });
    }

    const taken = await db.user.findFirst({
      where: { email: { equals: newEmail, mode: 'insensitive' } },
      select: { id: true },
    });

    if (taken && taken.id !== session.user.id) {
      return NextResponse.json(
        { error: 'That email is already used by another account' },
        { status: 409 }
      );
    }

    await db.user.update({
      where: { id: session.user.id },
      data: { email: newEmail },
    });

    return NextResponse.json({
      success: true,
      message:
        'Email updated. Sign in again with your new email; your old session will stop showing the updated address until you re-authenticate.',
      newEmail,
    });
  } catch (error) {
    console.error('Admin account email:', error);
    return NextResponse.json({ error: 'Failed to update email' }, { status: 500 });
  }
}
