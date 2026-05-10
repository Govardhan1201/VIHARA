import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
export const dynamic = 'force-dynamic';

function isAdmin(request: Request): boolean {
  const token = request.headers.get('x-admin-token');
  return token === process.env.ADMIN_PASSWORD;
}

export async function GET() {
  try {
    let regions = await prisma.stateRegion.findMany();
    
    // Auto-seed from static if empty
    if (regions.length === 0) {
      const { statesData: staticStates } = await import('@/lib/destinations');
      for (const [name, data] of Object.entries(staticStates)) {
        await prisma.stateRegion.create({
          data: {
            name,
            coords: data.coords,
            color: data.color,
            subZones: data.subZones
          }
        });
      }
      regions = await prisma.stateRegion.findMany();
    }

    // Format them back into a map for the frontend
    const statesData: Record<string, any> = {};
    regions.forEach((r: any) => {
      statesData[r.name] = {
        coords: r.coords,
        color: r.color,
        subZones: r.subZones
      };
    });
    return NextResponse.json({ statesData, raw: regions });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch regions' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (!isAdmin(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  
  try {
    const body = await request.json();
    const { name, coords, color, subZones } = body;
    
    if (!name || !coords || !color || !subZones) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const region = await prisma.stateRegion.upsert({
      where: { name },
      update: { coords, color, subZones },
      create: { name, coords, color, subZones }
    });

    return NextResponse.json({ region });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to upsert region' }, { status: 500 });
  }
}
