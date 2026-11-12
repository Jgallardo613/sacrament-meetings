'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
}

/** Page links that keep every other URL param (like ?query=) intact. */
export default function Pagination({ currentPage, totalPages }: PaginationProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (totalPages <= 1) return null;

  const hrefFor = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', String(page));
    return `${pathname}?${params.toString()}`;
  };

  const base = 'inline-flex h-9 min-w-9 items-center justify-center rounded-lg px-3 text-sm font-medium';
  const idle = `${base} border border-slate-300 bg-white text-slate-700 hover:bg-slate-50`;
  const disabled = `${base} border border-slate-200 bg-slate-100 text-slate-400 cursor-not-allowed`;

  return (
    <nav aria-label="Meetings pagination" className="flex items-center justify-center gap-2">
      {currentPage > 1 ? (
        <Link href={hrefFor(currentPage - 1)} className={idle} aria-label="Previous page">
          ← Prev
        </Link>
      ) : (
        <span className={disabled} aria-disabled="true">← Prev</span>
      )}

      <ul className="flex gap-1">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <li key={page}>
            <Link
              href={hrefFor(page)}
              aria-label={`Page ${page}`}
              aria-current={page === currentPage ? 'page' : undefined}
              className={
                page === currentPage
                  ? `${base} bg-blue-600 text-white`
                  : idle
              }
            >
              {page}
            </Link>
          </li>
        ))}
      </ul>

      {currentPage < totalPages ? (
        <Link href={hrefFor(currentPage + 1)} className={idle} aria-label="Next page">
          Next →
        </Link>
      ) : (
        <span className={disabled} aria-disabled="true">Next →</span>
      )}
    </nav>
  );
}
