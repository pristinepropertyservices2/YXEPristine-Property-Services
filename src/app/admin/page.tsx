'use client';

import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { formatTime24hTo12h } from '@/lib/time-display';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Loader2, Trash2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

type Row = {
  id: string;
  status: string;
  date: string;
  time: string;
  address: string;
  city: string;
  totalPrice: number;
  assignedCleaner: string | null;
  service: { name: string };
  user: { id: string; name: string | null; email: string | null; phone: string | null };
  payment: { status: string } | null;
};

type CustomerRow = {
  id: string;
  email: string;
  name: string | null;
  phone: string | null;
  emailVerified: string | null;
  createdAt: string;
  bookingCount: number;
};

const statuses = ['PENDING', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'] as const;

export default function AdminPage() {
  const [rows, setRows] = useState<Row[]>([]);
  const [customers, setCustomers] = useState<CustomerRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [confirmDeleteBookingId, setConfirmDeleteBookingId] = useState<string | null>(null);
  const [deletingBookingId, setDeletingBookingId] = useState<string | null>(null);
  const [resettingGoogleId, setResettingGoogleId] = useState<string | null>(null);
  const [cleanerDrafts, setCleanerDrafts] = useState<Record<string, string>>({});

  const loadAll = async () => {
    const [bookRes, userRes] = await Promise.all([
      fetch('/api/admin/bookings'),
      fetch('/api/admin/users'),
    ]);
    const bookData = await bookRes.json();
    if (!bookRes.ok) throw new Error(bookData.error || 'Failed to load bookings');
    const userData = await userRes.json();
    if (!userRes.ok) throw new Error(userData.error || 'Failed to load customers');
    setRows(bookData.bookings || []);
    setCustomers(userData.users || []);
  };

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        await loadAll();
      } catch (e) {
        if (!cancelled) {
          toast({
            title: 'Error',
            description: e instanceof Error ? e.message : 'Load failed',
            variant: 'destructive',
          });
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const patchStatus = async (id: string, status: string) => {
    setUpdating(id);
    try {
      const res = await fetch(`/api/admin/bookings/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Update failed');
      setRows((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: data.booking.status } : r))
      );
      toast({
        title: 'Updated',
        description:
          status === 'CONFIRMED'
            ? 'Booking confirmed. A confirmation email was sent to the customer if SMTP is configured.'
            : `Booking ${status}`,
      });
    } catch (e) {
      toast({
        title: 'Error',
        description: e instanceof Error ? e.message : 'Update failed',
        variant: 'destructive',
      });
    } finally {
      setUpdating(null);
    }
  };

  const patchCleaner = async (id: string) => {
    setUpdating(id);
    try {
      const res = await fetch(`/api/admin/bookings/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assignedCleaner: cleanerDrafts[id] ?? '' }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Update failed');
      setRows((prev) =>
        prev.map((r) =>
          r.id === id ? { ...r, assignedCleaner: data.booking.assignedCleaner } : r
        )
      );
      toast({
        title: 'Cleaner assigned',
        description: data.booking.assignedCleaner
          ? `Assigned to ${data.booking.assignedCleaner}`
          : 'Cleaner assignment cleared',
      });
    } catch (e) {
      toast({
        title: 'Error',
        description: e instanceof Error ? e.message : 'Update failed',
        variant: 'destructive',
      });
    } finally {
      setUpdating(null);
    }
  };

  const deleteCustomer = async (userId: string) => {
    setDeletingUserId(userId);
    try {
      const res = await fetch(`/api/admin/users/${userId}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Delete failed');
      setCustomers((prev) => prev.filter((c) => c.id !== userId));
      setRows((prev) => prev.filter((r) => r.user.id !== userId));
      toast({
        title: 'Customer removed',
        description: 'Account and related records were permanently deleted.',
      });
      setConfirmDeleteId(null);
    } catch (e) {
      toast({
        title: 'Error',
        description: e instanceof Error ? e.message : 'Delete failed',
        variant: 'destructive',
      });
    } finally {
      setDeletingUserId(null);
    }
  };

  const deleteBooking = async (bookingId: string) => {
    setDeletingBookingId(bookingId);
    try {
      const res = await fetch(`/api/admin/bookings/${bookingId}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Delete failed');
      setRows((prev) => prev.filter((r) => r.id !== bookingId));
      toast({
        title: 'Booking deleted',
        description: 'The booking and its payment record (if any) were removed.',
      });
      setConfirmDeleteBookingId(null);
      await loadAll();
    } catch (e) {
      toast({
        title: 'Error',
        description: e instanceof Error ? e.message : 'Delete failed',
        variant: 'destructive',
      });
    } finally {
      setDeletingBookingId(null);
    }
  };

  const disconnectGoogleForUser = async (userId: string) => {
    setResettingGoogleId(userId);
    try {
      const res = await fetch(`/api/admin/users/${userId}/disconnect-google`, { method: 'POST' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Request failed');
      toast({
        title: 'Google sign-in reset',
        description: data.message || 'Done.',
      });
    } catch (e) {
      toast({
        title: 'Error',
        description: e instanceof Error ? e.message : 'Reset failed',
        variant: 'destructive',
      });
    } finally {
      setResettingGoogleId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-slate-600" />
      </div>
    );
  }

  const totalBookings = rows.length;
  const pendingCount = rows.filter((r) => r.status === 'PENDING').length;
  const confirmedCount = rows.filter((r) => r.status === 'CONFIRMED').length;
  const completedCount = rows.filter((r) => r.status === 'COMPLETED').length;
  const pendingPayments = rows.filter((r) => !r.payment || r.payment.status !== 'COMPLETED').length;
  const revenue = rows
    .filter((r) => r.payment?.status === 'COMPLETED')
    .reduce((sum, r) => sum + r.totalPrice, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Operations</h1>
        <p className="text-muted-foreground">
          Monitor bookings, manage customer accounts, and update job status as work progresses.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-6">
        <Card><CardHeader className="pb-2"><CardDescription>Total Bookings</CardDescription><CardTitle>{totalBookings}</CardTitle></CardHeader></Card>
        <Card><CardHeader className="pb-2"><CardDescription>Pending</CardDescription><CardTitle>{pendingCount}</CardTitle></CardHeader></Card>
        <Card><CardHeader className="pb-2"><CardDescription>Confirmed</CardDescription><CardTitle>{confirmedCount}</CardTitle></CardHeader></Card>
        <Card><CardHeader className="pb-2"><CardDescription>Completed</CardDescription><CardTitle>{completedCount}</CardTitle></CardHeader></Card>
        <Card><CardHeader className="pb-2"><CardDescription>Revenue</CardDescription><CardTitle>${revenue.toFixed(2)}</CardTitle></CardHeader></Card>
        <Card><CardHeader className="pb-2"><CardDescription>Pending Payments</CardDescription><CardTitle>{pendingPayments}</CardTitle></CardHeader></Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Customers</CardTitle>
          <CardDescription>
            Customer accounts only. Use <strong>Reset Google</strong> to reconnect Google sign-in for
            an existing account. Delete removes the user and all related data.
          </CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead className="text-center">Bookings</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead>Verified</TableHead>
                <TableHead className="min-w-[220px] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customers.map((c) => (
                <TableRow key={c.id}>
                  <TableCell className="font-medium">{c.email}</TableCell>
                  <TableCell>{c.name || '—'}</TableCell>
                  <TableCell className="text-muted-foreground">{c.phone || '—'}</TableCell>
                  <TableCell className="text-center">{c.bookingCount}</TableCell>
                  <TableCell className="whitespace-nowrap text-sm text-muted-foreground">
                    {format(new Date(c.createdAt), 'MMM d, yyyy')}
                  </TableCell>
                  <TableCell>
                    {c.emailVerified ? (
                      <Badge variant="outline" className="border-green-200 bg-green-50 text-green-800">
                        Yes
                      </Badge>
                    ) : (
                      <Badge variant="secondary">No</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap justify-end gap-2">
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        disabled={resettingGoogleId === c.id || deletingUserId === c.id}
                        onClick={() => void disconnectGoogleForUser(c.id)}
                      >
                        {resettingGoogleId === c.id ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          'Reset Google'
                        )}
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="destructive"
                        className="gap-1"
                        disabled={deletingUserId === c.id || resettingGoogleId === c.id}
                        onClick={() => setConfirmDeleteId(c.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {customers.length === 0 && (
            <p className="py-8 text-center text-sm text-muted-foreground">No customer accounts yet.</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>All bookings</CardTitle>
          <CardDescription>
            New bookings are saved as <strong>PENDING</strong>. Use <strong>Confirm booking</strong> or set
            status to Confirmed to notify the customer; payment may still be required depending on your process.
          </CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>When</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Service</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Cleaner</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="whitespace-nowrap text-sm">
                    {format(new Date(r.date), 'MMM d, yyyy')}
                    <br />
                    <span className="text-muted-foreground">{formatTime24hTo12h(r.time)}</span>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{r.user.name || '—'}</div>
                    <div className="text-xs text-muted-foreground">{r.user.email}</div>
                    {r.user.phone && (
                      <div className="text-xs text-muted-foreground">{r.user.phone}</div>
                    )}
                  </TableCell>
                  <TableCell>{r.service.name}</TableCell>
                  <TableCell className="max-w-[200px] truncate text-sm">
                    {r.address}, {r.city}
                  </TableCell>
                  <TableCell>${r.totalPrice.toFixed(2)}</TableCell>
                  <TableCell>
                    {r.payment ? (
                      <Badge variant="outline">{r.payment.status}</Badge>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex min-w-[220px] items-center gap-2">
                      <Input
                        value={cleanerDrafts[r.id] ?? r.assignedCleaner ?? ''}
                        placeholder="Assign cleaner"
                        onChange={(e) =>
                          setCleanerDrafts((prev) => ({
                            ...prev,
                            [r.id]: e.target.value,
                          }))
                        }
                        disabled={updating === r.id}
                      />
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => patchCleaner(r.id)}
                        disabled={updating === r.id}
                      >
                        Save
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Select
                      value={r.status}
                      disabled={updating === r.id}
                      onValueChange={(v) => patchStatus(r.id, v)}
                    >
                      <SelectTrigger className="w-[160px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {statuses.map((s) => (
                          <SelectItem key={s} value={s}>
                            {s.replace('_', ' ')}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex flex-wrap justify-end gap-2">
                      {r.status === 'PENDING' && (
                        <Button
                          type="button"
                          size="sm"
                          className="bg-purple-700 hover:bg-purple-800"
                          disabled={updating === r.id || !!deletingUserId}
                          onClick={() => void patchStatus(r.id, 'CONFIRMED')}
                        >
                          Confirm booking
                        </Button>
                      )}
                      <Button
                        type="button"
                        size="sm"
                        variant="destructive"
                        className="gap-1"
                        disabled={
                          updating === r.id ||
                          deletingBookingId === r.id ||
                          !!deletingUserId
                        }
                        onClick={() => setConfirmDeleteBookingId(r.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {rows.length === 0 && (
            <p className="py-8 text-center text-sm text-muted-foreground">No bookings yet.</p>
          )}
        </CardContent>
      </Card>

      <AlertDialog
        open={!!confirmDeleteId}
        onOpenChange={(open) => {
          if (!open) setConfirmDeleteId(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this customer?</AlertDialogTitle>
            <AlertDialogDescription>
              This permanently deletes{' '}
              <strong className="text-foreground">
                {customers.find((c) => c.id === confirmDeleteId)?.email ?? 'this account'}
              </strong>
              , their bookings, related payments, and login data. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={!!deletingUserId}>Cancel</AlertDialogCancel>
            <Button
              variant="destructive"
              disabled={!!deletingUserId}
              onClick={() => {
                if (confirmDeleteId) void deleteCustomer(confirmDeleteId);
              }}
            >
              {deletingUserId ? 'Deleting…' : 'Delete customer'}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={!!confirmDeleteBookingId}
        onOpenChange={(open) => {
          if (!open) setConfirmDeleteBookingId(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this booking?</AlertDialogTitle>
            <AlertDialogDescription>
              This removes the booking from your records and deletes any linked payment row in the
              database. It does <strong className="text-foreground">not</strong> refund Stripe or
              PayPal automatically—handle refunds separately if needed. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={!!deletingBookingId}>Cancel</AlertDialogCancel>
            <Button
              variant="destructive"
              disabled={!!deletingBookingId}
              onClick={() => {
                if (confirmDeleteBookingId) void deleteBooking(confirmDeleteBookingId);
              }}
            >
              {deletingBookingId ? 'Deleting…' : 'Delete booking'}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
