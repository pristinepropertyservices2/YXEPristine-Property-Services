'use client';

import { useEffect, useMemo, useState } from 'react';
import { format } from 'date-fns';
import { formatTime24hTo12h } from '@/lib/time-display';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

type Booking = {
  id: string;
  customerName: string | null;
  bookingDate: string | null;
  bookingTime: string | null;
  status: string;
  assignedCleanerRef: { name: string } | null;
};

export default function AdminCalendarPage() {
  const [view, setView] = useState<'day' | 'week' | 'month'>('week');
  const [rows, setRows] = useState<Booking[]>([]);

  useEffect(() => {
    (async () => {
      const res = await fetch('/api/admin/bookings?page=1&pageSize=300&sort=bookingDate&dir=asc');
      const data = await res.json();
      if (res.ok) setRows(data.bookings || []);
    })();
  }, []);

  const grouped = useMemo(() => {
    const map: Record<string, Booking[]> = {};
    rows.forEach((r) => {
      const dt = r.bookingDate ? new Date(r.bookingDate) : null;
      if (!dt) return;
      const key =
        view === 'day'
          ? format(dt, 'yyyy-MM-dd')
          : view === 'week'
          ? `${format(dt, 'yyyy')}-W${format(dt, 'II')}`
          : format(dt, 'yyyy-MM');
      map[key] = map[key] || [];
      map[key].push(r);
    });
    return map;
  }, [rows, view]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Calendar</h1>
        <Select value={view} onValueChange={(v) => setView(v as 'day' | 'week' | 'month')}>
          <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="day">Day view</SelectItem>
            <SelectItem value="week">Week view</SelectItem>
            <SelectItem value="month">Month view</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {Object.entries(grouped).map(([bucket, items]) => (
        <Card key={bucket}>
          <CardHeader><CardTitle>{bucket}</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {items.map((b) => (
              <div key={b.id} className="flex items-center justify-between rounded border p-3 text-sm">
                <div>
                  <p className="font-medium">{b.customerName || 'Customer'}</p>
                  <p className="text-muted-foreground">
                    {b.bookingTime ? formatTime24hTo12h(b.bookingTime) : '—'} • {b.assignedCleanerRef?.name || 'Unassigned'}
                  </p>
                </div>
                <Badge variant="outline">{b.status}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
