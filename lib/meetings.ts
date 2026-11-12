import 'server-only';
import { connection } from 'next/server';
import { getSql } from './db';
import type { MeetingType, SacramentMeeting, SpeakerItem, WardBusinessItem } from './types';

export const MEETINGS_PER_PAGE = 5;

// HARDCODED: the ward's time zone, used to decide which Sunday is "this week".
// Rexburg, Idaho is on Mountain Time. Change this if the ward moves.
const WARD_TIME_ZONE = 'America/Denver';

interface MeetingRow {
  id: number;
  date: string;
  meeting_type: MeetingType;
  presiding: string;
  conducting: string;
  announcements: string[];
  opening_hymn_number: number;
  opening_hymn_title: string;
  opening_prayer: string;
  ward_business: WardBusinessItem[];
  stake_business: boolean;
  sacrament_hymn_number: number;
  sacrament_hymn_title: string;
  speakers: SpeakerItem[];
  closing_hymn_number: number;
  closing_hymn_title: string;
  closing_prayer: string;
}

function toMeeting(row: MeetingRow): SacramentMeeting {
  return {
    id: row.id,
    date: row.date,
    meetingType: row.meeting_type,
    presiding: row.presiding,
    conducting: row.conducting,
    announcements: row.announcements,
    openingHymn: { number: row.opening_hymn_number, title: row.opening_hymn_title },
    openingPrayer: row.opening_prayer,
    wardBusiness: row.ward_business,
    stakeBusiness: row.stake_business,
    sacramentHymn: { number: row.sacrament_hymn_number, title: row.sacrament_hymn_title },
    speakers: row.speakers,
    closingHymn: { number: row.closing_hymn_number, title: row.closing_hymn_title },
    closingPrayer: row.closing_prayer,
  };
}

/** Escape LIKE wildcards so a search for "50%" matches the literal text. */
function likePattern(query: string): string {
  return `%${query.replace(/[\\%_]/g, (c) => `\\${c}`)}%`;
}

/**
 * Parse a route `id` segment. Returns null unless it is a positive whole
 * number written with digits only (rejects "abc", "1.5", "-2", "1e3", "").
 */
export function parseMeetingId(raw: string): number | null {
  if (!/^\d{1,9}$/.test(raw)) return null;
  const id = Number(raw);
  return id > 0 ? id : null;
}

/** Parse a `page` search param into a 1-based page number (defaults to 1). */
export function parsePage(raw: string | string[] | undefined): number {
  const value = Array.isArray(raw) ? raw[0] : raw;
  const page = Number(value);
  return Number.isInteger(page) && page > 0 ? page : 1;
}

export interface MeetingSearchOptions {
  query?: string;
  page?: number;
  /** Exact meeting date filter, 'YYYY-MM-DD'. */
  date?: string;
}

export interface MeetingPage {
  meetings: SacramentMeeting[];
  total: number;
  page: number;
  totalPages: number;
}

// One SELECT used everywhere a full meeting is read: the meeting row, its
// date as a plain 'YYYY-MM-DD' string, and its program from the speakers table.
async function fetchMeetingsByIds(ids: number[]): Promise<SacramentMeeting[]> {
  if (ids.length === 0) return [];
  const sql = getSql();
  const rows = (await sql`
    SELECT m.*, to_char(m.meeting_date, 'YYYY-MM-DD') AS date,
      COALESCE((
        SELECT json_agg(json_build_object('name', s.name, 'topic', s.topic, 'type', s.type)
                        ORDER BY s.position)
        FROM speakers s WHERE s.meeting_id = m.id
      ), '[]'::json) AS speakers
    FROM meetings m
    WHERE m.id = ANY(${ids}::int[])
    ORDER BY m.meeting_date DESC
  `) as MeetingRow[];
  return rows.map(toMeeting);
}

/**
 * Newest-first list of meetings, filtered by a free-text query and paginated
 * MEETINGS_PER_PAGE at a time. The query is matched case-insensitively (ILIKE)
 * against meeting type, presiding/conducting leaders, prayers, hymn titles,
 * and speaker names and topics. An out-of-range page is clamped to the last page.
 */
export async function searchMeetings({
  query = '',
  page = 1,
  date,
}: MeetingSearchOptions = {}): Promise<MeetingPage> {
  await connection(); // always read fresh data at request time, never at build time
  const sql = getSql();
  const q = query.trim();
  const pattern = likePattern(q);
  const dateFilter = date ?? null;

  // Step 1: ids of every matching meeting, newest first. A ward has at most a
  // few hundred meetings, so fetching ids gives the total and the page slice
  // in one round trip.
  const matches = (await sql`
    SELECT m.id
    FROM meetings m
    WHERE (${dateFilter}::date IS NULL OR m.meeting_date = ${dateFilter}::date)
      AND (
        ${q} = ''
        OR m.meeting_type ILIKE ${pattern}
        OR m.presiding ILIKE ${pattern}
        OR m.conducting ILIKE ${pattern}
        OR m.opening_prayer ILIKE ${pattern}
        OR m.closing_prayer ILIKE ${pattern}
        OR m.opening_hymn_title ILIKE ${pattern}
        OR m.sacrament_hymn_title ILIKE ${pattern}
        OR m.closing_hymn_title ILIKE ${pattern}
        OR EXISTS (
          SELECT 1 FROM speakers s
          WHERE s.meeting_id = m.id
            AND (s.name ILIKE ${pattern} OR s.topic ILIKE ${pattern})
        )
      )
    ORDER BY m.meeting_date DESC
  `) as { id: number }[];

  const total = matches.length;
  const totalPages = Math.max(1, Math.ceil(total / MEETINGS_PER_PAGE));
  const currentPage = Math.min(Math.max(1, page), totalPages);
  const start = (currentPage - 1) * MEETINGS_PER_PAGE;
  const pageIds = matches.slice(start, start + MEETINGS_PER_PAGE).map((r) => r.id);

  // Step 2: full rows (with speakers) for just this page.
  const meetings = await fetchMeetingsByIds(pageIds);
  return { meetings, total, page: currentPage, totalPages };
}

export async function getMeetingById(id: number): Promise<SacramentMeeting | null> {
  await connection();
  const [meeting] = await fetchMeetingsByIds([id]);
  return meeting ?? null;
}

/**
 * "This week's" meeting: the most recent meeting on or before today in the
 * ward's time zone. If every meeting is in the future, the soonest upcoming one.
 */
export async function getCurrentMeetingId(): Promise<number | null> {
  await connection();
  const sql = getSql();
  const rows = (await sql`
    WITH today AS (SELECT (NOW() AT TIME ZONE ${WARD_TIME_ZONE})::date AS d)
    SELECT id FROM (
      (SELECT id, 0 AS rank, meeting_date FROM meetings, today
        WHERE meeting_date <= today.d ORDER BY meeting_date DESC LIMIT 1)
      UNION ALL
      (SELECT id, 1 AS rank, meeting_date FROM meetings, today
        WHERE meeting_date > today.d ORDER BY meeting_date ASC LIMIT 1)
    ) candidates
    ORDER BY rank
    LIMIT 1
  `) as { id: number }[];
  return rows[0]?.id ?? null;
}
