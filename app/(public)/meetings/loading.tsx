export default function MeetingsLoading() {
  return (
    <div className="space-y-4" role="status" aria-busy="true" aria-label="Loading meetings">
      <div className="h-8 w-48 animate-pulse rounded-lg bg-slate-200" />
      <div className="grid gap-4 md:grid-cols-2">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="card animate-pulse space-y-3">
            <div className="h-3 w-1/4 rounded bg-slate-200" />
            <div className="h-5 w-1/2 rounded bg-slate-200" />
            <div className="h-3 w-1/3 rounded bg-slate-200" />
          </div>
        ))}
      </div>
    </div>
  );
}
