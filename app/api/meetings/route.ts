import { NextRequest, NextResponse } from 'next/server';
import { getMeetings } from '@/lib/meetings-db';
import { SacramentMeeting } from '@/lib/types';

export async function GET(request: NextRequest): Promise<NextResponse<SacramentMeeting[]>> {
  const { searchParams } = new URL(request.url);
  const dateFilter = searchParams.get('date') ?? undefined;
  const meetings = getMeetings(dateFilter);
  return NextResponse.json(meetings);
}
