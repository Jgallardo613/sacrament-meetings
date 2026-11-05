import { NextRequest, NextResponse } from 'next/server';
import { getMeetingById } from '@/lib/meetings-db';
import { SacramentMeeting } from '@/lib/types';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(
  _request: NextRequest,
  context: RouteContext
): Promise<NextResponse<SacramentMeeting | { error: string }>> {
  const { id } = await context.params;
  const numericId = Number(id);

  if (!Number.isInteger(numericId) || isNaN(numericId)) {
    return NextResponse.json({ error: 'Invalid id: must be an integer' }, { status: 400 });
  }

  const meeting = getMeetingById(numericId);
  if (!meeting) {
    return NextResponse.json({ error: `Meeting with id ${numericId} not found` }, { status: 404 });
  }

  return NextResponse.json(meeting);
}
