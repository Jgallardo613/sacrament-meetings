import Link from 'next/link';

// PLACEHOLDER: there is no login yet, so these admin pages are not protected.
// Authentication is planned for a later week.
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header className="border-b border-slate-800 bg-slate-900 text-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <span className="text-lg font-semibold">Ward Admin</span>
            <span className="badge bg-amber-100 text-amber-800">No login yet</span>
          </div>
          <nav aria-label="Admin navigation">
            <Link href="/meetings" className="text-sm text-slate-300 hover:text-white">
              ← Back to meetings
            </Link>
          </nav>
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6">{children}</main>
    </>
  );
}
