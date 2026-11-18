import { redirect } from 'next/navigation';
import { getCurrentMeetingId } from '@/lib/meetings-db';

// Resolved on every request (getCurrentMeetingId awaits connection()), so
// "This Week" moves forward each Sunday instead of being frozen at build time.
export default async function CurrentMeetingPage() {
  const id = await getCurrentMeetingId();
  redirect(id === null ? '/meetings' : `/meetings/${id}`);
}
