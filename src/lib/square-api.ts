const SQUARE_VERSION = '2024-04-17';

export type SquarePublicEnvironment = 'sandbox' | 'production';

export function getSquareEnvironment(): SquarePublicEnvironment {
  return process.env.SQUARE_ENVIRONMENT === 'production' ? 'production' : 'sandbox';
}

export function isSquareConfigured(): boolean {
  return Boolean(
    process.env.SQUARE_ACCESS_TOKEN?.trim() &&
      (process.env.SQUARE_LOCATION_ID || process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID)?.trim() &&
      process.env.NEXT_PUBLIC_SQUARE_APPLICATION_ID?.trim()
  );
}

export function getSquareConnectBaseUrl(): string {
  return process.env.SQUARE_ENVIRONMENT === 'production'
    ? 'https://connect.squareup.com'
    : 'https://connect.squareupsandbox.com';
}

export function getSquarePublicScriptUrl(): string {
  return process.env.SQUARE_ENVIRONMENT === 'production'
    ? 'https://web.squarecdn.com/v1/square.js'
    : 'https://sandbox.web.squarecdn.com/v1/square.js';
}

export function getSquareLocationId(): string | undefined {
  const raw = process.env.SQUARE_LOCATION_ID || process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID;
  const v = raw?.trim();
  return v || undefined;
}

export function getSquareApplicationId(): string | undefined {
  const v = process.env.NEXT_PUBLIC_SQUARE_APPLICATION_ID?.trim();
  return v || undefined;
}

/**
 * Catch common misconfigurations before the Web Payments SDK throws a vague
 * "applicationId option is not in the correct format" error.
 */
export function validateSquareWebPaymentsClientIds(opts: {
  applicationId: string;
  locationId: string;
  environment: SquarePublicEnvironment;
}): string | null {
  const { applicationId, locationId, environment } = opts;

  if (!applicationId || !locationId) {
    return 'Application ID and Location ID must be non-empty.';
  }

  if (/\s/.test(applicationId) || /\s/.test(locationId)) {
    return 'Application ID or Location ID contains whitespace. Remove stray spaces or smart quotes from your .env.';
  }

  // Access tokens are long opaque strings; Application IDs are short with known prefixes.
  if (applicationId.length > 80) {
    return 'NEXT_PUBLIC_SQUARE_APPLICATION_ID looks like an access token (too long). In Square Developer → your app → Credentials, copy Application ID, not Access token.';
  }

  if (applicationId.startsWith('L') && /^L[A-Za-z0-9]{10,}$/.test(applicationId)) {
    return 'NEXT_PUBLIC_SQUARE_APPLICATION_ID looks like a Location ID (starts with L). Use the Application ID from the Credentials tab, not Locations.';
  }

  if (environment === 'sandbox') {
    if (!applicationId.startsWith('sandbox-')) {
      return 'For SQUARE_ENVIRONMENT=sandbox (default), NEXT_PUBLIC_SQUARE_APPLICATION_ID must be your Sandbox Application ID from the developer app — it starts with "sandbox-". A production Application ID will not work with the sandbox Web Payments script.';
    }
  } else if (applicationId.startsWith('sandbox-')) {
    return 'For SQUARE_ENVIRONMENT=production, use your Production Application ID (not a sandbox-* id) with https://web.squarecdn.com/v1/square.js.';
  }

  return null;
}

type SquarePaymentResponse = {
  payment?: { id?: string; status?: string };
  errors?: { category?: string; code?: string; detail?: string }[];
};

export async function squareChargeCard(opts: {
  sourceId: string;
  locationId: string;
  amountCents: number;
  currency: string;
  idempotencyKey: string;
  note?: string;
}): Promise<{ id: string; status: string }> {
  const token = process.env.SQUARE_ACCESS_TOKEN?.trim();
  if (!token) {
    throw new Error('SQUARE_ACCESS_TOKEN is not set');
  }

  const body: Record<string, unknown> = {
    idempotency_key: opts.idempotencyKey,
    location_id: opts.locationId,
    source_id: opts.sourceId,
    amount_money: {
      amount: opts.amountCents,
      currency: opts.currency,
    },
    autocomplete: true,
  };
  if (opts.note) {
    body.note = opts.note;
  }

  const res = await fetch(`${getSquareConnectBaseUrl()}/v2/payments`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Square-Version': SQUARE_VERSION,
    },
    body: JSON.stringify(body),
  });

  const data = (await res.json()) as SquarePaymentResponse;
  if (!res.ok || !data.payment?.id) {
    const msg =
      data.errors?.map((e) => e.detail || e.code).filter(Boolean).join('; ') ||
      `Square error (${res.status})`;
    throw new Error(msg);
  }

  return { id: data.payment.id, status: data.payment.status || 'UNKNOWN' };
}
