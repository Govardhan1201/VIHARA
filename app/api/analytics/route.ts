import { NextResponse } from 'next/server';
import { redis } from '@/lib/redis';
export const dynamic = 'force-dynamic';

// POST /api/analytics — record a destination view
export async function POST(request: Request) {
  try {
    const { destination } = await request.json();
    if (!destination) return NextResponse.json({ ok: false });
    const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
    if (redis) {
      await redis.zincrby(`analytics:views:${today}`, 1, destination);
      // Auto-expire after 7 days
      await redis.expire(`analytics:views:${today}`, 7 * 24 * 60 * 60);
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false });
  }
}

// GET /api/analytics — top destinations today
export async function GET() {
  try {
    const today = new Date().toISOString().slice(0, 10);
    const trending: { name: string; views: number }[] = [];
    if (redis) {
      // Get top 6 destinations with scores (highest first)
      const results = await redis.zrange(`analytics:views:${today}`, 0, 5, {
        rev: true,
        withScores: true,
      });

      // results is [name, score, name, score, ...]
      for (let i = 0; i < results.length; i += 2) {
        trending.push({ name: String(results[i]), views: Number(results[i + 1]) });
      }
    }

    return NextResponse.json({ trending, date: today });
  } catch {
    return NextResponse.json({ trending: [], date: '' });
  }
}
