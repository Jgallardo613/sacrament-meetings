import Link from 'next/link';
import { SacramentMeeting } from '@/lib/types';

const meetingTypeColors: Record<string, string> = {
  testimony: 'bg-purple-100 text-purple-800',
  regular: 'bg-blue-100 text-blue-800',
  stake: 'bg-green-100 text-green-800',
  general: 'bg-amber-100 text-amber-800',
};

interface MeetingCardProps {
  meeting: SacramentMeeting;
}

export default function MeetingCard({ meeting }: MeetingCardProps) {
  const formatted = new Date(meeting.date + 'T12:00:00').toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <Link
      href={`/meetings/${meeting.id}`}
      className="card block hover:shadow-md hover:border-blue-300 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      aria-label={`View meeting for ${formatted}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <p className="text-sm text-gray-500">{formatted}</p>
          <h2 className="font-semibold text-blue-900 text-lg capitalize">
            {meeting.meetingType === 'testimony'
              ? 'Fast & Testimony Meeting'
              : meeting.meetingType === 'stake'
              ? 'Stake Meeting'
              : meeting.meetingType === 'general'
              ? 'General Conference Sunday'
              : 'Sacrament Meeting'}
          </h2>
          <p className="text-sm text-gray-600">Presiding: {meeting.presiding}</p>
        </div>
        <span className={`badge ${meetingTypeColors[meeting.meetingType] ?? 'bg-gray-100 text-gray-700'}`}>
          {meeting.meetingType}
        </span>
      </div>
      {meeting.announcements && meeting.announcements.length > 0 && (
        <p className="mt-3 text-sm text-gray-500 truncate">
          {meeting.announcements[0]}
        </p>
      )}
    </Link>
  );
}
