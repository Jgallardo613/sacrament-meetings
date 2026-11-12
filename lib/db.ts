import 'server-only';
import { neon, type NeonQueryFunction } from '@neondatabase/serverless';

// Next.js loads DATABASE_URL from .env.local (local dev) or from the
// Vercel project's Environment Variables (deployments). It is never
// exposed to the browser because it has no NEXT_PUBLIC_ prefix and this
// module is marked server-only.
//
// The client is created lazily, on the first query, so `next build`
// succeeds without DATABASE_URL. A missing URL surfaces as a clear error
// at request time instead.
let client: NeonQueryFunction<false, false> | undefined;

export function getSql(): NeonQueryFunction<false, false> {
  if (!client) {
    const url = process.env.DATABASE_URL;
    if (!url) {
      throw new Error(
        'DATABASE_URL is not set. Add your Neon connection string to .env.local ' +
          '(and to the Vercel project settings for deployments).'
      );
    }
    client = neon(url);
  }
  return client;
}
