import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { db } from '@/lib/db';

// PayPal API base URL
const PAYPAL_API = process.env.PAYPAL_SANDBOX === 'true' 
  ? 'https://api-m.sandbox.paypal.com' 
  : 'https://api-m.paypal.com';

// Get PayPal access token
async function getPayPalAccessToken() {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return null;
  }

  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
  
  const response = await fetch(`${PAYPAL_API}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });

  const data = await response.json();
  return data.access_token;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { amount, planId, planName, userId, description, bookingId } = body as {
      amount?: number;
      planId?: string;
      planName?: string;
      userId?: string;
      description?: string;
      bookingId?: string;
    };

    let resolvedUserId = userId;
    let resolvedAmount = amount;
    let resolvedDescription = description || 'Subscription';
    let resolvedPlanName = planName || 'Payment';
    const origin = request.nextUrl.origin;

    if (bookingId) {
      const session = await getServerSession(authOptions);
      if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }

      const booking = await db.booking.findUnique({
        where: { id: bookingId },
        include: { payment: true, service: true },
      });

      if (!booking) {
        return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
      }
      if (booking.userId !== session.user.id) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }

      if (booking.payment) {
        return NextResponse.json(
          { error: 'Payment already exists for this booking' },
          { status: 400 }
        );
      }

      resolvedUserId = booking.userId;
      resolvedAmount = booking.totalPrice;
      resolvedDescription = `Booking ${booking.id} - ${booking.service.name}`;
      resolvedPlanName = 'Booking';
    }

    if (!resolvedAmount || resolvedAmount <= 0) {
      return NextResponse.json(
        { error: 'Invalid amount' },
        { status: 400 }
      );
    }
    if (!resolvedUserId) {
      return NextResponse.json(
        { error: 'User required' },
        { status: 400 }
      );
    }

    const accessToken = await getPayPalAccessToken();

    if (!accessToken) {
      return NextResponse.json({
        error: 'PayPal is not configured. Add PAYPAL_CLIENT_ID and PAYPAL_CLIENT_SECRET.',
      }, { status: 400 });
    }

    const payment = await db.payment.create({
      data: {
        userId: resolvedUserId,
        amount: resolvedAmount,
        currency: 'CAD',
        status: 'PENDING',
        method: 'PAYPAL',
        paypalId: null,
        description: `${resolvedPlanName} - ${resolvedDescription}`,
        bookingId: bookingId || undefined,
      },
    });

    // Create PayPal order
    const orderResponse = await fetch(`${PAYPAL_API}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [
          {
            amount: {
              currency_code: 'CAD',
              value: resolvedAmount.toFixed(2),
            },
            description: `${resolvedPlanName} - ${resolvedDescription}`,
            custom_id: payment.id,
          },
        ],
        application_context: {
          brand_name: 'YXE Pristine Property Services',
          user_action: 'PAY_NOW',
          return_url: bookingId
            ? `${origin}/book/${bookingId}/paypal-return?payment_id=${payment.id}`
            : `${origin}/dashboard`,
          cancel_url: bookingId
            ? `${origin}/book/${bookingId}/failed?provider=paypal`
            : `${origin}/dashboard`,
        },
      }),
    });

    const order = await orderResponse.json();

    if (order.error) {
      throw new Error(order.error.message);
    }

    await db.payment.update({
      where: { id: payment.id },
      data: {
        paypalId: order.id,
      },
    });

    return NextResponse.json({
      orderId: order.id,
      paymentId: payment.id,
      approvalUrl: order.links?.find((link: { rel: string; href: string }) => link.rel === 'approve')?.href,
    });
  } catch (error) {
    console.error('PayPal order creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create PayPal order' },
      { status: 500 }
    );
  }
}
