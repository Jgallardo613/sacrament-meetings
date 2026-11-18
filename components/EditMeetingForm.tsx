'use client';

import { useActionState } from 'react';
import type { State } from '@/lib/actions';
import MeetingFormFields from './MeetingFormFields';

const initialState: State = { errors: {}, message: null };

interface EditMeetingFormProps {
  id: number;
  /** updateMeeting.bind(null, id), created by the server page. */
  action: (prevState: State, formData: FormData) => Promise<State>;
  /** The saved meeting as form strings (see meetingToFormValues). */
  savedValues: Record<string, string>;
}

export default function EditMeetingForm({ id, action, savedValues }: EditMeetingFormProps) {
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <form action={formAction} noValidate aria-describedby="form-message" className="card space-y-6 p-6 sm:p-8">
      <MeetingFormFields
        state={state}
        values={state.values ?? savedValues}
        pending={pending}
        submitLabel="Save changes"
        cancelHref={`/meetings/${id}`}
      />
    </form>
  );
}
