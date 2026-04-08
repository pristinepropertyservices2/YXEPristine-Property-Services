'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, Mail, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function AuthErrorPage() {
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
      case 'OAuthAccountNotLinked':
        return 'This email is already associated with another account. Please sign in with the original method.';
      case 'AccessDenied':
        return 'Access denied. Please verify your email address first.';
      default:
        return 'An error occurred during authentication. Please try again.';
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-white p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <CardTitle>Authentication Error</CardTitle>
          <CardDescription>{getErrorMessage()}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {(error === 'invalid_token' || error === 'expired_token') && (
            <div className="bg-purple-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Need a new verification email?
              </p>
              <Link href="/auth/signin">
                <Button variant="link" className="p-0 h-auto text-purple-700 mt-1">
                  Sign in to resend verification
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <Link href="/auth/signin" className="w-full">
            <Button className="w-full bg-purple-700 hover:bg-purple-800">
              Try Again
            </Button>
          </Link>
          <Link href="/" className="flex items-center text-sm text-gray-500 hover:text-gray-700">
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to home
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
