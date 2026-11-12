import { NextResponse } from 'next/server';

/**
 * PLACEHOLDER: shared 501 response for the write endpoints (POST/PUT/DELETE).
 * They are stubs until creating/editing meetings is built in Week 04.
 */
export function notImplementedYet(action: string) {
  return NextResponse.json(
    { error: `${action} is not implemented yet — coming in Week 04.` },
    { status: 501 }
  );
}

/** Log the real error on the server; send the client a generic message. */
export function serverError(error: unknown) {
  console.error(error);
  return NextResponse.json({ error: 'Could not load meetings.' }, { status: 500 });
}
