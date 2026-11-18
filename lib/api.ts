import { NextResponse } from 'next/server';

/**
 * PLACEHOLDER: shared 501 response for the JSON write endpoints (POST/PUT/DELETE).
 * Writes go through the server actions in lib/actions.ts; these API stubs remain unimplemented.
 */
export function notImplementedYet(action: string) {
  return NextResponse.json(
    { error: `${action} is not available through the API yet. Use the meeting forms in the app.` },
    { status: 501 }
  );
}

/** Log the real error on the server; send the client a generic message. */
export function serverError(error: unknown) {
  console.error(error);
  return NextResponse.json({ error: 'Could not load meetings.' }, { status: 500 });
}
