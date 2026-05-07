import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';

// Destinations are now served as static data from lib/destinations.ts
// This route is kept for backward compatibility
export async function GET() {
  return NextResponse.json({ destinations: [] });
}
