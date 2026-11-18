'use client';

import { useActionState } from 'react';
import { createMeeting, type State } from '@/lib/actions';
import MeetingFormFields from './MeetingFormFields';

const initialState: State = { errors: {}, message: null };

export default function CreateMeetingForm() {
  const [state, formAction, pending] = useActionState(createMeeting, initialState);

  return (
    <form action={formAction} noValidate aria-describedby="form-message" className="card space-y-6 p-6 sm:p-8">
      <MeetingFormFields
        state={state}
        values={state.values ?? {}}
        pending={pending}
        submitLabel="Create meeting"
        cancelHref="/meetings"
      />
    </form>
  );
}
