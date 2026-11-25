import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import EditMeetingForm from '@/components/EditMeetingForm';
import { updateMeeting } from '@/lib/actions';
import { formatMeetingDate, meetingToFormValues } from '@/lib/format';
import { getMeetingById, parseMeetingId } from '@/lib/meetings-db';

export const metadata: Metadata = {
  title: 'Edit Meeting',
};

export default async function EditMeetingPage({ params }: PageProps<'/meetings/[id]/edit'>) {
  const { id: rawId } = await params;
  const id = parseMeetingId(rawId);
  const meeting = id === null ? null : await getMeetingById(id);

  if (!meeting) notFound();

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <Link href={`/meetings/${meeting.id}`} className="text-sm text-blue-600 hover:underline">
          ← Back to meeting
        </Link>
        <h1 className="mt-2 text-2xl font-bold text-slate-900">Edit Meeting</h1>
        <p className="text-sm text-slate-500">{formatMeetingDate(meeting.date)}</p>
      </div>
      {/* Bound here on the server: binding inside the client component made
          React's no-JavaScript form post re-render forever. */}
      <EditMeetingForm
        id={meeting.id}
        action={updateMeeting.bind(null, meeting.id)}
        savedValues={meetingToFormValues(meeting)}
      />
    </div>
  );
}
