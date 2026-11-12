import type { MeetingType } from './types';

const MEETING_TYPE_LABELS: Record<MeetingType, string> = {
  regular: 'Sacrament Meeting',
  testimony: 'Fast & Testimony Meeting',
  stake: 'Stake Meeting',
  general: 'General Conference Sunday',
};

export function meetingTypeLabel(type: MeetingType): string {
  return MEETING_TYPE_LABELS[type] ?? 'Sacrament Meeting';
}

/** Format a 'YYYY-MM-DD' date as e.g. "Sunday, November 2, 2026" without time-zone drift. */
export function formatMeetingDate(date: string): string {
  return new Date(`${date}T12:00:00Z`).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  });
}
