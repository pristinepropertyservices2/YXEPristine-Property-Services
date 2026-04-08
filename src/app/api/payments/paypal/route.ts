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
    const { amount, planId, planName, userId, description } = body;

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: 'Invalid amount' },
        { status: 400 }
      );
    }

    const accessToken = await getPayPalAccessToken();

    // If PayPal is not configured, return mock response for demo
    if (!accessToken) {
      const mockOrderId = `PAYPAL-MOCK-${Date.now()}`;
      
      // Create a mock payment record
      const payment = await db.payment.create({
        data: {
          userId: userId || 'guest',
          amount: amount,
          currency: 'CAD',
          status: 'PENDING',
          method: 'PAYPAL',
          paypalId: mockOrderId,
          description: `${planName} - ${description || 'Subscription'}`,
        },
      });

      return NextResponse.json({
        orderId: mockOrderId,
        paymentId: payment.id,
        isDemo: true,
        message: 'PayPal not configured. Using demo mode.',
      });
    }

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
              value: amount.toFixed(2),
            },
            description: `${planName} - ${description || 'Subscription'}`,
          },
        ],
        application_context: {
          brand_name: 'YXE Pristine Property Services',
          user_action: 'PAY_NOW',
        },
      }),
    });

    const order = await orderResponse.json();

    if (order.error) {
      throw new Error(order.error.message);
    }

    // Create payment record
    const payment = await db.payment.create({
      data: {
        userId: userId || 'guest',
        amount: amount,
        currency: 'CAD',
        status: 'PENDING',
        method: 'PAYPAL',
        paypalId: order.id,
        description: `${planName} - ${description || 'Subscription'}`,
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
