'use client';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mail, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function VerifyRequestPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-white p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail className="w-8 h-8 text-purple-600" />
          </div>
          <CardTitle>Check Your Email</CardTitle>
          <CardDescription>
            A verification email has been sent to your email address. Please click the link in the email to verify your account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-purple-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">
              <strong>Didn&apos;t receive the email?</strong>
            </p>
            <ul className="text-sm text-gray-500 mt-2 space-y-1">
              <li>• Check your spam or junk folder</li>
              <li>• Make sure you entered the correct email</li>
              <li>• Wait a few minutes and try again</li>
            </ul>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <Link href="/auth/signin" className="w-full">
            <Button variant="outline" className="w-full">
              Back to Sign In
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
