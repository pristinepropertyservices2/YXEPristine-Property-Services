import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { hash } from 'crypto';

// Simple password hashing function
function hashPassword(password: string): string {
  return hash('sha256', password);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, password } = body;

    // Validate required fields
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Name, email, and password are required' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await db.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'An account with this email already exists' },
        { status: 400 }
      );
    }

    // Create user
    const hashedPassword = hashPassword(password);
    const user = await db.user.create({
      data: {
        name,
        email: email.toLowerCase(),
        phone: phone || null,
        password: hashedPassword,
        role: 'CUSTOMER',
      },
    });

    // In a real application, you would send a verification email here
    // and use proper authentication like NextAuth.js

    return NextResponse.json({ 
      success: true, 
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
      message: 'Account created successfully. Please check your email to verify your account.' 
    });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { error: 'Failed to create account' },
      { status: 500 }
    );
  }
}
