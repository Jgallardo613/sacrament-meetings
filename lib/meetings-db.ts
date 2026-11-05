import { SacramentMeeting } from './types';

const meetings: SacramentMeeting[] = [
  {
    id: 1,
    date: '2026-11-02',
    meetingType: 'regular',
    presiding: 'Bishop Thomas Hale',
    conducting: 'First Counselor Mark Jensen',
    announcements: [
      'Ward temple trip scheduled for November 15th.',
      'Primary program rehearsal this Saturday at 10am.',
    ],
    openingHymn: { number: 2, title: 'The Spirit of God' },
    openingPrayer: 'Sarah Williams',
    wardBusiness: [
      { description: 'Sustaining of new Primary president: Sister Rachel Torres' },
    ],
    stakeBusiness: false,
    sacramentHymn: { number: 169, title: 'Again, Our Dear Redeeming Lord' },
    speakers: [
      { name: 'Elder James Park', topic: 'Faith in Jesus Christ', type: 'speaker' },
      { name: 'Ward Choir', topic: 'Come, Come Ye Saints', type: 'musical-number' },
      { name: 'Sister Carla Mendez', topic: 'Strengthening Families', type: 'speaker' },
    ],
    closingHymn: { number: 85, title: 'How Firm a Foundation' },
    closingPrayer: 'David Olsen',
  },
  {
    id: 2,
    date: '2026-10-26',
    meetingType: 'testimony',
    presiding: 'Bishop Thomas Hale',
    conducting: 'Second Counselor Paul Nguyen',
    announcements: [
      'Fast Sunday offerings can be submitted online this month.',
    ],
    openingHymn: { number: 19, title: 'We Thank Thee, O God, for a Prophet' },
    openingPrayer: 'Amy Chen',
    wardBusiness: [],
    stakeBusiness: false,
    sacramentHymn: { number: 173, title: 'While of These Emblems We Partake' },
    speakers: [
      { name: 'Open Testimony Meeting', topic: 'Personal Testimonies', type: 'speaker' },
    ],
    closingHymn: { number: 29, title: 'A Poor Wayfaring Man of Grief' },
    closingPrayer: 'Mike Torres',
  },
  {
    id: 3,
    date: '2026-10-19',
    meetingType: 'regular',
    presiding: 'Bishop Thomas Hale',
    conducting: 'Bishop Thomas Hale',
    announcements: [
      'Service project at the food bank next Saturday, 9am–noon.',
      'Youth temple trip November 1st — permission slips due Friday.',
    ],
    openingHymn: { number: 243, title: 'Let Us All Press On' },
    openingPrayer: 'Rebecca Ford',
    wardBusiness: [
      { description: 'Release of Elders Quorum President: Brother Steven Hall' },
      { description: 'Sustaining of new Elders Quorum President: Brother Jason Kimball' },
    ],
    stakeBusiness: true,
    sacramentHymn: { number: 172, title: 'In Humility, Our Savior' },
    speakers: [
      { name: 'Brother Jason Kimball', topic: 'Covenant Keeping', type: 'speaker' },
      { name: 'Sister Lena Park', topic: 'The Atonement of Jesus Christ', type: 'speaker' },
    ],
    closingHymn: { number: 272, title: 'Oh Say, What Is Truth?' },
    closingPrayer: 'Carlos Rivera',
  },
  {
    id: 4,
    date: '2026-10-12',
    meetingType: 'stake',
    presiding: 'President Alan Brooks',
    conducting: 'President Alan Brooks',
    announcements: [
      'Stake conference next month — save November 22-23.',
    ],
    openingHymn: { number: 262, title: 'Go Forth with Faith' },
    openingPrayer: 'Julia Morris',
    wardBusiness: [],
    stakeBusiness: true,
    sacramentHymn: { number: 170, title: 'God, Our Father, Hear Us Pray' },
    speakers: [
      { name: 'President Alan Brooks', topic: 'Ministering in the Latter Days', type: 'speaker' },
      { name: 'Stake Choir', topic: 'I Stand All Amazed', type: 'musical-number' },
    ],
    closingHymn: { number: 30, title: 'Come, Come, Ye Saints' },
    closingPrayer: 'Nathan Price',
  },
  {
    id: 5,
    date: '2026-10-05',
    meetingType: 'general',
    presiding: 'Bishop Thomas Hale',
    conducting: 'First Counselor Mark Jensen',
    announcements: [],
    openingHymn: { number: 1, title: 'The Morning Breaks' },
    openingPrayer: 'Angela Scott',
    wardBusiness: [],
    stakeBusiness: false,
    sacramentHymn: { number: 174, title: 'Again We Meet Around the Board' },
    speakers: [
      { name: 'General Conference Broadcast', topic: 'General Conference Sunday', type: 'speaker' },
    ],
    closingHymn: { number: 341, title: 'Let Zion in Her Beauty Rise' },
    closingPrayer: 'Daniel White',
  },
];

export function getMeetings(dateFilter?: string): SacramentMeeting[] {
  if (dateFilter) {
    return meetings.filter((m) => m.date === dateFilter);
  }
  return [...meetings].sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getMeetingById(id: number): SacramentMeeting | undefined {
  return meetings.find((m) => m.id === id);
}

export function getCurrentMeeting(): SacramentMeeting | undefined {
  const today = new Date();
  // Find the most recent Sunday on or before today
  const day = today.getDay();
  const diff = day === 0 ? 0 : -day;
  const lastSunday = new Date(today);
  lastSunday.setDate(today.getDate() + diff);
  const sundayStr = lastSunday.toISOString().split('T')[0];

  // Try exact match first, then fall back to most recent
  const exact = meetings.find((m) => m.date === sundayStr);
  if (exact) return exact;

  const sorted = [...meetings].sort((a, b) => (a.date < b.date ? 1 : -1));
  return sorted.find((m) => m.date <= sundayStr) ?? sorted[0];
}
