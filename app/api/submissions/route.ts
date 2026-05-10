import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
export const dynamic = 'force-dynamic';

const strip = (s: unknown, max = 300) =>
  typeof s === 'string' ? s.trim().slice(0, max).replace(/<[^>]*>/g, '') : '';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const where = status && ['PENDING','APPROVED','REJECTED'].includes(status) ? { status } : {};
    const submissions = await prisma.submission.findMany({ where, orderBy: { createdAt: 'desc' } });
    return NextResponse.json({ submissions });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch submissions' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();

    // Validate required fields
    const placeName = strip(data.placeName, 100);
    const state = strip(data.state, 80);
    const subZone = strip(data.subZone, 80);
    const description = strip(data.description, 1000);
    const submitterName = strip(data.submitterName, 100);
    const submitterEmail = strip(data.submitterEmail, 200);
    const budget = parseInt(data.budget);

    if (!placeName || !state || !subZone || !description || !submitterName || !submitterEmail)
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });

    if (isNaN(budget) || budget < 0 || budget > 1000000)
      return NextResponse.json({ error: 'Invalid budget' }, { status: 400 });

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(submitterEmail))
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 });

    const submission = await prisma.submission.create({
      data: {
        placeName, state, subZone, description,
        activity: strip(data.activity, 50) || 'nature',
        duration: strip(data.duration, 50) || 'short',
        budget,
        transport: strip(data.transport, 100) || 'Bus',
        accommodation: strip(data.accommodation, 50) || 'budget',
        emoji: strip(data.emoji, 10) || '🌟',
        mapLink: strip(data.mapLink, 500) || null,
        imageLink: strip(data.imageLink, 500) || null,
        videoLink: strip(data.videoLink, 500) || null,
        submitterName,
        submitterEmail,
        status: 'PENDING',
      }
    });
    return NextResponse.json({ submission }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create submission' }, { status: 500 });
  }
}

