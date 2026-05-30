import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { getActiveSubscriptionDiscount } from '@/lib/subscription-discount';

/** Current user's active plan discount for booking checkout (15% weekly, 10% monthly). */
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ discount: null });
  }

  const discount = await getActiveSubscriptionDiscount(session.user.id);
  if (!discount) {
    return NextResponse.json({ discount: null });
  }

  return NextResponse.json({
    discount: {
      planId: discount.planId,
      planName: discount.planName,
      planType: discount.planType,
      discountPercent: discount.discountPercent,
    },
  });
}
