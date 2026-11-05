import { notFound } from 'next/navigation';
import MeetingDetail from '@/components/MeetingDetail';
import { SacramentMeeting } from '@/lib/types';

interface PageProps {
  params: Promise<{ id: string }>;
}

async function fetchMeeting(id: string): Promise<SacramentMeeting | null> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000';
  const res = await fetch(`${baseUrl}/api/meetings/${id}`, { cache: 'no-store' });
  if (res.status === 404 || res.status === 400) return null;
  if (!res.ok) throw new Error('Failed to fetch meeting');
  return res.json() as Promise<SacramentMeeting>;
}

export default async function MeetingDetailPage({ params }: PageProps) {
  const { id } = await params;
  const meeting = await fetchMeeting(id);

  if (!meeting) notFound();

  return <MeetingDetail meeting={meeting} />;
}
