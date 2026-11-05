import { notFound } from 'next/navigation';
import MeetingDetail from '@/components/MeetingDetail';
import { getMeetingById } from '@/lib/meetings-db';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function MeetingDetailPage({ params }: PageProps) {
  const { id } = await params;
  const numericId = Number(id);
  const meeting = Number.isInteger(numericId) ? getMeetingById(numericId) : undefined;

  if (!meeting) notFound();

  return <MeetingDetail meeting={meeting} />;
}
