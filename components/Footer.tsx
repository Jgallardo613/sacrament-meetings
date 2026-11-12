import { WARD_NAME } from '@/lib/site';

export default function Footer() {
  return (
    <footer className="no-print mt-auto border-t border-slate-200 bg-white py-4 text-center text-sm text-slate-500">
      <p>Sacrament Meeting Planner · {WARD_NAME}</p>
    </footer>
  );
}
