import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { authConfig } from './auth.config';

// PLACEHOLDER, HARDCODED: the only account is admin@example.com / admin1234.
// Replace this with a users table before real use.
const PLACEHOLDER_USER = {
  id: '1',
  name: 'Ward Admin',
  email: 'admin@example.com',
  // bcrypt hash of the placeholder password "admin1234".
  passwordHash: '$2b$10$ffasTqEIwBYrqYBIukKXTeVwRqon/PQ/m4Xtk3LXHd6660.Yi9Zli',
};

const CredentialsSchema = z.object({
  email: z.string().trim().toLowerCase(),
  password: z.string(),
});

export const { auth, signIn, signOut, handlers } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const parsed = CredentialsSchema.safeParse(credentials);
        if (!parsed.success) return null;

        // Compare even when the email is wrong so both failures take the same time.
        const passwordMatches = await bcrypt.compare(parsed.data.password, PLACEHOLDER_USER.passwordHash);
        if (!passwordMatches || parsed.data.email !== PLACEHOLDER_USER.email) return null;

        return { id: PLACEHOLDER_USER.id, name: PLACEHOLDER_USER.name, email: PLACEHOLDER_USER.email };
      },
    }),
  ],
});
