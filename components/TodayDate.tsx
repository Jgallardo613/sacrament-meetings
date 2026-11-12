'use client';

import { useSyncExternalStore } from 'react';

const subscribe = () => () => {};

/**
 * Today's date in the visitor's own time zone. Rendered only in the browser:
 * a server-rendered date would be frozen at build time on static pages.
 */
export default function TodayDate({ className }: { className?: string }) {
  const today = useSyncExternalStore(
    subscribe,
    () =>
      new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
    () => null
  );
  return <p className={className}>{today ?? ' '}</p>;
}
