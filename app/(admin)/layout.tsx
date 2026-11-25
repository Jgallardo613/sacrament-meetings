import Link from 'next/link';
import { signOut } from '@/lib/auth-actions';

// middleware.ts sends signed-out visitors to /login before these pages render.
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header className="border-b border-slate-800 bg-slate-900 text-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <span className="text-lg font-semibold">Ward Admin</span>
          </div>
          <nav aria-label="Admin navigation" className="flex items-center gap-4">
            <Link href="/meetings" className="text-sm text-slate-300 hover:text-white">
              ← Back to meetings
            </Link>
            <form action={signOut}>
              <button
                type="submit"
                className="rounded-lg border border-slate-600 px-3 py-1.5 text-sm font-medium text-slate-200 hover:bg-slate-800 hover:text-white"
              >
                Sign out
              </button>
            </form>
          </nav>
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6">{children}</main>
    </>
  );
}
