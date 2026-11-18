import Link from 'next/link';
import type { MeetingFormField, State } from '@/lib/actions';

type Values = Partial<Record<MeetingFormField, string>>;

const inputClass =
  'mt-1 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20 aria-[invalid=true]:border-red-500';

/** Error region for one field. Always rendered so screen readers hear new errors. */
function FieldError({ id, errors }: { id: string; errors?: string[] }) {
  return (
    <div id={`${id}-error`} aria-live="polite" aria-atomic="true" className="mt-1 min-h-0 text-sm text-red-600">
      {errors?.map((e) => (
        <p key={e}>{e}</p>
      ))}
    </div>
  );
}

interface FieldProps {
  name: MeetingFormField;
  label: string;
  state: State;
  values: Values;
  type?: string;
  hint?: string;
  className?: string;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
}

function TextField({ name, label, state, values, type = 'text', hint, className, inputProps }: FieldProps) {
  const errors = state.errors?.[name];
  return (
    <div className={className}>
      <label htmlFor={name} className="block text-sm font-medium text-slate-700">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        defaultValue={values[name] ?? ''}
        aria-describedby={`${name}-error`}
        aria-invalid={errors ? true : undefined}
        className={inputClass}
        {...inputProps}
      />
      {hint && <p className="mt-1 text-xs text-slate-500">{hint}</p>}
      <FieldError id={name} errors={errors} />
    </div>
  );
}

function TextAreaField({ name, label, state, values, hint, rows = 3 }: FieldProps & { rows?: number }) {
  const errors = state.errors?.[name];
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-slate-700">
        {label}
      </label>
      <textarea
        id={name}
        name={name}
        rows={rows}
        defaultValue={values[name] ?? ''}
        aria-describedby={`${name}-error`}
        aria-invalid={errors ? true : undefined}
        className={inputClass}
      />
      {hint && <p className="mt-1 text-xs text-slate-500">{hint}</p>}
      <FieldError id={name} errors={errors} />
    </div>
  );
}

function HymnFields({ prefix, label, state, values }: { prefix: 'opening' | 'sacrament' | 'closing'; label: string; state: State; values: Values }) {
  return (
    <div className="grid grid-cols-[7rem_1fr] gap-3">
      <TextField
        name={`${prefix}HymnNumber`}
        label={`${label} #`}
        type="number"
        state={state}
        values={values}
        inputProps={{ min: 1, max: 9999, inputMode: 'numeric' }}
      />
      <TextField name={`${prefix}HymnTitle`} label={`${label} title`} state={state} values={values} />
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset className="space-y-4">
      <legend className="mb-2 text-base font-semibold text-slate-900">{title}</legend>
      {children}
    </fieldset>
  );
}

interface MeetingFormFieldsProps {
  state: State;
  /** Values to show: what the user just submitted, else the saved meeting. */
  values: Values;
  pending: boolean;
  submitLabel: string;
  cancelHref: string;
}

/** Every field of the meeting form, shared by the create and edit forms. */
export default function MeetingFormFields({ state, values, pending, submitLabel, cancelHref }: MeetingFormFieldsProps) {
  const typeErrors = state.errors?.meetingType;
  const stakeErrors = state.errors?.stakeBusiness;

  return (
    <div className="space-y-8">
      <Section title="Meeting">
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField name="date" label="Date (Sunday)" type="date" state={state} values={values} />
          <div>
            <label htmlFor="meetingType" className="block text-sm font-medium text-slate-700">
              Meeting type
            </label>
            <select
              id="meetingType"
              name="meetingType"
              defaultValue={values.meetingType ?? 'regular'}
              aria-describedby="meetingType-error"
              aria-invalid={typeErrors ? true : undefined}
              className={inputClass}
            >
              <option value="regular">Sacrament Meeting</option>
              <option value="testimony">Fast &amp; Testimony Meeting</option>
              <option value="stake">Stake Meeting</option>
              <option value="general">General Conference Sunday</option>
            </select>
            <FieldError id="meetingType" errors={typeErrors} />
          </div>
          <TextField name="presiding" label="Presiding" state={state} values={values} />
          <TextField name="conducting" label="Conducting" state={state} values={values} />
        </div>
        <TextAreaField
          name="announcements"
          label="Announcements (optional)"
          hint="One announcement per line."
          state={state}
          values={values}
        />
      </Section>

      <Section title="Opening">
        <HymnFields prefix="opening" label="Opening hymn" state={state} values={values} />
        <TextField name="openingPrayer" label="Opening prayer" state={state} values={values} />
      </Section>

      <Section title="Business">
        <TextAreaField
          name="wardBusiness"
          label="Ward business (optional)"
          hint="One item per line, e.g. a release or sustaining."
          state={state}
          values={values}
        />
        <div>
          <div className="flex items-center gap-2">
            <input
              id="stakeBusiness"
              name="stakeBusiness"
              type="checkbox"
              defaultChecked={values.stakeBusiness === 'on'}
              aria-describedby="stakeBusiness-error"
              className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-600"
            />
            <label htmlFor="stakeBusiness" className="text-sm font-medium text-slate-700">
              Stake business this week
            </label>
          </div>
          <FieldError id="stakeBusiness" errors={stakeErrors} />
        </div>
      </Section>

      <Section title="Sacrament">
        <HymnFields prefix="sacrament" label="Sacrament hymn" state={state} values={values} />
      </Section>

      <Section title="Program">
        <TextAreaField
          name="speakers"
          label="Speakers and musical numbers"
          hint='One per line, in order: "Name | Topic". For a musical number: "Ward Choir | Song title | music".'
          rows={5}
          state={state}
          values={values}
        />
      </Section>

      <Section title="Closing">
        <HymnFields prefix="closing" label="Closing hymn" state={state} values={values} />
        <TextField name="closingPrayer" label="Closing prayer" state={state} values={values} />
      </Section>

      <div id="form-message" aria-live="polite" className="text-sm font-medium text-red-600">
        {state.message && <p>{state.message}</p>}
      </div>

      <div className="flex justify-end gap-3">
        <Link href={cancelHref} className="btn-secondary">
          Cancel
        </Link>
        <button type="submit" className="btn-primary disabled:opacity-60" disabled={pending} aria-disabled={pending}>
          {pending ? 'Saving…' : submitLabel}
        </button>
      </div>
    </div>
  );
}
