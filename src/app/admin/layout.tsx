import Link from 'next/link';
import { DashboardNav } from '@/components/dashboard-nav';
import { AdminSidebar } from '@/components/admin-sidebar';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-background">
      <header className="sticky top-0 z-40 border-b bg-white/90 backdrop-blur">
        <div className="container mx-auto flex h-14 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="font-semibold text-slate-800">
              Admin
            </Link>
            <Link
              href="/admin/account"
              className="text-sm text-muted-foreground hover:text-slate-900"
            >
              Account
            </Link>
          </div>
          <DashboardNav showBookService={false} />
        </div>
      </header>
      <div className="flex flex-col md:flex-row">
        <AdminSidebar />
        <main className="flex-1 px-4 py-8 md:px-8">{children}</main>
      </div>
    </div>
  );
}
