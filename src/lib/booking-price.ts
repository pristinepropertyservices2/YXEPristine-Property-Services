export type AddOnLine = { id: string; name: string; price: number };

/**
 * Base service price scales proportionally if duration exceeds the service default.
 * Add-ons are added on top.
 */
export function calculateBookingTotal(
  basePrice: number,
  baseDurationMinutes: number,
  durationMinutes: number,
  addOns: AddOnLine[]
): number {
  const base = Math.max(baseDurationMinutes, 1);
  const scale = durationMinutes / base;
  const scaledService = basePrice * scale;
  const extras = addOns.reduce((sum, a) => sum + a.price, 0);
  return Math.round((scaledService + extras) * 100) / 100;
}

/** Apply subscription or promo percent off (e.g. 15 = 15% off). */
export function applyPercentDiscount(amount: number, discountPercent: number): number {
  if (discountPercent <= 0) return amount;
  const discounted = amount * (1 - discountPercent / 100);
  return Math.round(discounted * 100) / 100;
}

export function parseAddOnsJson(raw: string | null | undefined): AddOnLine[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (x): x is AddOnLine =>
        typeof x === 'object' &&
        x !== null &&
        'id' in x &&
        'price' in x &&
        typeof (x as AddOnLine).price === 'number'
    );
  } catch {
    return [];
  }
}
