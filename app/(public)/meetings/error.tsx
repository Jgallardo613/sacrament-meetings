'use client';

// retry() re-fetches the segment, so a brief database hiccup can recover.
export default function MeetingsError({ retry }: { error: unknown; retry: () => void }) {
  return (
    <div className="card space-y-3 text-center" role="alert">
      <h1 className="text-xl font-semibold text-slate-900">Meetings could not be loaded</h1>
      <p className="text-sm text-slate-600">
        The database may be unreachable or not configured yet. Please try again in a moment.
      </p>
      <button type="button" onClick={() => retry()} className="btn-primary">
        Try again
      </button>
    </div>
  );
}
