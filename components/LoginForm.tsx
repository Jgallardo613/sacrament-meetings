'use client';

import { useActionState } from 'react';
import { signIn, type SignInState } from '@/lib/auth-actions';

const inputClass =
  'mt-1 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20';

export default function LoginForm({ callbackUrl, initialError }: { callbackUrl: string; initialError: string | null }) {
  const initialState: SignInState = { message: initialError };
  const [state, formAction, pending] = useActionState(signIn, initialState);

  return (
    <form action={formAction} noValidate aria-describedby="login-error" className="card space-y-5 p-6 sm:p-8">
      <input type="hidden" name="callbackUrl" value={callbackUrl} />
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-slate-700">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          defaultValue={state.email ?? ''}
          className={inputClass}
        />
      </div>
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-slate-700">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className={inputClass}
        />
      </div>
      <div id="login-error" aria-live="polite" aria-atomic="true" className="text-sm text-red-600">
        {state.message && <p>{state.message}</p>}
      </div>
      <button type="submit" disabled={pending} className="btn-primary w-full disabled:opacity-60">
        {pending ? 'Signing in...' : 'Sign in'}
      </button>
    </form>
  );
}
