import Link from 'next/link';
import { DashboardNav } from '@/components/dashboard-nav';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50/50 to-background">
      <header className="sticky top-0 z-40 border-b bg-white/90 backdrop-blur">
        <div className="container mx-auto flex h-14 items-center justify-between px-4">
          <Link href="/dashboard" className="font-semibold text-purple-800">
            YXE Pristine — My account
          </Link>
          <DashboardNav />
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
