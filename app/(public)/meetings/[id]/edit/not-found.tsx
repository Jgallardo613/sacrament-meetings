import Link from 'next/link';

export default function EditMeetingNotFound() {
  return (
    <div className="card mx-auto max-w-xl space-y-3 text-center">
      <h1 className="text-xl font-semibold text-slate-900">Meeting not found</h1>
      <p className="text-sm text-slate-600">
        There is no meeting to edit at this address. It may have been deleted.
      </p>
      <Link href="/meetings" className="btn-primary">
        Back to all meetings
      </Link>
    </div>
  );
}
