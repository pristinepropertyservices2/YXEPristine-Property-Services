import type { PlanType } from '@prisma/client';
import { db } from '@/lib/db';

export type DefaultPlanSeed = {
  id: string;
  name: string;
  type: PlanType;
  price: number;
  discount: number;
  features: string[];
};

/** Subscription list prices (CAD/month). Must match payment UI. */
export const DEFAULT_PLANS: DefaultPlanSeed[] = [
  {
    id: 'one-time',
    name: 'One-Time Service',
    type: 'ONE_TIME',
    price: 0,
    discount: 0,
    features: ['Flexible scheduling', 'No commitment', 'All services available', 'Single payment'],
  },
  {
    id: 'weekly',
    name: 'Weekly Plan',
    type: 'WEEKLY',
    price: 29.99,
    discount: 15,
    features: [
      '15% discount on all services',
      'Priority scheduling',
      'Consistent cleaner',
      'Easy rescheduling',
    ],
  },
  {
    id: 'monthly',
    name: 'Monthly Plan',
    type: 'MONTHLY',
    price: 19.99,
    discount: 10,
    features: [
      '10% discount on all services',
      'Flexible scheduling',
      'Same cleaner option',
      'Cancel anytime',
    ],
  },
];

/** Idempotent upsert so plan checkout works even if GET /api/plans was never called. */
export async function ensureDefaultPlans() {
  for (const plan of DEFAULT_PLANS) {
    await db.plan.upsert({
      where: { id: plan.id },
      create: {
        id: plan.id,
        name: plan.name,
        type: plan.type,
        price: plan.price,
        discount: plan.discount,
        features: JSON.stringify(plan.features),
        isActive: true,
      },
      update: {
        name: plan.name,
        type: plan.type,
        price: plan.price,
        discount: plan.discount,
        features: JSON.stringify(plan.features),
        isActive: true,
      },
    });
  }
}

export function getDefaultPlanPrice(type: string): number {
  const plan = DEFAULT_PLANS.find((p) => p.type === type);
  return plan?.price ?? 0;
}
