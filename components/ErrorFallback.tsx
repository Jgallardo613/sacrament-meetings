'use client';

import Link from 'next/link';

/** Shared body for error.tsx boundaries. */
export default function ErrorFallback({ title, reset }: { title: string; reset: () => void }) {
  return (
    <div className="card mx-auto max-w-xl space-y-3 text-center" role="alert">
      <h1 className="text-xl font-semibold text-slate-900">{title}</h1>
      <p className="text-sm text-slate-600">
        Something went wrong while talking to the database. Please try again.
      </p>
      <div className="flex justify-center gap-3">
        <button type="button" onClick={() => reset()} className="btn-primary">
          Try Again
        </button>
        <Link href="/meetings" className="btn-secondary">
          Back to meetings
        </Link>
      </div>
    </div>
  );
}
