'use client';

import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';

type DashboardNavProps = {
  /** When false, hides customer "Book service" (e.g. on admin area). */
  showBookService?: boolean;
};

export function DashboardNav({ showBookService = true }: DashboardNavProps) {
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === 'ADMIN';
  const canShowBook = showBookService && !isAdmin;

  return (
    <nav className="flex items-center gap-2 sm:gap-4">
      {canShowBook && (
        <Link
          href="/book"
          className="text-sm font-medium text-purple-700 hover:underline"
        >
          Book service
        </Link>
      )}
      {session?.user?.role === 'ADMIN' && (
        <Link
          href="/admin"
          className="text-sm font-medium text-purple-700 hover:underline"
        >
          Admin
        </Link>
      )}
      <Link href="/" className="text-sm text-muted-foreground hover:underline">
        Home
      </Link>
      <Button
        variant="outline"
        size="sm"
        onClick={() => signOut({ callbackUrl: '/' })}
      >
        Sign out
      </Button>
    </nav>
  );
}
