import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { db } from '@/lib/db';
import { hashPassword, verifyPassword, validatePassword } from '@/lib/password';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const me = await db.user.findUnique({
      where: { id: session.user.id },
      select: { role: true, password: true },
    });

    if (me?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    if (!me.password) {
      return NextResponse.json(
        {
          error:
            'No password on this account. Use “Forgot password” on the sign-in page to set a password with your email.',
        },
        { status: 400 }
      );
    }

    const body = await request.json();
    const currentPassword = body?.currentPassword as string | undefined;
    const newPassword = body?.newPassword as string | undefined;
    const confirmPassword = body?.confirmPassword as string | undefined;

    if (!currentPassword || !newPassword || !confirmPassword) {
      return NextResponse.json(
        { error: 'Current password, new password, and confirmation are required' },
        { status: 400 }
      );
    }

    if (newPassword !== confirmPassword) {
      return NextResponse.json({ error: 'New passwords do not match' }, { status: 400 });
    }

    const strength = validatePassword(newPassword);
    if (!strength.valid) {
      return NextResponse.json({ error: strength.message }, { status: 400 });
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

    const hashed = await hashPassword(newPassword);
    await db.user.update({
      where: { id: session.user.id },
      data: { password: hashed },
    });

    return NextResponse.json({ success: true, message: 'Password updated.' });
  } catch (error) {
    console.error('Admin account password:', error);
    return NextResponse.json({ error: 'Failed to update password' }, { status: 500 });
  }
}
