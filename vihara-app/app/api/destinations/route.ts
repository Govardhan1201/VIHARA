import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const budget = searchParams.get('budget');
    const minDuration = searchParams.get('minDuration');

    const where: any = {};
    if (category && category !== 'All') where.category = category;
    if (budget && budget !== 'All') where.budget = budget;
    if (minDuration) where.duration = { gte: parseInt(minDuration) };

    const destinations = await prisma.destination.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ destinations });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch destinations' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const destination = await prisma.destination.create({
      data: {
        name: data.name,
        description: data.description,
        location: data.location,
        latitude: parseFloat(data.latitude),
        longitude: parseFloat(data.longitude),
        state: data.state,
        budget: data.budget,
        duration: parseInt(data.duration),
        category: data.category,
        image: data.image
      }
    });
    return NextResponse.json({ destination }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create destination' }, { status: 500 });
  }
}
