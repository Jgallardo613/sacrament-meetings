import MeetingCard from '@/components/MeetingCard';
import { getMeetings } from '@/lib/meetings-db';

export default function MeetingsPage() {
  const meetings = getMeetings();

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
