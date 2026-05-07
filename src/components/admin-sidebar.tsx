'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const links = [
  { href: '/admin', label: 'Dashboard' },
  { href: '/admin/bookings', label: 'Bookings' },
  { href: '/admin/cleaners', label: 'Cleaners' },
  { href: '/admin/payments', label: 'Payments' },
  { href: '/admin/calendar', label: 'Calendar' },
  { href: '/admin/account', label: 'Settings' },
];

export function AdminSidebar() {
  const pathname = usePathname();
  return (
    <aside className="w-full border-b bg-white md:min-h-[calc(100vh-3.5rem)] md:w-64 md:border-b-0 md:border-r">
      <nav className="flex gap-2 overflow-x-auto p-3 md:flex-col md:overflow-visible md:p-4">
        {links.map((link) => {
          const active =
            pathname === link.href ||
            (link.href !== '/admin' && pathname.startsWith(`${link.href}/`));
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'rounded-md px-3 py-2 text-sm font-medium transition-colors',
                active
                  ? 'bg-purple-100 text-purple-900'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              )}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
