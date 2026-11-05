export default function MeetingsLoading() {
  return (
    <div className="space-y-4" aria-busy="true" aria-label="Loading meetings">
      {[1, 2, 3].map((i) => (
        <div key={i} className="card animate-pulse space-y-3">
          <div className="h-3 bg-gray-200 rounded w-1/4" />
          <div className="h-5 bg-gray-200 rounded w-1/2" />
          <div className="h-3 bg-gray-200 rounded w-1/3" />
        </div>
      ))}
    </div>
  );
}
