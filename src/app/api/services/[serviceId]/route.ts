import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

type Params = { params: Promise<{ serviceId: string }> };

export async function GET(_request: NextRequest, { params }: Params) {
  try {
    const { serviceId } = await params;
    const service = await db.service.findUnique({
      where: { id: serviceId },
      include: {
        addOns: { orderBy: { createdAt: 'asc' } },
      },
    });

    if (!service) {
      return NextResponse.json({ error: 'Service not found' }, { status: 404 });
    }

    const features = JSON.parse(service.features || '[]') as string[];

    return NextResponse.json({
      service: {
        ...service,
        features,
      },
    });
  } catch (error) {
    console.error('Error fetching service:', error);
    return NextResponse.json({ error: 'Failed to fetch service' }, { status: 500 });
  }
}
