const SQUARE_VERSION = '2024-04-17';

export function isSquareConfigured(): boolean {
  return Boolean(
    process.env.SQUARE_ACCESS_TOKEN &&
      (process.env.SQUARE_LOCATION_ID || process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID)
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
  return process.env.SQUARE_LOCATION_ID || process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID;
}

export function getSquareApplicationId(): string | undefined {
  return process.env.NEXT_PUBLIC_SQUARE_APPLICATION_ID;
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
  const token = process.env.SQUARE_ACCESS_TOKEN;
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
