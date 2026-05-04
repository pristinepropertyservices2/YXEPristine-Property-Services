import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { generateResetToken } from '@/lib/tokens';
import { sendPasswordResetEmail, isSmtpConfigured } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    if (!isSmtpConfigured()) {
      console.warn('[forgot-password] SMTP not configured');
      return NextResponse.json(
        {
          error:
            'Password reset email is not available: mail is not configured on the server. Contact your administrator.',
        },
        { status: 503 }
      );
    }

    const body = await request.json();
    const rawEmail = body?.email as string | undefined;
    if (!rawEmail?.trim()) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const emailNorm = rawEmail.trim().toLowerCase();

    const user = await db.user.findFirst({
      where: { email: { equals: emailNorm, mode: 'insensitive' } },
    });

    if (!user) {
      return NextResponse.json({
        success: true,
        message: 'If an account exists with this email, a password reset link has been sent.',
      });
    }

    await db.verificationToken.deleteMany({
      where: { userId: user.id, identifier: 'password_reset' },
    });

    const { token, expires } = generateResetToken();

    await db.verificationToken.create({
      data: {
        userId: user.id,
        token,
        identifier: 'password_reset',
        expires,
      },
    });

    await db.user.update({
      where: { id: user.id },
      data: {
        resetPasswordToken: token,
        resetPasswordExpires: expires,
      },
    });

    const sent = await sendPasswordResetEmail(user.email, user.name || 'User', token);

    if (!sent.success) {
      await db.verificationToken.deleteMany({
        where: { userId: user.id, identifier: 'password_reset' },
      });
      await db.user.update({
        where: { id: user.id },
        data: { resetPasswordToken: null, resetPasswordExpires: null },
      });
      console.error('[forgot-password] Email send failed:', sent.message);
      return NextResponse.json(
        {
          error:
            'Could not send the reset email. Check SMTP settings (host, user, app password) on the server.',
        },
        { status: 503 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'If an account exists with this email, a password reset link has been sent.',
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { error: 'Failed to process request. Please try again.' },
      { status: 500 }
    );
  }
}
