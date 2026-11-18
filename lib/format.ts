import type { MeetingType, SacramentMeeting } from './types';

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

/** Form field values (all strings) for a meeting, used to prefill the edit form. */
export function meetingToFormValues(m: SacramentMeeting): Record<string, string> {
  return {
    date: m.date,
    meetingType: m.meetingType,
    presiding: m.presiding,
    conducting: m.conducting,
    openingHymnNumber: String(m.openingHymn.number),
    openingHymnTitle: m.openingHymn.title,
    openingPrayer: m.openingPrayer,
    sacramentHymnNumber: String(m.sacramentHymn.number),
    sacramentHymnTitle: m.sacramentHymn.title,
    closingHymnNumber: String(m.closingHymn.number),
    closingHymnTitle: m.closingHymn.title,
    closingPrayer: m.closingPrayer,
    announcements: (m.announcements ?? []).join('\n'),
    wardBusiness: m.wardBusiness.map((w) => w.description).join('\n'),
    stakeBusiness: m.stakeBusiness ? 'on' : '',
    speakers: m.speakers
      .map((s) => `${s.name} | ${s.topic}${s.type === 'musical-number' ? ' | music' : ''}`)
      .join('\n'),
  };
}
