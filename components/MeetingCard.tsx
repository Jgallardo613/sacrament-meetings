import Link from 'next/link';
import type { SacramentMeeting } from '@/lib/types';
import { formatMeetingDate, meetingTypeLabel } from '@/lib/format';

export const meetingTypeColors: Record<string, string> = {
  testimony: 'bg-purple-100 text-purple-800',
  regular: 'bg-blue-100 text-blue-800',
  stake: 'bg-green-100 text-green-800',
  general: 'bg-amber-100 text-amber-800',
};

export default function MeetingCard({ meeting }: { meeting: SacramentMeeting }) {
  const date = formatMeetingDate(meeting.date);
  const title = meetingTypeLabel(meeting.meetingType);
  const speakerNames = meeting.speakers
    .filter((s) => s.type === 'speaker')
    .map((s) => s.name)
    .join(', ');

  return (
    <Link
      href={`/meetings/${meeting.id}`}
      className="card block h-full transition-all hover:border-blue-300 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <p className="text-sm text-slate-500">{date}</p>
          <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
          <p className="text-sm text-slate-600">Conducting: {meeting.conducting}</p>
        </div>
        <span className={`badge ${meetingTypeColors[meeting.meetingType] ?? 'bg-slate-100 text-slate-700'}`}>
          {meeting.meetingType}
        </span>
      </div>
      {speakerNames && (
        <p className="mt-3 truncate text-sm text-slate-500">Speakers: {speakerNames}</p>
      )}
    </Link>
  );
}
