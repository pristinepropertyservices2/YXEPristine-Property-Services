'use client';

import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

type Booking = { id: string; customerName: string | null; totalPrice: number; paymentStatus: string; status: string };

export default function AdminPaymentsPage() {
  const [rows, setRows] = useState<Booking[]>([]);

  useEffect(() => {
    (async () => {
      const res = await fetch('/api/admin/bookings?page=1&pageSize=200');
      const data = await res.json();
      if (res.ok) setRows(data.bookings || []);
    })();
  }, []);

  const stats = useMemo(() => {
    const total = rows.reduce((sum, r) => sum + r.totalPrice, 0);
    const paid = rows.filter((r) => ['PAID', 'COMPLETED'].includes(r.paymentStatus)).reduce((sum, r) => sum + r.totalPrice, 0);
    return { total, paid, pending: Math.max(0, total - paid) };
  }, [rows]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Payments</h1>
      <div className="grid gap-4 md:grid-cols-3">
        <Card><CardHeader><CardTitle>Total value</CardTitle></CardHeader><CardContent>${stats.total.toFixed(2)}</CardContent></Card>
        <Card><CardHeader><CardTitle>Paid</CardTitle></CardHeader><CardContent>${stats.paid.toFixed(2)}</CardContent></Card>
        <Card><CardHeader><CardTitle>Pending</CardTitle></CardHeader><CardContent>${stats.pending.toFixed(2)}</CardContent></Card>
      </div>
      <Card>
        <CardContent className="pt-6 space-y-2">
          {rows.map((r) => (
            <div key={r.id} className="flex items-center justify-between rounded border p-3 text-sm">
              <div>
                <p className="font-medium">{r.customerName || 'Customer'} • ${r.totalPrice.toFixed(2)}</p>
                <p className="text-muted-foreground">{r.id}</p>
              </div>
              <Badge variant="outline">{r.paymentStatus}</Badge>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
