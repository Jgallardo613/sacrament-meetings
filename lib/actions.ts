'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import {
  createMeetingRecord,
  deleteMeetingRecord,
  parseMeetingId,
  updateMeetingRecord,
} from './meetings-db';
import type { MeetingInput, SpeakerItem } from './types';

// PLACEHOLDER SECURITY: there is no login yet, so anyone who can reach the
// site can create, edit, or delete meetings. Add an auth check at the top of
// each action once authentication exists.

const requiredText = (label: string) =>
  z.string().trim().min(1, `${label} is required.`).max(200, `${label} must be 200 characters or fewer.`);

const hymnNumber = (label: string) =>
  z
    .string()
    .trim()
    .min(1, `${label} number is required.`)
    .transform(Number)
    .pipe(
      z
        .number({ error: `${label} number must be a number.` })
        .int(`${label} number must be a whole number.`)
        .min(1, `${label} number must be at least 1.`)
        .max(9999, `${label} number must be 9999 or less.`)
    );

/** Split a textarea into trimmed, non-empty lines. */
const lines = (value: string) =>
  value
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

const MeetingFormSchema = z.object({
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Choose a meeting date.')
    .refine((d) => !Number.isNaN(Date.parse(`${d}T12:00:00Z`)), 'Choose a valid date.')
    .refine((d) => new Date(`${d}T12:00:00Z`).getUTCDay() === 0, 'Sacrament meetings are on Sunday. Choose a Sunday.'),
  meetingType: z.enum(['regular', 'testimony', 'stake', 'general'], { error: 'Choose a meeting type.' }),
  presiding: requiredText('Presiding'),
  conducting: requiredText('Conducting'),
  openingHymnNumber: hymnNumber('Opening hymn'),
  openingHymnTitle: requiredText('Opening hymn title'),
  openingPrayer: requiredText('Opening prayer'),
  sacramentHymnNumber: hymnNumber('Sacrament hymn'),
  sacramentHymnTitle: requiredText('Sacrament hymn title'),
  closingHymnNumber: hymnNumber('Closing hymn'),
  closingHymnTitle: requiredText('Closing hymn title'),
  closingPrayer: requiredText('Closing prayer'),
  announcements: z.string().transform(lines),
  wardBusiness: z.string().transform((v) => lines(v).map((description) => ({ description }))),
  stakeBusiness: z.boolean(),
  // One program item per line: "Name | Topic", or "Name | Song | music" for a musical number.
  speakers: z.string().transform((value, ctx): SpeakerItem[] => {
    const items: SpeakerItem[] = [];
    lines(value).forEach((line, i) => {
      const [name, topic, kind] = line.split('|').map((p) => p.trim());
      if (!name || !topic) {
        ctx.addIssue({
          code: 'custom',
          message: `Line ${i + 1}: use "Name | Topic" (add "| music" for a musical number).`,
        });
        return;
      }
      items.push({ name, topic, type: kind?.toLowerCase() === 'music' ? 'musical-number' : 'speaker' });
    });
    if (items.length === 0 && ctx.issues.length === 0) {
      ctx.addIssue({ code: 'custom', message: 'Add at least one speaker or program item.' });
    }
    return items;
  }),
});

export type MeetingFormField = keyof z.input<typeof MeetingFormSchema>;

export type State = {
  errors?: Partial<Record<MeetingFormField, string[]>>;
  message?: string | null;
  /** What the user typed, sent back so the form keeps it after a failed submit. */
  values?: Partial<Record<MeetingFormField, string>>;
};

function readForm(formData: FormData) {
  const text = (name: MeetingFormField) => {
    const v = formData.get(name);
    return typeof v === 'string' ? v : '';
  };
  return {
    date: text('date'),
    meetingType: text('meetingType'),
    presiding: text('presiding'),
    conducting: text('conducting'),
    openingHymnNumber: text('openingHymnNumber'),
    openingHymnTitle: text('openingHymnTitle'),
    openingPrayer: text('openingPrayer'),
    sacramentHymnNumber: text('sacramentHymnNumber'),
    sacramentHymnTitle: text('sacramentHymnTitle'),
    closingHymnNumber: text('closingHymnNumber'),
    closingHymnTitle: text('closingHymnTitle'),
    closingPrayer: text('closingPrayer'),
    announcements: text('announcements'),
    wardBusiness: text('wardBusiness'),
    stakeBusiness: formData.get('stakeBusiness') === 'on',
    speakers: text('speakers'),
  };
}

