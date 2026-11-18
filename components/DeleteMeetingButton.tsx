'use client';

import { useFormStatus } from 'react-dom';
import { deleteMeeting } from '@/lib/actions';

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      aria-label={label}
      className="inline-flex items-center rounded-lg border border-red-200 bg-white px-3 py-1.5 text-sm font-medium text-red-700 transition-colors hover:bg-red-50 disabled:opacity-60"
    >
      {pending ? 'Deleting…' : 'Delete'}
    </button>
  );
}

/** Submits the meeting id to the deleteMeeting server action after a confirm prompt. */
export default function DeleteMeetingButton({ id, label }: { id: number; label: string }) {
  return (
    <form
      action={deleteMeeting}
      onSubmit={(e) => {
        if (!window.confirm(`Delete the ${label}? This cannot be undone.`)) e.preventDefault();
      }}
    >
      <input type="hidden" name="id" value={id} />
      <SubmitButton label={`Delete ${label}`} />
    </form>
  );
}
