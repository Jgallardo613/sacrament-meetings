import MeetingCard from '@/components/MeetingCard';
import { SacramentMeeting } from '@/lib/types';

async function fetchMeetings(): Promise<SacramentMeeting[]> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000';
  const res = await fetch(`${baseUrl}/api/meetings`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch meetings');
  return res.json() as Promise<SacramentMeeting[]>;
}

export default async function MeetingsPage() {
  const meetings = await fetchMeetings();

  return (
    <div className="space-y-5">
      <h1 className="font-serif text-2xl font-bold text-blue-900">All Meetings</h1>
      {meetings.length === 0 ? (
        <p className="text-gray-500">No meetings found.</p>
      ) : (
        <ul className="space-y-4" role="list">
          {meetings.map((m) => (
            <li key={m.id}>
              <MeetingCard meeting={m} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