type ParseResult = { ok: true; input: MeetingInput } | { ok: false; state: State };

function parseForm(formData: FormData): ParseResult {
  const raw = readForm(formData);
  const values = parseValues(formData);
  const parsed = MeetingFormSchema.safeParse(raw);

  if (!parsed.success) {
    return {
      ok: false,
      state: {
        errors: z.flattenError(parsed.error).fieldErrors,
        message: 'Some fields need attention. Fix the errors below and try again.',
        values,
      },
    };
  }

  const d = parsed.data;
  return {
    ok: true,
    input: {
      date: d.date,
      meetingType: d.meetingType,
      presiding: d.presiding,
      conducting: d.conducting,
      announcements: d.announcements,
      openingHymn: { number: d.openingHymnNumber, title: d.openingHymnTitle },
      openingPrayer: d.openingPrayer,
      wardBusiness: d.wardBusiness,
      stakeBusiness: d.stakeBusiness,
      sacramentHymn: { number: d.sacramentHymnNumber, title: d.sacramentHymnTitle },
      speakers: d.speakers,
      closingHymn: { number: d.closingHymnNumber, title: d.closingHymnTitle },
      closingPrayer: d.closingPrayer,
    },
  };
}

/** Postgres unique_violation: meeting_date is UNIQUE (one meeting per Sunday). */
function isDuplicateDate(error: unknown): boolean {
  return typeof error === 'object' && error !== null && 'code' in error && error.code === '23505';
}

function dbFailure(error: unknown, action: string, values: State['values']): State {
  if (isDuplicateDate(error)) {
    return {
      errors: { date: ['A meeting is already scheduled for this date.'] },
      message: 'Some fields need attention. Fix the errors below and try again.',
      values,
    };
  }
  console.error(error);
  return { message: `Database error: failed to ${action} the meeting. Please try again.`, values };
}

export async function createMeeting(prevState: State, formData: FormData): Promise<State> {
  const result = parseForm(formData);
  if (!result.ok) return result.state;

  let id: number;
  try {
    id = await createMeetingRecord(result.input);
  } catch (error) {
    return dbFailure(error, 'create', parseValues(formData));
  }

  // redirect() works by throwing, so it stays outside the try/catch.
  revalidatePath('/meetings');
  redirect(`/meetings/${id}`);
}

export async function updateMeeting(id: number, prevState: State, formData: FormData): Promise<State> {
  const result = parseForm(formData);
  if (!result.ok) return result.state;

  try {
    const found = await updateMeetingRecord(id, result.input);
    if (!found) {
      return { message: 'This meeting no longer exists. It may have been deleted.', values: parseValues(formData) };
    }
  } catch (error) {
    return dbFailure(error, 'update', parseValues(formData));
  }

  revalidatePath('/meetings');
  revalidatePath(`/meetings/${id}`);
  redirect(`/meetings/${id}`);
}

export async function deleteMeeting(formData: FormData): Promise<void> {
  const rawId = formData.get('id');
  const id = typeof rawId === 'string' ? parseMeetingId(rawId) : null;
  if (id === null) throw new Error('Invalid meeting id.');

  try {
    await deleteMeetingRecord(id);
  } catch (error) {
    console.error(error);
    // Caught by the nearest error.tsx, which offers "Try again".
    throw new Error('Database error: failed to delete the meeting.');
  }

  revalidatePath('/meetings');
  redirect('/meetings');
}

function parseValues(formData: FormData): State['values'] {
  const raw = readForm(formData);
  return { ...raw, stakeBusiness: raw.stakeBusiness ? 'on' : '' };
}
