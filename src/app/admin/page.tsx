'use client';

import { useEffect, useState } from 'react';
import { format } from 'date-fns';
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
import { Loader2 } from 'lucide-react';
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
  user: { name: string | null; email: string | null; phone: string | null };
  payment: { status: string } | null;
};

const statuses = ['PENDING', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'] as const;

export default function AdminPage() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [cleanerDrafts, setCleanerDrafts] = useState<Record<string, string>>({});

  const load = async () => {
    const res = await fetch('/api/admin/bookings');
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed');
    setRows(data.bookings || []);
  };

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        await load();
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
      toast({ title: 'Updated', description: `Booking ${status}` });
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

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-slate-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Operations</h1>
        <p className="text-muted-foreground">
          Monitor bookings, services requested, and payment status. Update job status as work
          progresses.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All bookings</CardTitle>
          <CardDescription>
            New bookings start as PENDING until payment confirms (CONFIRMED).
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
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="whitespace-nowrap text-sm">
                    {format(new Date(r.date), 'MMM d, yyyy')}
                    <br />
                    <span className="text-muted-foreground">{r.time}</span>
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
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {rows.length === 0 && (
            <p className="py-8 text-center text-sm text-muted-foreground">No bookings yet.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
