'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Calendar, MapPin } from 'lucide-react';
import { format } from 'date-fns';
import { formatTime24hTo12h } from '@/lib/time-display';

type BookingRow = {
  id: string;
  status: string;
  date: string;
  time: string;
  address: string;
  city: string;
  totalPrice: number;
  assignedCleaner: string | null;
  service: { name: string };
  payment: { status: string } | null;
};

const statusVariant: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  PENDING: 'secondary',
  CONFIRMED: 'default',
  IN_PROGRESS: 'default',
  COMPLETED: 'outline',
  CANCELLED: 'destructive',
};

export default function DashboardPage() {
  const { status, data: session } = useSession();
  const isAdmin = session?.user?.role === 'ADMIN';
  const [bookings, setBookings] = useState<BookingRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status !== 'authenticated') return;
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch('/api/bookings');
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to load');
        if (!cancelled) setBookings(data.bookings || []);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Error');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [status]);

  if (status === 'loading' || loading) {
    return (
      <div className="flex justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
      </div>
    );
  }

  if (error) {
    return (
      <p className="text-center text-destructive">{error}</p>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Your dashboard</h1>
          <p className="text-muted-foreground">
            {isAdmin
              ? 'View your own booking activity. Manage all customers in Admin.'
              : 'View booking status and start a new booking anytime.'}
          </p>
        </div>
        {!isAdmin && (
          <Button asChild className="bg-purple-700 hover:bg-purple-800">
            <Link href="/book">New booking</Link>
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Bookings</CardTitle>
          <CardDescription>
            Payment pending until you complete checkout on the payment step.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {bookings.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              {isAdmin ? (
                <>
                  No personal bookings on this account.{' '}
                  <Link href="/admin" className="text-purple-700 underline">
                    Open admin — all bookings
                  </Link>
                </>
              ) : (
                <>
                  No bookings yet.{' '}
                  <Link href="/book" className="text-purple-700 underline">
                    Book a service
                  </Link>
                </>
              )}
            </p>
          ) : (
            bookings.map((b) => (
              <div
                key={b.id}
                className="flex flex-col gap-2 rounded-lg border bg-card p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-medium">{b.service.name}</span>
                    <Badge variant={statusVariant[b.status] ?? 'secondary'}>
                      {b.status.replace('_', ' ')}
                    </Badge>
                    {b.assignedCleaner && (
                      <Badge variant="outline">Cleaner: {b.assignedCleaner}</Badge>
                    )}
                    {b.payment && (
                      <Badge variant="outline">Payment: {b.payment.status}</Badge>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-x-4 text-sm text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      {format(new Date(b.date), 'PPP')} at {formatTime24hTo12h(b.time)}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" />
                      {b.address}, {b.city}
                    </span>
                  </div>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-2">
                  <span className="font-semibold">${b.totalPrice.toFixed(2)} CAD</span>
                  {b.status === 'PENDING' && !b.payment && (
                    <Button size="sm" asChild variant="secondary">
                      <Link href={`/book/${b.id}/payment`}>Pay now</Link>
                    </Button>
                  )}
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
