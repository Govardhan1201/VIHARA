import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const where = status ? { status } : {};
    const submissions = await prisma.submission.findMany({ where, orderBy: { createdAt: 'desc' } });
    return NextResponse.json({ submissions });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch submissions' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const submission = await prisma.submission.create({
      data: {
        placeName: data.placeName,
        state: data.state,
        subZone: data.subZone,
        description: data.description,
        activity: data.activity,
        duration: data.duration,
        budget: parseInt(data.budget),
        transport: data.transport,
        accommodation: data.accommodation || 'budget',
        emoji: data.emoji || '🌟',
        mapLink: data.mapLink || null,
        imageLink: data.imageLink || null,
        videoLink: data.videoLink || null,
        submitterName: data.submitterName,
        submitterEmail: data.submitterEmail,
        status: 'PENDING',
      }
    });
    return NextResponse.json({ submission }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create submission' }, { status: 500 });
  }
}
