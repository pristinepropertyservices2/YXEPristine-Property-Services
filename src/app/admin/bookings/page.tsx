'use client';

import { useEffect, useMemo, useState } from 'react';
import { format } from 'date-fns';
import { toast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Loader2 } from 'lucide-react';

type Booking = {
  id: string;
  customerName: string | null;
  email: string | null;
  serviceType: string | null;
  bookingDate: string | null;
  bookingTime: string | null;
  status: 'PENDING' | 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  paymentStatus: string;
  assignedCleanerId: string | null;
  assignedCleanerRef: { id: string; name: string } | null;
};

type Cleaner = { id: string; name: string };

const statusTone: Record<Booking['status'], string> = {
  PENDING: 'bg-yellow-100 text-yellow-900 border-yellow-200',
  CONFIRMED: 'bg-blue-100 text-blue-900 border-blue-200',
  IN_PROGRESS: 'bg-blue-100 text-blue-900 border-blue-200',
  COMPLETED: 'bg-green-100 text-green-900 border-green-200',
  CANCELLED: 'bg-red-100 text-red-900 border-red-200',
};

export default function AdminBookingsPage() {
  const [rows, setRows] = useState<Booking[]>([]);
  const [cleaners, setCleaners] = useState<Cleaner[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [q, setQ] = useState('');
  const [status, setStatus] = useState('all');
  const [paymentStatus, setPaymentStatus] = useState('all');
  const [sort, setSort] = useState<'createdAt' | 'bookingDate' | 'customerName' | 'status'>('createdAt');
  const [dir, setDir] = useState<'asc' | 'desc'>('desc');
  const [workingId, setWorkingId] = useState<string | null>(null);

  const query = useMemo(
    () =>
      new URLSearchParams({
        page: String(page),
        pageSize: '20',
        q,
        status: status === 'all' ? '' : status,
        paymentStatus: paymentStatus === 'all' ? '' : paymentStatus,
        sort,
        dir,
      }).toString(),
    [page, q, status, paymentStatus, sort, dir]
  );

  const load = async () => {
    setLoading(true);
    try {
      const [bookRes, cleanerRes] = await Promise.all([
        fetch(`/api/admin/bookings?${query}`),
        fetch('/api/admin/cleaners'),
      ]);
      const books = await bookRes.json();
      const cData = await cleanerRes.json();
      if (!bookRes.ok) throw new Error(books.error || 'Failed to load bookings');
      if (!cleanerRes.ok) throw new Error(cData.error || 'Failed to load cleaners');
      setRows(books.bookings || []);
      setTotalPages(books.pagination?.totalPages || 1);
      setCleaners((cData.cleaners || []).map((c: { id: string; name: string }) => ({ id: c.id, name: c.name })));
    } catch (e) {
      toast({ title: 'Error', description: e instanceof Error ? e.message : 'Load failed', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, [query]);

  const patchBooking = async (id: string, payload: Record<string, unknown>, successMsg: string) => {
    setWorkingId(id);
    try {
      const res = await fetch(`/api/admin/bookings/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Update failed');
      setRows((prev) => prev.map((r) => (r.id === id ? data.booking : r)));
      toast({ title: 'Updated', description: successMsg });
    } catch (e) {
      toast({ title: 'Error', description: e instanceof Error ? e.message : 'Update failed', variant: 'destructive' });
    } finally {
      setWorkingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Bookings</h1>
        <p className="text-muted-foreground">Manage pending, confirmed, completed and cancelled bookings.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-6">
          <Input placeholder="Search customer/service/email" value={q} onChange={(e) => { setPage(1); setQ(e.target.value); }} className="md:col-span-2" />
          <Select value={status} onValueChange={(v) => { setPage(1); setStatus(v); }}>
            <SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="CONFIRMED">Confirmed</SelectItem>
              <SelectItem value="COMPLETED">Completed</SelectItem>
              <SelectItem value="CANCELLED">Cancelled</SelectItem>
            </SelectContent>
          </Select>
          <Select value={paymentStatus} onValueChange={(v) => { setPage(1); setPaymentStatus(v); }}>
            <SelectTrigger><SelectValue placeholder="Payment" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All payments</SelectItem>
              <SelectItem value="UNPAID">Unpaid</SelectItem>
              <SelectItem value="PAID">Paid</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="COMPLETED">Completed</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sort} onValueChange={(v) => setSort(v as typeof sort)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="createdAt">Newest</SelectItem>
              <SelectItem value="bookingDate">Booking date</SelectItem>
              <SelectItem value="customerName">Customer</SelectItem>
              <SelectItem value="status">Status</SelectItem>
            </SelectContent>
          </Select>
          <Select value={dir} onValueChange={(v) => setDir(v as typeof dir)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="desc">Desc</SelectItem>
              <SelectItem value="asc">Asc</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="overflow-x-auto pt-6">
          {loading ? (
            <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-slate-600" /></div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead>Date/Time</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead>Cleaner</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell>
                      <div className="font-medium">{r.customerName || '—'}</div>
                      <div className="text-xs text-muted-foreground">{r.email || '—'}</div>
                    </TableCell>
                    <TableCell>{r.serviceType || '—'}</TableCell>
                    <TableCell>
                      {r.bookingDate ? format(new Date(r.bookingDate), 'MMM d, yyyy') : '—'}
                      <div className="text-xs text-muted-foreground">{r.bookingTime || '—'}</div>
                    </TableCell>
                    <TableCell>
                      <Badge className={statusTone[r.status]} variant="outline">{r.status.replace('_', ' ')}</Badge>
                    </TableCell>
                    <TableCell>
                      <Select
                        value={r.paymentStatus}
                        onValueChange={(v) => void patchBooking(r.id, { paymentStatus: v }, `Payment status set to ${v}`)}
                        disabled={workingId === r.id}
                      >
                        <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="UNPAID">Unpaid</SelectItem>
                          <SelectItem value="PAID">Paid</SelectItem>
                          <SelectItem value="PENDING">Pending</SelectItem>
                          <SelectItem value="COMPLETED">Completed</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Select
                        value={r.assignedCleanerId || 'unassigned'}
                        onValueChange={(v) =>
                          void patchBooking(
                            r.id,
                            { assignedCleanerId: v === 'unassigned' ? null : v },
                            v === 'unassigned' ? 'Cleaner unassigned' : 'Cleaner assigned and booking confirmed'
                          )
                        }
                        disabled={workingId === r.id}
                      >
                        <SelectTrigger className="w-44"><SelectValue placeholder="Assign cleaner" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="unassigned">Unassigned</SelectItem>
                          {cleaners.map((c) => (
                            <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Select
                        value={r.status}
                        onValueChange={(v) => void patchBooking(r.id, { status: v }, `Booking marked ${v}`)}
                        disabled={workingId === r.id}
                      >
                        <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="PENDING">Pending</SelectItem>
                          <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                          <SelectItem value="COMPLETED">Completed</SelectItem>
                          <SelectItem value="CANCELLED">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
          <div className="mt-4 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Page {page} of {totalPages}</p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>Prev</Button>
              <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>Next</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
