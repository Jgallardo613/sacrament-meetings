import { notFound } from 'next/navigation';
import MeetingDetail from '@/components/MeetingDetail';
import { getMeetingById, parseMeetingId } from '@/lib/meetings-db';

export default async function MeetingDetailPage({ params }: PageProps<'/meetings/[id]'>) {
  const { id: rawId } = await params;
  const id = parseMeetingId(rawId);
  const meeting = id === null ? null : await getMeetingById(id);

  if (!meeting) notFound();

  return <MeetingDetail meeting={meeting} />;
}
