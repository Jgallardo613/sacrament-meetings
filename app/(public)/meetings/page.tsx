import { Suspense } from 'react';
import type { Metadata } from 'next';
import MeetingCard from '@/components/MeetingCard';
import MeetingSearch from '@/components/MeetingSearch';
import Pagination from '@/components/Pagination';
import DeleteMeetingButton from '@/components/DeleteMeetingButton';
import Link from 'next/link';
import { formatMeetingDate, meetingTypeLabel } from '@/lib/format';
import { parsePage, getMeetings } from '@/lib/meetings-db';

export const metadata: Metadata = {
  title: 'All Meetings | Sacrament Meeting Planner',
};

export default async function MeetingsPage({ searchParams }: PageProps<'/meetings'>) {
  const params = await searchParams;
  const query = typeof params.query === 'string' ? params.query : '';
  const { meetings, total, page, totalPages } = await getMeetings({
    query,
    page: parsePage(params.page),
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">All Meetings</h1>
          <p className="text-sm text-slate-500">
            {total} {total === 1 ? 'meeting' : 'meetings'}
            {query && <> matching &ldquo;{query}&rdquo;</>}
          </p>
        </div>
        <div className="w-full sm:max-w-sm">
          {/* useSearchParams in a client component needs a Suspense boundary */}
          <Suspense fallback={<div className="h-9 rounded-lg bg-slate-200" />}>
            <MeetingSearch />
          </Suspense>
        </div>
      </div>

      {meetings.length === 0 ? (
        <p className="card text-center text-slate-500">No meetings found.</p>
      ) : (
        <ul className="grid gap-4 md:grid-cols-2" role="list">
          {meetings.map((m) => (
            <li key={m.id} className="flex flex-col gap-2">
              <MeetingCard meeting={m} />
              <div className="flex justify-end gap-2">
                <Link
                  href={`/meetings/${m.id}/edit`}
                  aria-label={`Edit ${meetingTypeLabel(m.meetingType)} on ${formatMeetingDate(m.date)}`}
                  className="inline-flex items-center rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Edit
                </Link>
                <DeleteMeetingButton
                  id={m.id}
                  label={`${meetingTypeLabel(m.meetingType)} on ${formatMeetingDate(m.date)}`}
                />
              </div>
            </li>
          ))}
        </ul>
      )}

      <Suspense fallback={null}>
        <Pagination currentPage={page} totalPages={totalPages} />
      </Suspense>

      <p className="text-center text-xs text-slate-400">
        Sample data: the seeded meetings and names are fictional.
      </p>
    </div>
  );
}
