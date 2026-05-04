'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, Mail, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { getAuthErrorMessage } from '@/lib/auth-error-messages';

function AuthErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  const getErrorMessage = () => {
    switch (error) {
      case 'invalid_token':
        return 'The verification link is invalid. Please request a new one.';
      case 'expired_token':
        return 'The verification link has expired. Please request a new one.';
      case 'verification_failed':
        return 'Email verification failed. Please try again.';
      default:
        return getAuthErrorMessage(error);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-purple-50 to-white p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
            <AlertCircle className="h-8 w-8 text-red-600" />
          </div>
          <CardTitle>Authentication Error</CardTitle>
          <CardDescription>{getErrorMessage()}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {(error === 'invalid_token' || error === 'expired_token') && (
            <div className="rounded-lg bg-purple-50 p-4">
              <p className="flex items-center gap-2 text-sm text-gray-600">
                <Mail className="h-4 w-4" />
                Need a new verification email?
              </p>
              <Link href="/auth/signin">
                <Button variant="link" className="mt-1 h-auto p-0 text-purple-700">
                  Sign in to resend verification
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <Link href="/auth/signin" className="w-full">
            <Button className="w-full bg-purple-700 hover:bg-purple-800">Try Again</Button>
          </Link>
          <Link href="/" className="flex items-center text-sm text-gray-500 hover:text-gray-700">
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back to home
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}

export default function AuthErrorPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center p-4 text-muted-foreground">
          Loading…
        </div>
      }
    >
      <AuthErrorContent />
    </Suspense>
  );
}
