import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, message } = body;

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required' },
        { status: 400 }
      );
    }

    // Save contact message to database
    const contact = await db.contact.create({
      data: {
        name,
        email,
        phone: phone || null,
        message,
      },
    });

    // In a real application, you would send an email notification here
    // For now, we'll just save to the database

    return NextResponse.json({ 
      success: true, 
      contact,
      message: 'Message sent successfully' 
    });
  } catch (error) {
    console.error('Error saving contact message:', error);
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const contacts = await db.contact.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
    
    return NextResponse.json({ contacts });
  } catch (error) {
    console.error('Error fetching contacts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch contacts' },
      { status: 500 }
    );
  }
}
