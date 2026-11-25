import type { Metadata } from 'next';
import Link from 'next/link';
import LoginForm from '@/components/LoginForm';

export const metadata: Metadata = {
  title: 'Sign In',
  description: 'Sign in to create and edit sacrament meetings.',
};

export default async function LoginPage({ searchParams }: PageProps<'/login'>) {
  const { callbackUrl, error } = await searchParams;

  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center space-y-6 px-4 py-8 sm:px-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Sign in</h1>
        <p className="text-sm text-slate-500">Sign in to create, edit, or delete meetings.</p>
      </div>
      <LoginForm
        callbackUrl={typeof callbackUrl === 'string' ? callbackUrl : '/meetings'}
        initialError={
          error === undefined
            ? null
            : error === 'CredentialsSignin'
              ? 'Invalid email or password.'
              : 'Something went wrong while signing in. Please try again.'
        }
      />
      <Link href="/meetings" className="text-sm text-blue-600 hover:underline">
        ← Back to meetings
      </Link>
    </main>
  );
}
