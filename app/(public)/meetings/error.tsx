'use client';

import ErrorFallback from '@/components/ErrorFallback';

export default function MeetingsError({ reset }: { error: unknown; reset: () => void }) {
  return <ErrorFallback title="Meetings could not be loaded" reset={reset} />;
}
