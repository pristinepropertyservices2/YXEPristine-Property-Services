import { NextResponse } from 'next/server';
import {
  getSquareApplicationId,
  getSquareLocationId,
  getSquarePublicScriptUrl,
  isSquareConfigured,
} from '@/lib/square-api';

/** Public config for the Web Payments SDK (no secrets). */
export async function GET() {
  if (!isSquareConfigured()) {
    return NextResponse.json(
      {
        error:
          'Square is not configured. Set SQUARE_ACCESS_TOKEN, SQUARE_LOCATION_ID (or NEXT_PUBLIC_SQUARE_LOCATION_ID), and NEXT_PUBLIC_SQUARE_APPLICATION_ID. Use SQUARE_ENVIRONMENT=sandbox or production.',
      },
      { status: 503 }
    );
  }

  const applicationId = getSquareApplicationId();
  const locationId = getSquareLocationId();
  if (!applicationId || !locationId) {
    return NextResponse.json(
      {
        error:
          'Missing NEXT_PUBLIC_SQUARE_APPLICATION_ID or SQUARE_LOCATION_ID (or NEXT_PUBLIC_SQUARE_LOCATION_ID).',
      },
      { status: 503 }
    );
  }

  return NextResponse.json({
    applicationId,
    locationId,
    scriptUrl: getSquarePublicScriptUrl(),
    environment: process.env.SQUARE_ENVIRONMENT === 'production' ? 'production' : 'sandbox',
  });
}
