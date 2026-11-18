import Link from 'next/link';

export default function MeetingsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="space-y-6">
      <nav
        aria-label="Meetings navigation"
        className="no-print flex flex-wrap items-center gap-4 border-b border-slate-200 pb-3 text-sm"
      >
        <Link href="/meetings" className="font-medium text-blue-600 hover:underline">
          All Meetings
        </Link>
        <Link href="/meetings/current" className="font-medium text-blue-600 hover:underline">
          This Week
        </Link>
        <Link href="/admin/meetings/new" className="ml-auto text-slate-500 hover:text-slate-700">
          + New meeting
        </Link>
      </nav>
      {children}
    </div>
  );
}
