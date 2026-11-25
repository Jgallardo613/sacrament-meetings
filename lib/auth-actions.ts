'use server';

import { AuthError } from 'next-auth';
import { z } from 'zod';
import { signIn as authSignIn, signOut as authSignOut } from '@/auth';

export type SignInState = {
  message?: string | null;
  /** Sent back so the form keeps the email after a failed sign-in. */
  email?: string;
};

const SignInSchema = z.object({
  email: z.string().trim().pipe(z.email('Enter a valid email address.')),
  password: z.string().min(1, 'Enter your password.'),
});

/** Keep only the path, so the form can never redirect to another site. */
function safeRedirectPath(value: FormDataEntryValue | null): string {
  if (typeof value !== 'string' || !URL.canParse(value, 'http://localhost')) return '/meetings';
  const { pathname, search } = new URL(value, 'http://localhost');
  return pathname === '/' || pathname.startsWith('//') ? '/meetings' : `${pathname}${search}`;
}

export async function signIn(prevState: SignInState, formData: FormData): Promise<SignInState> {
  const rawEmail = formData.get('email');
  const email = typeof rawEmail === 'string' ? rawEmail : '';
  const parsed = SignInSchema.safeParse({ email, password: formData.get('password') ?? '' });
  if (!parsed.success) {
    return { message: parsed.error.issues.map((i) => i.message).join(' '), email };
  }

  try {
    await authSignIn('credentials', {
      ...parsed.data,
      redirectTo: safeRedirectPath(formData.get('callbackUrl')),
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return {
        message:
          error.type === 'CredentialsSignin'
            ? 'Invalid email or password.'
            : 'Something went wrong while signing in. Please try again.',
        email,
      };
    }
    // A successful sign-in redirects by throwing, so let it through.
    throw error;
  }
  return {};
}

export async function signOut(): Promise<void> {
  await authSignOut({ redirectTo: '/login' });
}
