'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';

/**
 * Search box whose only state is the URL (?query=...). There is no useState:
 * the input is uncontrolled and seeded from the URL via defaultValue.
 * Typing updates the URL 300ms after the last keystroke and always resets
 * pagination to page 1, since the old page number may not exist in the new
 * results.
 */
export default function MeetingSearch() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', '1');
    const trimmed = term.trim();
    if (trimmed) {
      params.set('query', trimmed);
    } else {
      params.delete('query');
    }
    replace(`${pathname}?${params.toString()}`);
  }, 300);

  return (
    <div className="relative">
      <label htmlFor="meeting-search" className="sr-only">
        Search meetings
      </label>
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM2 9a7 7 0 1 1 12.45 4.39l3.08 3.08a.75.75 0 1 1-1.06 1.06l-3.08-3.08A7 7 0 0 1 2 9Z"
          clipRule="evenodd"
        />
      </svg>
      <input
        id="meeting-search"
        type="search"
        aria-label="Search meetings by speaker, leader, hymn, or meeting type"
        placeholder="Search by speaker, leader, hymn, or meeting type…"
        defaultValue={searchParams.get('query') ?? ''}
        onChange={(e) => handleSearch(e.target.value)}
        className="w-full rounded-lg border border-slate-300 bg-white py-2 pl-9 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
      />
    </div>
  );
}
