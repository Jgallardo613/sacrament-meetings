'use client';

import ErrorFallback from '@/components/ErrorFallback';

export default function AdminError({ reset }: { error: unknown; reset: () => void }) {
  return <ErrorFallback title="Something went wrong" reset={reset} />;
}
