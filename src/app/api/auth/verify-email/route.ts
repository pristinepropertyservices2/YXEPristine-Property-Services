import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { sendWelcomeEmail } from '@/lib/email';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.redirect(
        new URL('/auth/error?error=invalid_token', request.url)
      );
    }

    // Find the verification token
    const verificationToken = await db.verificationToken.findUnique({
      where: { token },
      include: { user: true },
    });

    if (!verificationToken) {
      return NextResponse.redirect(
        new URL('/auth/error?error=invalid_token', request.url)
      );
    }

    // Check if token has expired
    if (verificationToken.expires < new Date()) {
      // Delete expired token
      await db.verificationToken.delete({ where: { token } });
      return NextResponse.redirect(
        new URL('/auth/error?error=expired_token', request.url)
      );
    }

    // Update user as verified
    await db.user.update({
      where: { id: verificationToken.userId },
      data: { emailVerified: new Date() },
    });

    // Delete the used token
    await db.verificationToken.delete({ where: { token } });

    // Send welcome email
    if (verificationToken.user.email && verificationToken.user.name) {
      await sendWelcomeEmail(
        verificationToken.user.email,
        verificationToken.user.name
      );
    }

    // Redirect to success page
    return NextResponse.redirect(
      new URL('/auth/verified', request.url)
    );
  } catch (error) {
    console.error('Email verification error:', error);
    return NextResponse.redirect(
      new URL('/auth/error?error=verification_failed', request.url)
    );
  }
}

// Resend verification email
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

    if (!user) {
      // Don't reveal if user exists or not
      return NextResponse.json({
        success: true,
        message: 'If an account exists with this email, a verification email has been sent.',
      });
    }

    if (user.emailVerified) {
      return NextResponse.json({
        success: true,
        message: 'Your email is already verified.',
      });
    }

    // Delete any existing verification tokens
    await db.verificationToken.deleteMany({
      where: { userId: user.id, identifier: 'email_verification' },
    });

    // Create new verification token
    const { token, expires } = {
      token: crypto.randomUUID(),
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
    };

    await db.verificationToken.create({
      data: {
        userId: user.id,
        token,
        identifier: 'email_verification',
        expires,
      },
    });

    // Send verification email
    await sendVerificationEmail(user.email, user.name || 'User', token);

    return NextResponse.json({
      success: true,
      message: 'Verification email sent. Please check your inbox.',
    });
  } catch (error) {
    console.error('Resend verification error:', error);
    return NextResponse.json(
      { error: 'Failed to resend verification email' },
      { status: 500 }
    );
  }
}
