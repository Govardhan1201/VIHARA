import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendSubmissionResult } from '@/lib/email';
export const dynamic = 'force-dynamic';

function isAdmin(request: Request): boolean {
  const token = request.headers.get('x-admin-token');
  return token === process.env.ADMIN_PASSWORD;
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isAdmin(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const { id } = await params;
    const { status } = await request.json();
    if (!['APPROVED','REJECTED','PENDING'].includes(status))
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    const updated = await prisma.submission.update({ where: { id }, data: { status } });
    // Send result email (non-blocking)
    if (status === 'APPROVED' || status === 'REJECTED') {
      sendSubmissionResult(updated.submitterEmail, updated.submitterName, updated.placeName, status === 'APPROVED').catch(console.error);
    }
    return NextResponse.json({ submission: updated });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update submission' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isAdmin(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const { id } = await params;
    await prisma.submission.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete submission' }, { status: 500 });
  }
}
