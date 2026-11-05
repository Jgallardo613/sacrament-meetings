import Link from 'next/link';

export default function MeetingsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="space-y-6">
      <nav aria-label="Meetings navigation" className="flex gap-4 text-sm border-b border-gray-200 pb-3 no-print">
        <Link href="/meetings" className="text-blue-800 hover:underline">
          All Meetings
        </Link>
        <Link href="/meetings/current" className="text-blue-800 hover:underline">
          This Week
        </Link>
      </nav>
      {children}
    </div>
  );
}
