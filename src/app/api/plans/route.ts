import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET - List all active plans
export async function GET() {
  try {
    const plans = await db.plan.findMany({
      where: { isActive: true },
      orderBy: [
        { type: 'asc' },
      ],
    });

    // If no plans exist, seed them
    if (plans.length === 0) {
      const seededPlans = await seedPlans();
      return NextResponse.json({ plans: seededPlans });
    }

    return NextResponse.json({ plans });
  } catch (error) {
    console.error('Get plans error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch plans' },
      { status: 500 }
    );
  }
}

async function seedPlans() {
  const defaultPlans = [
    {
      id: 'one-time',
      name: 'One-Time Service',
      type: 'ONE_TIME' as const,
      price: 0,
      discount: 0,
      features: JSON.stringify([
        'Flexible scheduling',
        'No commitment',
        'All services available',
        'Single payment',
      ]),
    },
    {
      id: 'weekly',
      name: 'Weekly Plan',
      type: 'WEEKLY' as const,
      price: 0,
      discount: 15,
      features: JSON.stringify([
        '15% discount on all services',
        'Priority scheduling',
        'Consistent cleaner',
        'Easy rescheduling',
      ]),
    },
    {
      id: 'monthly',
      name: 'Monthly Plan',
      type: 'MONTHLY' as const,
      price: 0,
      discount: 10,
      features: JSON.stringify([
        '10% discount on all services',
        'Flexible scheduling',
        'Same cleaner option',
        'Cancel anytime',
      ]),
    },
  ];

  const created = [];
  for (const plan of defaultPlans) {
    const createdPlan = await db.plan.create({
      data: plan,
    });
    created.push(createdPlan);
  }

  return created;
}
