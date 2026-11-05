import { SacramentMeeting } from '@/lib/types';
import PrintButton from './PrintButton';

interface MeetingDetailProps {
  meeting: SacramentMeeting;
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-2">
      <h2 className="font-serif text-lg font-semibold text-blue-900 border-b border-gray-200 pb-1">
        {title}
      </h2>
      {children}
    </section>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-2 text-sm">
      <span className="font-medium text-gray-600 w-36 shrink-0">{label}</span>
      <span className="text-gray-900">{value}</span>
    </div>
  );
}

export default function MeetingDetail({ meeting }: MeetingDetailProps) {
  const formatted = new Date(meeting.date + 'T12:00:00').toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <article className="space-y-6">
      {/* Header */}
      <header className="text-center space-y-1">
        <h1 className="font-serif text-3xl font-bold text-blue-900">
          {meeting.meetingType === 'testimony'
            ? 'Fast & Testimony Meeting'
            : meeting.meetingType === 'stake'
            ? 'Stake Meeting'
            : meeting.meetingType === 'general'
            ? 'General Conference Sunday'
            : 'Sacrament Meeting'}
        </h1>
        <p className="text-gray-500">{formatted}</p>
        <div className="flex justify-center gap-6 text-sm text-gray-600 pt-1">
          <span>Presiding: <strong>{meeting.presiding}</strong></span>
          <span>Conducting: <strong>{meeting.conducting}</strong></span>
        </div>
      </header>

      {/* Announcements */}
      {meeting.announcements && meeting.announcements.length > 0 && (
        <Section title="Announcements">
          <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
            {meeting.announcements.map((a, i) => (
              <li key={i}>{a}</li>
            ))}
          </ul>
        </Section>
      )}

      {/* Opening */}
      <Section title="Opening">
        <Row label="Opening Hymn" value={`#${meeting.openingHymn.number} — ${meeting.openingHymn.title}`} />
        <Row label="Opening Prayer" value={meeting.openingPrayer} />
      </Section>

      {/* Ward Business */}
      {(meeting.wardBusiness.length > 0 || meeting.stakeBusiness) && (
        <Section title="Ward Business">
          {meeting.stakeBusiness && (
            <Row label="Stake Business" value="Yes — stake matters to be discussed" />
          )}
          {meeting.wardBusiness.map((item, i) => (
            <Row key={i} label={i === 0 ? 'Items' : ''} value={item.description} />
          ))}
        </Section>
      )}

      {/* Sacrament */}
      <Section title="Sacrament">
        <Row label="Sacrament Hymn" value={`#${meeting.sacramentHymn.number} — ${meeting.sacramentHymn.title}`} />
      </Section>

      {/* Program */}
      <Section title="Program">
        <div className="space-y-3">
          {meeting.speakers.map((item, i) => (
            <div key={i} className="card py-3 px-4 flex items-start gap-3">
              <span
                className={`badge mt-0.5 ${
                  item.type === 'musical-number'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-blue-100 text-blue-800'
                }`}
              >
                {item.type === 'musical-number' ? 'Music' : 'Speaker'}
              </span>
              <div>
                <p className="font-medium text-gray-900">{item.name}</p>
                <p className="text-sm text-gray-500">{item.topic}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Closing */}
      <Section title="Closing">
        <Row label="Closing Hymn" value={`#${meeting.closingHymn.number} — ${meeting.closingHymn.title}`} />
        <Row label="Closing Prayer" value={meeting.closingPrayer} />
      </Section>

      {/* Print button */}
      <div className="text-right no-print">
        <PrintButton />
      </div>
    </article>
  );
}
