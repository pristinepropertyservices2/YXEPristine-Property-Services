'use client';

import { useEffect, useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Loader2, Trash2 } from 'lucide-react';

type Cleaner = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  availability: string | null;
  bookings: { id: string }[];
};

export default function AdminCleanersPage() {
  const [rows, setRows] = useState<Cleaner[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: '', email: '', phone: '', availability: '' });

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/cleaners');
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Load failed');
      setRows(data.cleaners || []);
    } catch (e) {
      toast({ title: 'Error', description: e instanceof Error ? e.message : 'Load failed', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { void load(); }, []);

  const createCleaner = async () => {
    try {
      const res = await fetch('/api/admin/cleaners', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Create failed');
      setForm({ name: '', email: '', phone: '', availability: '' });
      toast({ title: 'Cleaner added' });
      await load();
    } catch (e) {
      toast({ title: 'Error', description: e instanceof Error ? e.message : 'Create failed', variant: 'destructive' });
    }
  };

  const remove = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/cleaners/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Delete failed');
      toast({ title: 'Cleaner removed' });
      await load();
    } catch (e) {
      toast({ title: 'Error', description: e instanceof Error ? e.message : 'Delete failed', variant: 'destructive' });
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Cleaners</h1>
      <Card>
        <CardHeader><CardTitle>Add cleaner</CardTitle></CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-4">
          <Input placeholder="Name" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} />
          <Input placeholder="Email" value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} />
          <Input placeholder="Phone" value={form.phone} onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))} />
          <Input placeholder="Availability (e.g. Mon-Fri 9-5)" value={form.availability} onChange={(e) => setForm((p) => ({ ...p, availability: e.target.value }))} />
          <Button onClick={() => void createCleaner()} className="md:col-span-4 w-full md:w-auto">Save cleaner</Button>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-6 overflow-x-auto">
          {loading ? <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin" /></div> : (
            <Table>
              <TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Email</TableHead><TableHead>Phone</TableHead><TableHead>Availability</TableHead><TableHead>Bookings</TableHead><TableHead></TableHead></TableRow></TableHeader>
              <TableBody>
                {rows.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell className="font-medium">{c.name}</TableCell>
                    <TableCell>{c.email || '—'}</TableCell>
                    <TableCell>{c.phone || '—'}</TableCell>
                    <TableCell>{c.availability || '—'}</TableCell>
                    <TableCell>{c.bookings?.length || 0}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="destructive" size="sm" onClick={() => void remove(c.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
