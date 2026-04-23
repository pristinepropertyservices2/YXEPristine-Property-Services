import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { hashPassword, validatePassword } from '@/lib/password';
import { generateVerificationToken } from '@/lib/tokens';
import { sendVerificationEmail } from '@/lib/email';

function isSmtpConfigured() {
  const user = process.env.SMTP_USER || '';
  const pass = process.env.SMTP_PASSWORD || '';
  return (
    user.length > 0 &&
    pass.length > 0 &&
    !user.includes('your-email') &&
    !pass.includes('your-app-password')
  );
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, password } = body;
    const normalizedEmail = String(email || '').trim().toLowerCase();
    const normalizedName = String(name || '').trim();
    const smtpReady = isSmtpConfigured();

    // Validate required fields
    if (!normalizedName || !normalizedEmail || !password) {
      return NextResponse.json(
        { error: 'Name, email, and password are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(normalizedEmail)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Validate password strength
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      return NextResponse.json(
        { error: passwordValidation.message },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await db.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingUser) {
      // If a stale, unverified account exists and SMTP is not configured in dev,
      // allow the user to recover by replacing that account with the new password.
      if (!existingUser.emailVerified && !smtpReady) {
        await db.verificationToken.deleteMany({
          where: { userId: existingUser.id },
        });
        await db.user.delete({
          where: { id: existingUser.id },
        });
      } else {
      return NextResponse.json(
        { error: 'An account with this email already exists' },
        { status: 400 }
      );
      }
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Generate verification token
    const { token, expires } = generateVerificationToken();

    // Create user and verification token in transaction
    const user = await db.user.create({
      data: {
        email: normalizedEmail,
        name: normalizedName,
        phone: phone || null,
        password: hashedPassword,
        role: 'CUSTOMER',
        // In local/dev without SMTP credentials, auto-verify so credentials login works.
        emailVerified: smtpReady ? null : new Date(),
      },
    });

    if (smtpReady) {
      await db.verificationToken.create({
        data: {
          userId: user.id,
          token,
          identifier: 'email_verification',
          expires,
        },
      });

      // Send verification email
      const emailResult = await sendVerificationEmail(normalizedEmail, normalizedName, token);

      if (!emailResult.success) {
        console.warn('Failed to send verification email:', emailResult.message);
      }
    }

    return NextResponse.json({
      success: true,
      message: smtpReady
        ? 'Account created successfully. Please check your email to verify your account.'
        : 'Account created successfully. Email verification is bypassed in local development.',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'Failed to create account. Please try again.' },
      { status: 500 }
    );
  }
}
