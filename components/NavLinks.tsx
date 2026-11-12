'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  { href: '/', label: 'Home' },
  { href: '/meetings', label: 'Meetings' },
  { href: '/meetings/current', label: 'This Week' },
];

function isActive(pathname: string, href: string): boolean {
  if (href === '/') return pathname === '/';
  // /meetings stays highlighted on detail pages like /meetings/7
  if (href === '/meetings') return pathname === '/meetings' || /^\/meetings\/\d+$/.test(pathname);
  return pathname === href;
}

export default function NavLinks() {
  const pathname = usePathname();

  return (
    <nav aria-label="Main navigation">
      <ul className="flex gap-1 text-sm font-medium">
        {links.map(({ href, label }) => {
          const active = isActive(pathname, href);
          return (
            <li key={href}>
              <Link
                href={href}
                className={`rounded-lg px-3 py-2 transition-colors ${
                  active ? 'bg-blue-50 text-blue-600' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
                aria-current={active ? 'page' : undefined}
              >
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
