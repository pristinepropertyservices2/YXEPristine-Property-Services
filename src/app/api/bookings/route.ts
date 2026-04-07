import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const bookings = await db.booking.findMany({
      include: {
        service: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    
    return NextResponse.json({ bookings });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch bookings' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { serviceId, date, time, address, city, postalCode, notes, totalPrice, userId } = body;

    // For demo purposes, create a guest user if no userId provided
    let user = userId ? await db.user.findUnique({ where: { id: userId } }) : null;
    
    if (!user) {
      // Create a guest user for the booking
      user = await db.user.create({
        data: {
          email: `guest_${Date.now()}@yxepristine.temp`,
          name: 'Guest User',
          password: 'guest_password_not_used',
        },
      });
    }

    // Find or create the service
    let service = await db.service.findUnique({ where: { id: serviceId } });
    
    if (!service) {
      // Create service if it doesn't exist (for demo)
      service = await db.service.create({
        data: {
          id: serviceId,
          name: serviceId.charAt(0).toUpperCase() + serviceId.slice(1) + ' Cleaning',
          description: 'Professional cleaning service',
          price: totalPrice,
          duration: 90,
          features: '["Professional service", "Eco-friendly products", "Satisfaction guaranteed"]',
        },
      });
    }

    const booking = await db.booking.create({
      data: {
        userId: user.id,
        serviceId: service.id,
        date: new Date(date),
        time,
        address,
        city,
        postalCode,
        notes,
        totalPrice,
        status: 'PENDING',
      },
      include: {
        service: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
      },
    });

    return NextResponse.json({ 
      success: true, 
      booking,
      message: 'Booking created successfully' 
    });
  } catch (error) {
    console.error('Error creating booking:', error);
    return NextResponse.json(
      { error: 'Failed to create booking' },
      { status: 500 }
    );
  }
}
