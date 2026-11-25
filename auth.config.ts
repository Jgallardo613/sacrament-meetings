import type { NextAuthConfig } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

// Shared by middleware.ts, which runs on the edge runtime. Keep bcryptjs and
// database code out of this file. The real credential check is in auth.ts.
export const authConfig = {
  pages: { signIn: '/login' },
  providers: [
    // No authorize here, so this copy rejects every sign-in. auth.ts replaces it.
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
    }),
  ],
  callbacks: {
    // Decides every request that matches middleware.ts. Returning false sends
    // the visitor to pages.signIn with a callbackUrl.
    authorized: ({ auth }) => Boolean(auth?.user),
  },
} satisfies NextAuthConfig;
