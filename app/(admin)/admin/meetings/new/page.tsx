import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Create Meeting | Sacrament Meeting Planner',
};

// PLACEHOLDER page: the create-meeting form is built in Week 04.
export default function NewMeetingPage() {
  return (
    <div className="card space-y-3">
      <h1 className="text-2xl font-bold text-slate-900">Create Meeting - Coming in Week 04</h1>
      <p className="text-slate-600">
        This page is a placeholder. The form for adding a new sacrament meeting, and the
        POST /api/meetings endpoint it will use, are planned for Week 04.
      </p>
    </div>
  );
}
