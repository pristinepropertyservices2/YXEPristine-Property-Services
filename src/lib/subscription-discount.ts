import { db } from '@/lib/db';

export type ActiveSubscriptionDiscount = {
  subscriptionId: string;
  planId: string;
  planName: string;
  planType: string;
  /** Percent off services (e.g. 15 for weekly, 10 for monthly). */
  discountPercent: number;
};

/** Active subscription with a service discount (weekly 15%, monthly 10%). */
export async function getActiveSubscriptionDiscount(
  userId: string
): Promise<ActiveSubscriptionDiscount | null> {
  const now = new Date();

  const subscriptions = await db.subscription.findMany({
    where: {
      userId,
      status: 'ACTIVE',
      plan: { discount: { gt: 0 } },
    },
    include: { plan: true },
    orderBy: { createdAt: 'desc' },
  });

  const active = subscriptions.find(
    (s) => !s.endDate || s.endDate > now
  );

  if (!active || active.plan.discount <= 0) {
    return null;
  }

  return {
    subscriptionId: active.id,
    planId: active.planId,
    planName: active.plan.name,
    planType: active.plan.type,
    discountPercent: active.plan.discount,
  };
}

export { applyPercentDiscount } from '@/lib/booking-price';
