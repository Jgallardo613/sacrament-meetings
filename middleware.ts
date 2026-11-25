import NextAuth from 'next-auth';
import { authConfig } from './auth.config';

// Next.js 16 prefers proxy.ts, but proxy cannot use the edge runtime. This
// stays as middleware.ts and only imports the edge-safe authConfig.
const { auth } = NextAuth(authConfig);

export default auth;

export const config = {
  matcher: ['/admin/:path*', '/meetings/:id/edit'],
};
