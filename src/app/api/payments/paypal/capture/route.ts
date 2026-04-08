import { NextRequest, NextResponse } from 'next/server';
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
    const { orderId, paymentId, isDemo } = body;

    if (isDemo) {
      // Demo mode - mark as completed
      const payment = await db.payment.update({
        where: { id: paymentId },
        data: { status: 'COMPLETED' },
      });

      return NextResponse.json({
        success: true,
        status: 'COMPLETED',
        payment,
      });
    }

    const accessToken = await getPayPalAccessToken();

    if (!accessToken) {
      return NextResponse.json(
        { error: 'PayPal not configured' },
        { status: 400 }
      );
    }

    // Capture the PayPal order
    const captureResponse = await fetch(
      `${PAYPAL_API}/v2/checkout/orders/${orderId}/capture`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const capture = await captureResponse.json();

    if (capture.error) {
      throw new Error(capture.error.message);
    }

    if (capture.status === 'COMPLETED') {
      // Update payment record
      const payment = await db.payment.update({
        where: { id: paymentId },
        data: { status: 'COMPLETED' },
      });

      return NextResponse.json({
        success: true,
        status: 'COMPLETED',
        payment,
      });
    }

    return NextResponse.json({
      success: false,
      status: capture.status,
    });
  } catch (error) {
    console.error('PayPal capture error:', error);
    return NextResponse.json(
      { error: 'Failed to capture PayPal payment' },
      { status: 500 }
    );
  }
}
