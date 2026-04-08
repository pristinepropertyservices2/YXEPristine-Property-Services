import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { generateResetToken } from '@/lib/tokens';
import { sendPasswordResetEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    const user = await db.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    // Always return success to prevent email enumeration
    if (!user) {
      return NextResponse.json({
        success: true,
        message: 'If an account exists with this email, a password reset link has been sent.',
      });
    }

    // Delete any existing reset tokens
    await db.verificationToken.deleteMany({
      where: { userId: user.id, identifier: 'password_reset' },
    });

    // Generate new reset token
    const { token, expires } = generateResetToken();

    // Save token to database
    await db.verificationToken.create({
      data: {
        userId: user.id,
        token,
        identifier: 'password_reset',
        expires,
      },
    });

    // Update user with reset token info
    await db.user.update({
      where: { id: user.id },
      data: {
        resetPasswordToken: token,
        resetPasswordExpires: expires,
      },
    });

    // Send password reset email
    await sendPasswordResetEmail(user.email, user.name || 'User', token);

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
