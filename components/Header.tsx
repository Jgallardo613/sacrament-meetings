import Link from 'next/link';
import NavLinks from './NavLinks';
import TodayDate from './TodayDate';
import { WARD_NAME } from '@/lib/site';

export default function Header() {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div>
          <Link href="/" className="text-lg font-bold text-slate-900 hover:text-blue-600">
            {WARD_NAME}
          </Link>
          <TodayDate className="text-sm text-slate-500" />
        </div>
        <NavLinks />
      </div>
    </header>
  );
}
