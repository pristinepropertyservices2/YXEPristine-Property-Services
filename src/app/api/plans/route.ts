import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { ensureDefaultPlans } from '@/lib/plans';

// GET - List all active plans
export async function GET() {
  try {
    const plans = await db.plan.findMany({
      where: { isActive: true },
      orderBy: [{ type: 'asc' }],
    });

    if (plans.length === 0) {
      await ensureDefaultPlans();
      const seeded = await db.plan.findMany({
        where: { isActive: true },
        orderBy: [{ type: 'asc' }],
      });
      return NextResponse.json({ plans: seeded });
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
