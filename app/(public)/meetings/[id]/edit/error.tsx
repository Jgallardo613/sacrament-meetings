'use client';

import ErrorFallback from '@/components/ErrorFallback';

export default function EditMeetingError({ reset }: { error: unknown; reset: () => void }) {
  return <ErrorFallback title="This meeting could not be edited" reset={reset} />;
}
