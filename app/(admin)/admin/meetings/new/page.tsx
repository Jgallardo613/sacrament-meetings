import type { Metadata } from 'next';
import CreateMeetingForm from '@/components/CreateMeetingForm';

export const metadata: Metadata = {
  title: 'Create Meeting | Sacrament Meeting Planner',
};

export default function NewMeetingPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Create Meeting</h1>
        <p className="text-sm text-slate-500">Plan a new sacrament meeting program.</p>
      </div>
      <CreateMeetingForm />
    </div>
  );
}
