import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { db } from '@/lib/db';
import { ensureDefaultPlans } from '@/lib/plans';

// GET - List user's subscriptions
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID required' },
        { status: 400 }
      );
    }

    const subscriptions = await db.subscription.findMany({
      where: { userId },
      include: { plan: true },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ subscriptions });
  } catch (error) {
    console.error('Get subscriptions error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch subscriptions' },
      { status: 500 }
    );
  }
}

// POST - Create a new subscription after plan payment
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { planId, paymentId } = body as { planId?: string; paymentId?: string };

    if (!planId) {
      return NextResponse.json(
        { error: 'Plan ID required' },
        { status: 400 }
      );
    }

    await ensureDefaultPlans();

    const plan = await db.plan.findUnique({
      where: { id: planId },
    });

    if (!plan) {
      return NextResponse.json(
        { error: 'Plan not found' },
        { status: 404 }
      );
    }

    if (plan.type !== 'ONE_TIME' && plan.price > 0) {
      if (!paymentId) {
        return NextResponse.json(
          { error: 'Payment ID required for paid plans' },
          { status: 400 }
        );
      }

      const payment = await db.payment.findUnique({
        where: { id: paymentId },
      });

      if (!payment || payment.userId !== session.user.id) {
        return NextResponse.json(
          { error: 'Payment not found' },
          { status: 404 }
        );
      }

      if (payment.status !== 'COMPLETED') {
        return NextResponse.json(
          { error: 'Payment not completed' },
          { status: 400 }
        );
      }
    }

    const existingActive = await db.subscription.findFirst({
      where: {
        userId: session.user.id,
        planId: plan.id,
        status: 'ACTIVE',
      },
    });

    if (existingActive) {
      return NextResponse.json({
        success: true,
        subscription: existingActive,
        alreadyActive: true,
      });
    }

    // Calculate subscription end date based on plan type
    const startDate = new Date();
    let endDate: Date | undefined;

    if (plan.type === 'WEEKLY') {
      endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 7);
    } else if (plan.type === 'MONTHLY') {
      endDate = new Date(startDate);
      endDate.setMonth(endDate.getMonth() + 1);
    }

    const subscription = await db.subscription.create({
      data: {
        userId: session.user.id,
        planId,
        status: 'ACTIVE',
        startDate,
        endDate,
      },
      include: { plan: true },
    });

    if (paymentId) {
      await db.payment.update({
        where: { id: paymentId },
        data: { subscriptionId: subscription.id },
      });
    }

    return NextResponse.json({
      success: true,
      subscription,
    });
  } catch (error) {
    console.error('Create subscription error:', error);
    return NextResponse.json(
      { error: 'Failed to create subscription' },
      { status: 500 }
    );
  }
}

// DELETE - Cancel subscription
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const subscriptionId = searchParams.get('id');

    if (!subscriptionId) {
      return NextResponse.json(
        { error: 'Subscription ID required' },
        { status: 400 }
      );
    }

    const subscription = await db.subscription.update({
      where: { id: subscriptionId },
      data: { status: 'CANCELLED' },
    });

    return NextResponse.json({
      success: true,
      subscription,
    });
  } catch (error) {
    console.error('Cancel subscription error:', error);
    return NextResponse.json(
      { error: 'Failed to cancel subscription' },
      { status: 500 }
    );
  }
}
