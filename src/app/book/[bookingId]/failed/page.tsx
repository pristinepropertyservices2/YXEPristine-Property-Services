import Link from 'next/link';
import { XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default async function BookingFailedPage({
  params,
}: {
  params: Promise<{ bookingId: string }>;
}) {
  const { bookingId } = await params;

  return (
    <div className="container flex min-h-[70vh] items-center justify-center py-16">
      <Card className="max-w-md text-center">
        <CardHeader>
          <XCircle className="mx-auto h-14 w-14 text-destructive" />
          <CardTitle className="text-2xl">Payment did not complete</CardTitle>
          <CardDescription>
            No charge was finalized. You can try again from your dashboard. Booking:{' '}
            <span className="font-mono text-foreground">{bookingId}</span>
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-2 sm:flex-row sm:justify-center">
          <Button asChild className="bg-purple-700 hover:bg-purple-800">
            <Link href={`/book/${bookingId}/payment`}>Try payment again</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/dashboard">Dashboard</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
