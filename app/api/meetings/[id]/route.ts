import { NextResponse, type NextRequest } from 'next/server';
import { getMeetingById, parseMeetingId } from '@/lib/meetings';
import { notImplementedYet, serverError } from '@/lib/api';

/**
 * GET /api/meetings/:id
 * Returns { meeting, speakers }. 400 for a non-numeric id, 404 if not found.
 */
export async function GET(_request: NextRequest, ctx: RouteContext<'/api/meetings/[id]'>) {
  const { id: rawId } = await ctx.params;
  const id = parseMeetingId(rawId);
  if (id === null) {
    return NextResponse.json({ error: 'Invalid id: must be a positive whole number' }, { status: 400 });
  }

  try {
    const found = await getMeetingById(id);
    if (!found) {
      return NextResponse.json({ error: `Meeting ${id} not found` }, { status: 404 });
    }
    const { speakers, ...meeting } = found;
    return NextResponse.json({ meeting, speakers });
  } catch (error) {
    return serverError(error);
  }
}

// STUB (Week 04): update a meeting.
export async function PUT() {
  return notImplementedYet('Updating a meeting');
}

// STUB (Week 04): delete a meeting.
export async function DELETE() {
  return notImplementedYet('Deleting a meeting');
}
