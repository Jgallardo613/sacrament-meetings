import type { SacramentMeeting } from '@/lib/types';
import { formatMeetingDate, meetingTypeLabel } from '@/lib/format';
import PrintButton from './PrintButton';

interface MeetingDetailProps {
  meeting: SacramentMeeting;
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-2">
      <h2 className="text-lg font-semibold text-slate-900 border-b border-slate-200 pb-1">
        {title}
      </h2>
      {children}
    </section>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-2 text-sm">
      <span className="font-medium text-slate-600 w-36 shrink-0">{label}</span>
      <span className="text-slate-900">{value}</span>
    </div>
  );
}

export default function MeetingDetail({ meeting }: MeetingDetailProps) {
  const formatted = formatMeetingDate(meeting.date);

  return (
    <article className="card mx-auto max-w-3xl space-y-6 p-6 sm:p-8">
      {/* Header */}
      <header className="text-center space-y-1">
        <h1 className="text-3xl font-bold text-slate-900">
          {meetingTypeLabel(meeting.meetingType)}
        </h1>
        <p className="text-slate-500">{formatted}</p>
        <div className="flex justify-center gap-6 text-sm text-slate-600 pt-1">
          <span>Presiding: <strong>{meeting.presiding}</strong></span>
          <span>Conducting: <strong>{meeting.conducting}</strong></span>
        </div>
      </header>

      {/* Announcements */}
      {meeting.announcements && meeting.announcements.length > 0 && (
        <Section title="Announcements">
          <ul className="list-disc list-inside space-y-1 text-sm text-slate-700">
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
            <div key={i} className="flex items-start gap-3 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
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
                <p className="font-medium text-slate-900">{item.name}</p>
                <p className="text-sm text-slate-500">{item.topic}</p>
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
