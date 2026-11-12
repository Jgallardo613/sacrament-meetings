import { NextResponse, type NextRequest } from 'next/server';
import { parsePage, searchMeetings } from '@/lib/meetings';
import { notImplementedYet, serverError } from '@/lib/api';

/**
 * GET /api/meetings?query=park&page=2&date=2026-11-02
 * All params are optional. Returns { meetings, total, page, totalPages },
 * 5 meetings per page, newest first.
 */
export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const query = params.get('query') ?? '';
  const date = params.get('date') ?? undefined;

  if (params.has('page') && !/^\d+$/.test(params.get('page') ?? '')) {
    return NextResponse.json({ error: 'page must be a positive whole number' }, { status: 400 });
  }
  if (date !== undefined && !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json({ error: 'date must be formatted YYYY-MM-DD' }, { status: 400 });
  }

  try {
    const result = await searchMeetings({ query, page: parsePage(params.get('page') ?? undefined), date });
    return NextResponse.json(result);
  } catch (error) {
    return serverError(error);
  }
}

// STUB (Week 04): create a meeting.
export async function POST() {
  return notImplementedYet('Creating a meeting');
}
